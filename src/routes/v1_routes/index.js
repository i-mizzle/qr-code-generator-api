'use strict';
const router = require('express').Router();
const user = require('../../app/controller/user');
const shipment = require('../../app/controller/shipment');
const airline = require('../../app/controller/airline');
const isAuthenticated = require("./../../middlewares/isAuthenticated");

// add route
router.post('/login', user.login);
router.post('/signup', user.signUp);
router.put('/confirm/:confirmationCode', user.confirm);
router.post('/me', isAuthenticated, user.me);

router.post('/shipment', isAuthenticated, shipment.create);
router.get('/shipment', isAuthenticated, shipment.fetch);
router.get('/shipment/:shipmentId', isAuthenticated, shipment.fetchOne);
router.put('/shipment/:shipmentId', isAuthenticated, shipment.acceptShipment);

router.post('/airline', isAuthenticated, airline.create);
router.get('/airline', airline.fetch);
router.get('/airline/:airlineId', airline.fetchOne);


module.exports = router
