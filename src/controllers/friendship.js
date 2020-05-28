const database = require('../database/connection');
const socket = require('../socket');

exports.create = async (req, res, next) => {
    const { receiver } = req.body;
    const userId = req.userId;
    
    try {
        const userRequested = await database('users').select().where({id: receiver});
        
        if(userRequested.length == 0 ) {
            const error = new Error();
            error.message = 'Usuário solicitado não encontrado';
            error.statusCode = 404;
            throw error;
        }

        const friendship = await database('friendships')
                                    .select()
                                    .where({
                                        user_requested: userId, 
                                        requesterId: receiver 
                                    })
                                    .orWhere({
                                        user_requested: receiver, 
                                        requesterId: userId
                                    });

        if(friendship.length > 0) {
            const error = new Error();
            error.message = 'Solicitação de amizade já existe ou foi recusada';
            error.statusCode = 409;
            throw error
        }

        const sentRequestId = await database('friendships').returning('id').insert({
            status: 0,
            user_requested: receiver,
            user_action: userId,
            requesterId: userId
        });

        const sentRequest = await database('friendships').select('id', 'status', 'user_requested', 'requesterId')
                                                            .first()
                                                            .where({id: sentRequestId[0]});

        console.log("sent", sentRequest);

        const requester = await database('users').select('id', 'username', 'name')
                                                    .first()
                                                    .where({id: sentRequest.requesterId});

        const request = {
            id: sentRequest.id,
            status: sentRequest.status,
            requester: requester
        }

        let getUser = socket.connectedUsers.filter(user => {
            return user.userId == sentRequest.user_requested;
        })
        console.log('getUser', getUser);
        if(getUser.length > 0) {
            console.log('socketid', getUser[0].socketId);
            console.log('sent');
            socket.getIo().to(getUser[0].socketId).emit('newRequest', request);
        }

        res.json({
            message: 'invitation sent', 
            
        });


    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res, next) => {
    const { newStatus, requestId } = req.body;

    try {
        const friendship = await database('friendships').select().where({id: requestId});

        if(friendship.length === 0) {
            const error = new Error('Status de amizade inexistente');
            error.statusCode = 404;
            throw error;
        }
        
        if(friendship[0].user_requested !== req.userId && friendship[0].requesterId !== req.userId) {
            const error = new Error('Usuário sem permissão');
            error.statusCode = 403;
            throw error;
        }

        const result = await database('friendships')
                                .returning('*')
                                .where({id: requestId})
                                .update({
                                    status: newStatus,
                                    user_action: req.userId
                                });
        
        console.log('result: ', result);

        if(!result) {
            const error = new Error('Erro ao atualizar status de amizade, por favor tente novamente');
            error.statusCode = 500;
            throw error;
        }

        if(newStatus === 1) {
            let getUser = socket.connectedUsers.filter(user => {
                return user.userId == result[0].requesterId;
            })
            console.log('getUser', getUser);
            if(getUser.length > 0) {
                console.log('socketid', getUser[0].socketId);
                console.log('sent');
                socket.getIo().to(getUser[0].socketId).emit('requestAccepted');
            }
        }

        res.status(200).json({Message: "Status de amizade atualizado com sucesso"});
    } catch(error) {
        next(error);
    }

}

exports.getPending = async (req, res, next) => {
    const userId = req.userId;

    try {
        const requests = await database('friendships')
                                .select('id', 'status', 'requesterId')
                                .where({
                                    user_requested: req.userId,
                                    status: 0
                                });

        // const requests = await Friendship.findAll({
        //     include: [{model: User, as: 'requester', attributes: ['id', 'name', 'username']}],
        //     attributes: ['id', 'status'],
        //     where:{user_requested: userId, status: 0}
        // });

        if(requests.length < 1) {
            return res.json([]);
        }

        const requestersIds = requests.map(request => {
            return request.requesterId;
        }) 

        const requesters = await database('users')
                                    .select('id', 'username', 'name')
                                    .whereIn('id', requestersIds);

        const response = requests.map((request, index) => {
            delete request.requesterId;
            return {
                ...request,
                requester: requesters[index]
            }
        });

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}