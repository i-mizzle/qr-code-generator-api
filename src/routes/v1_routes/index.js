'use strict';
const router = require('express').Router();
const user = require('../../app/controller/user');
const qr = require('../../app/controller/qr');
const isAuthenticated = require("./../../middlewares/isAuthenticated");

// add route
router.post('/login', user.login);
router.post('/signup', user.signUp);
router.put('/confirm/:confirmationCode', user.confirm);
router.get('/user', isAuthenticated, user.getUserDetails);

router.post('/qr/generate', qr.generateQRCode);
router.get('/qr/list', isAuthenticated, qr.listAll);


module.exports = router
