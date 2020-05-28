const express = require('express');

const friendshipController = require('../controllers/friendship');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/request', isAuth, friendshipController.create);

router.put('/request', isAuth, friendshipController.update);

router.get('/requests', isAuth,friendshipController.getPending);

module.exports = router;