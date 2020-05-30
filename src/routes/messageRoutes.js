const express = require('express');

const isAuth = require('../middleware/is-auth');
const messageController = require('../controllers/message');

const router = express.Router();

router.post('/send', isAuth, messageController.create);

router.get('/receive', isAuth, messageController.getMessages);

router.get('/recent', isAuth, messageController.lastMessages);

router.put('/read', isAuth, messageController.updateRead);

router.get('/unread', isAuth, messageController.getUnreadMessages);


module.exports = router;