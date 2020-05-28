const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const { signupVal, findVal } = require('./validators/validators');

const router = express.Router();

router.post('/signup', signupVal, userController.create);

router.get('/friends', isAuth, userController.getFriends);

router.post('/find', isAuth, userController.getByName);



module.exports = router;