const express = require('express');
const http = require('http');

const cors = require('cors');
const { errors } = require('celebrate');
require('dotenv').config();

const app = express();

const server = http.createServer(app);

const io = require('./socket').init(server);

const socketObj = require('./socket');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const messageRoutes = require('./routes/messageRoutes');

const connectedUsers = [];

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);
app.use(friendshipRoutes);
app.use(messageRoutes);

app.use(errors());

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    console.log(error);
    res.status(status).send({message: error.message});
})


server.listen(process.env.PORT);
// console.log(socketObj.getIo);
io.on('connection', socket => {
    // console.log('user connected', socket.id);

    socket.on('user_connected', userId => {
        console.log('CONNECTEEEEEEED');
        // console.log(userId)
        socketObj.connectedUsers.push({
            userId: userId, socketId: socket.id
        });
        console.log('usersConnected', socketObj.connectedUsers);
        socket.broadcast.emit('userOnline', userId);
    });

    socket.on('typing', data => {
        console.log(data.sender, ' is typing to ', data.receiver);
        let getUser = socketObj.connectedUsers.filter(user => {
            return user.userId == data.receiver;
        })
        console.log('getUser', getUser);
        if(getUser.length > 0) {
            console.log('socketid', getUser[0].socketId);
            console.log('sent');
            socketObj.getIo().to(getUser[0].socketId).emit('typing', parseInt(data.sender));
        }

    });

    // socket.on('user_disconnected', userId => {
        
    // });

    socket.on('disconnect', () => {
        const user = socketObj.connectedUsers.filter(user => {
            return user.socketId == socket.id;
        })
        console.log('user_disconnected', user);
        const index = socketObj.connectedUsers.indexOf(user[0]);
        console.log('index', index);
        if(index >= 0) {
            socketObj.connectedUsers.splice(index, 1);
        }
        console.log(socketObj.connectedUsers);
        console.log('disconnected');
        socket.broadcast.emit('userOffline', user.userId);
    });

})
// socket.on('userID', socket => {
//     console.log(socket);
// });

