const { celebrate, Segments, Joi } = require('celebrate');

exports.signupVal = 
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().pattern(/^[a-zA-z0-9._-]+$/).message('O nome de usuário deve conter apenas letras e números').min(5).required(),
            name: Joi.string().min(1).pattern(/^[a-zA-z \u00C0-\u00FF]+$/).message('O campo nome deve conter apenas letras').trim().required(),
            password: Joi.string().min(8).required()
        })
    });

exports.loginVal = 
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            username: Joi.string().pattern(/^[a-zA-z0-9._-]+$/).min(5).required(),
            password: Joi.string().min(8).required()
        })
    });

exports.findVal =
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            search: Joi.string().min(1).required(),
        })
    });
