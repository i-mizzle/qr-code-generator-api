'use strict';
const router = require('express').Router();
const user = require('../../app/controller/user');
const organization = require('../../app/controller/organization');
const training = require('../../app/controller/training');
const assessment = require('../../app/controller/assessment');
const isAuthenticated = require("./../../middlewares/isAuthenticated");
const isConfirmed = require("./../../middlewares/isConfirmed");

// add route
router.post('/login', user.login);
router.post('/signup', user.signUp);
router.put('/confirm/:confirmationCode', user.confirm);
router.get('/user', isAuthenticated, user.getUserDetails);

router.post('/organization', isAuthenticated, organization.create);
router.get('/organization', organization.fetch);
router.get('/organization/:organizationId', organization.fetchOne);

router.post('/training/:organizationId', isAuthenticated, isConfirmed, training.create);
router.get('/training/:trainingId', isAuthenticated, isConfirmed, training.fetchOne);
router.get('/training', isAuthenticated, isConfirmed, training.fetchAll);
router.get('/training/organization/:organizationId', isAuthenticated, isConfirmed, training.fetchAllForOrganization);
router.post('/training/assign/:trainingId', isAuthenticated, isConfirmed, training.assignToUsers);
router.get('/training/update/:trainingId', isAuthenticated, isConfirmed, training.update);

router.post('/assessment/training/:trainingId', isAuthenticated, isConfirmed, assessment.create);


module.exports = router
