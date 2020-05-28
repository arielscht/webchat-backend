const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const socket = require('../socket');

const database = require('../database/connection');

exports.create = async (req, res, next) => {
    const { username, name, password } = req.body;
    
    try {
        let user = await database('users').select().where({username: username});
        
        if(user.length > 0) {
            const error = new Error();
            error.message = 'Nome de usuário já cadastrado';
            error.statusCode = 409;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = await database('users').insert({
            username: username,
            name: name,
            password: hashedPassword
        });

        if(!user) {
            const error = new Error('Não foi possível cadastrar o usuário, por favor tente novamente');
            error.statusCode = 500;
            return next(error);
        }

        res.json({
            message: 'Usuário cadastrado com sucesso'
        })
    } catch(error) {
        next(error);
    }
}


exports.getFriends = async (req, res, next) => {
    const userId = req.userId;
    
    try {
        const friendsIds = await getFriendsIds(userId);

        let friends = await database('users')
                                .select('id', 'username', 'name')
                                .whereIn('id', friendsIds.friends);  

        //check for online friends
        const connectedUsers = [...socket.connectedUsers];
        const onlineFriends = connectedUsers.filter(user => {
            if(friendsIds.friends.includes(parseInt(user.userId))) {
                return user.userId;
            }
        }).map(user => {return parseInt(user.userId)});

        friends = friends.map(friend => {
            if(onlineFriends.includes(friend.id)){
                return {...friend, online: true}
            } else {
                return {...friend, online: false}
            }
        })

        // console.log('FRIENDS', friends);

        console.log('online friends: ', onlineFriends);

        res.status(200).json({friends: friends});
    } catch (error) {
        next(error);
    }
}

exports.getByName = async (req, res, next) => {
    const search = req.body.search;

    try {
        const friendsIds = await getFriendsIds(req.userId);

        const users = await database('users')
                            .select('id', 'username', 'name')
                            .where(function(){
                                this.where('username', 'like', '%' + search + '%')
                                .orWhere('name', 'like', '%' + search + '%');
                            })
                            .andWhereNot({id: req.userId});

        const pending = await database('friendships')
                                .select('user_requested', 'requesterId')
                                .where({
                                    status: 0
                                })
                                .andWhere(function() {
                                    this.where('user_requested', req.userId)
                                    .orWhere('requesterId', req.userId);
                                });
        
        const pendingIds = pending.map(pending => {
            if(pending.user_requested != req.userId) {
                return pending.user_requested;
            } else {
                return pending.requesterId;
            }
        })

        res.status(200).json({users, pending: pendingIds, friendsIds: [...friendsIds.friends], userId: req.userId});
    } catch (error) {
        next(error);
    }
}

async function getFriendsIds(userId) {

    const friendships = await database('friendships')
                                .select('user_requested', 'requesterId')
                                .where({
                                    status: 1
                                })
                                .andWhere(function() {
                                    this.where('user_requested', userId)
                                    .orWhere('requesterId', userId);
                                });
                                

    if(friendships.length < 1) {
        return {
            friends: [],
            statusCode: 404,
            message: 'Você não tem amigos'
        }
    }

    const friendsIds = friendships.map(friend => {
        if(friend.user_requested != userId) {
            return friend.user_requested;
        } else {
            return friend.requesterId;
        }
    })

    return {
        friends: [...friendsIds]
    };
}

exports.getFriendsIds = getFriendsIds;