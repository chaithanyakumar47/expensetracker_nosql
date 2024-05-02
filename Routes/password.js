const userAuthentication = require('../middleware/auth');
const passwordController = require('../Controller/password')
const express = require('express');
const router = express.Router();

router.post('/forgotpassword', userAuthentication.authenticate, passwordController.forgotpassword);

router.get('/resetpassword/:uuid', passwordController.resetpassword);

router.get('/updatepassword/:id', passwordController.updatepassword);

module.exports = router;