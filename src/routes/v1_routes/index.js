'use strict';
const router = require('express').Router();
const user = require('../../app/controller/user');
const isAuthenticated = require("./../../middlewares/isAuthenticated");

// add route
router.post('/login', user.login);
router.post('/signup', user.signUp);
router.put('/confirm', user.confirm);
router.post('/me', isAuthenticated, user.me);

module.exports = router
