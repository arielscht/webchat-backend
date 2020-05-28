const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const database = require('../database/connection');

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await database('users').select().where({username: username});
        
        if(user.length === 0) {
            const error = new Error();
            error.message = 'Usuário ou senha incorreto';
            error.statusCode = 404;
            return next(error);
        }

        const passResult = await bcrypt.compare(password, user[0].password);
        // console.log('pass: ', passResult);

        if(passResult) {
            const token = jwt.sign({
                userId: user[0].id,
                username: user[0].username
            }, 'h8J9jhd8b20hdHOS17l2q4c3q9GHlqzx7eh5');
            res.status(200).json({
                token: token,
                userId: user[0].id
            });
        } else {
            const error = new Error();
            error.message = 'Usuário ou senha incorreto';
            error.statusCode = 404;
            return next(error);
        }
    } catch (error) {
        next(error);
    }

}