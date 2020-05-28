const express = require('express');

const authController = require('../controllers/auth');

const { loginVal } = require('./validators/validators');

const router = express.Router();


router.post('/login', loginVal, authController.login);



module.exports = router;