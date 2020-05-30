const database = require('../database/connection');
const socket = require('../socket');

const userController = require('./user');

exports.create = async (req, res, next) => {
    const { text, receiver, type } = req.body;
    const userId = req.userId;
    console.log(text, receiver, type, userId);

    try {
        //implementar checagem de existência de grupo quando o tipo ser 1
        //quando implementar mensagem em grupo
        const user = await database('users').select().where({id: receiver});

        console.log(user);

        if(user.length === 0) {
            const error = new Error('O receptor da mensagem não existe');
            error.statusCode = 404;
            throw error
        }

        const message = await database('messages')
                                .returning('*')
                                .insert({
                                    text,
                                    receiver,
                                    type,
                                    sender: userId,
                                });
        console.log('message', message);
        
        if(!message) {
            const error = new Error('Falha ao enviar a mensagem, por favor tente novamente');
            error.statusCode = 500;
            throw error;
        }

        // const savedMessage = await database('messages').select().where('id', message[0].id);
        // console.log('savedmessage', savedMessage);
        console.log('messages', socket.connectedUsers);
        let getUser = socket.connectedUsers.filter(user => {
            return user.userId == receiver;
        })
        console.log('getUser', getUser);
        if(getUser.length > 0) {
            console.log('socketid', getUser[0].socketId);
            console.log('sent');
            socket.getIo().to(getUser[0].socketId).emit('newMessage', message[0]);
        }


        res.status(200).json(message[0]);
        
    } catch (error) {
        next(error);
    }
}

exports.getMessages = async (req, res, next) => {
    const { friendId, page } = req.query;
    const userId = req.userId;

    const totalMessages = await database('messages')
                            .count()
                            .select()
                            .where(function() {
                                this.where('receiver', friendId)
                                .andWhere('sender', userId);
                            })
                            .orWhere(function() {
                                this.where('receiver', userId)
                                .andWhere('sender', friendId);
                            });

    const messages = await database('messages').limit(30).offset(30 * (page - 1)).select().orderBy('created_at', 'desc' )
                            .where(function() {
                                this.where('receiver', friendId)
                                .andWhere('sender', userId);
                            })
                            .orWhere(function() {
                                this.where('receiver', userId)
                                .andWhere('sender', friendId);
                            });
    
    res.status(200).json({messages, totalMessages: parseInt(totalMessages[0].count)});
}

exports.lastMessages = async (req, res, next) => {
    const userId = req.userId;

    const friendsIds = await userController.getFriendsIds(userId);
    
    const lastMessages = [];

    for(let friendId of friendsIds.friends) {
        const message = await database('messages').select()
                                    .first()
                                    .orderBy('created_at', 'desc')
                                    .where({
                                        sender: userId,
                                        receiver: friendId
                                    })
                                    .orWhere({
                                        sender: friendId,
                                        receiver: userId
                                    });
        lastMessages.push({friendId: friendId, message: message});
    }

    res.status(200).json(lastMessages);

}

exports.updateRead = async (req, res, next) => {
    const messagesIds = req.body.messagesIds;
    const userId = req.userId;

    try {
        const messages = await database('messages').select().whereIn('id', messagesIds);
        const sender = messages[0].sender;

        for(let message of messages) {
            if(message.receiver !== userId) {
                const error = new Error('Usuário sem permissão');
                error.statusCode = 403;
                throw error;
            }
        }

        const response = await database('messages').whereIn('id', messagesIds).update({read: 1});

        let getUser = socket.connectedUsers.filter(user => {
            return user.userId == sender;
        })
        console.log('getUser', getUser);
        if(getUser.length > 0) {
            console.log('socketid', getUser[0].socketId);
            console.log('sent');
            socket.getIo().to(getUser[0].socketId).emit('messagesRead', {messagesIds, friendId: userId});
        }

        res.status(200).json({message: 'Visualização da mensagem atualizado com sucesso'});
    } catch(err) {
        next(err);
    }
}

exports.getUnreadMessages = async (req, res, next) => {
    const userId = req.userId;

    try {
        const friendsIds = await userController.getFriendsIds(userId);

        const unreadMessagesQtd = [];

        for(let friendId of friendsIds.friends) {
            const response = await database('messages').count().select().where({
                sender: friendId,
                receiver: userId,
                read: 0 
            });
            unreadMessagesQtd.push({friendId: friendId, count: parseInt(response[0].count)});
        }

        res.status(200).json(unreadMessagesQtd)
    } catch(err) {
        next(err);
    }
}