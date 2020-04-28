'use strict';
const userHelper = require('./../helper/user');
const helpers = require('./../helper/helper');
const response = require('./../responses');
const passport = require('passport');
const jwtService = require("./../services/jwtService");
const mongoose = require("mongoose");
const User = mongoose.model('User');

module.exports = {
    // login controller
    login: async (req, res) => {
        let user = await User.findOne({ email: req.body.email });
        console.log(user)
        passport.authenticate('local', async (err, user, info) => {
            if (err) { return response.error(res, err); }
            if (!user) { return response.unAuthorize(res, info); }
            let token = await new jwtService().createJwtToken({ id: user._id, name: user.name, userType: user.userType });

            var userDetails = user
            delete userDetails.password;
            delete userDetails.confirmationCode;

            return response.ok(res, {
                token,
                userId: user._id,
                name: user.name,
                organization: user.organization,
                email: user.email,
                phone: user.phone,
                userType: user.userType
            });
        })(req, res);
    },
    signUp: async (req, res) => {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                let user = new User(
                    {
                        email: req.body.email,
                        phone: req.body.phone,
                        userType: req.body.userType,
                        name: req.body.name
                    }
                );
                user.password = user.encryptPassword(req.body.password);
                user.confirmationCode = helpers.generateRandomCode(35);
                if (req.body.userType === 'TRAINEE') {
                    user.organizations = req.body.organizations
                }

                if (req.body.userType === 'ORG_ADMIN') {
                    // if the signup is as an organization and an organization ID is not provided, create the organization with the org objsect supplied
                    if (!req.body.organizationId) {
                        let createdOrganization = await organizationHelper.createOrganization(req.body.organization)
                        if (!createdOrganization) {
                            return response.error(res, { message: "Sorry, there was a problem creating the organization" })
                        }
                        user.organization = {
                            organization: createdOrganization._id.toString(),
                            role: req.body.organization.role
                        }
                    }

                    // if the signup is as an organization and an organization ID is provided, create the user as admin for that organization
                    if (req.body.organizationId && req.body.organizationId !== '') {
                        let organizationDetails = await Organization.findOne({ _id: req.body.organizationId })
                        let inviteeEmails = []
                        for (let i = 0; i < organizationDetails.invitees.length; i++) {
                            inviteeEmails.push(organizationDetails[i].email)
                        }
                        if (!inviteeEmails.includes(req.body.email)) {
                            return response.conflict(res, { message: 'Sorry, you have not been invited to be an administrator of this organization' });
                        }
                    }

                    if (req.body.organizationId && req.body.organizationId === '') {
                        return response.conflict(res, { message: 'Please provide an Organization for this Organization Admin' });
                    }
                }


                await user.save();

                return response.created(res, { email: user.email });


            } else {
                return response.conflict(res, { message: 'Account already exists for email: ' + user.email });
            }
        } catch (error) {
            return response.error(res, error);
        }
    },
    confirm: async (req, res) => {
        try {
            let user = await User.findOne({
                confirmationCode: req.params.confirmationCode,
                confirmed: false
            });
            if (user) {
                user.confirmed = true

                await user.save();
                return response.ok(res, { user });
            } else {
                return response.conflict(res, { message: 'user not found or account already confirmed' });
            }
        } catch (error) {
            return response.error(res, error);
        }
    },
    getUserDetails: async (req, res) => {
        try {
            let user = await userHelper.find({ _id: req.user.id });
            return response.ok(res, user);
        }
        catch (error) {
            return response.error(res, error);
        }
    }

};
