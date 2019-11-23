'use strict';
const userHelper = require('./../helper/user');
const mailer = require('./../helper/mailer');
const response = require('./../responses');
const passport = require('passport');
const jwtService = require("./../services/jwtService");
const mongoose = require("mongoose");

const User = mongoose.model('User');
module.exports = {
    // login controller
    login: (req, res) => {
        passport.authenticate('local', async (err, user, info) => {
            if (err) { return response.error(res, err); }
            if (!user) { return response.unAuthorize(res, info); }
            let token = await new jwtService().createJwtToken({ id: user._id, email: user.username });
            return response.ok(res, { token, username: user.username });
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
                    }
                );
                user.password = user.encryptPassword(req.body.password);
                user.confirmationCode = userHelper.generateRandomCode(35);

                await user.save();
                if(mailer.sendEmail({
                    mailTo: user.email,
                    subject: 'Welcome to Airhaul',
                    message: 'Follow this link to confirm your account<br> airhaul.com.ng/activation/'+ user.confirmationCode
                })){
                    return response.created(res, { email: user.email });
                }
                
            } else {
                return response.conflict(res, { message: 'Account already exists for email: '+ user.email});
            }
        } catch (error) {
            return response.error(res, error);
        }
    },
    confirm: async (req, res) => {
        try {
            let user = await User.findOne({ _id: req.body.id });
            if (user) {
                // let user = new User(
                //     { 
                //         name: req.body.name, 
                //         phone: req.body.phone,
                //     }
                // );
                user.name = req.body.name
                user.business.businessName = req.body.businessName
                user.business.businessAddress = req.body.businessAddress
                user.business.products = req.body.products 
                await user.save();
                // let token = await new jwtService().createJwtToken({ id: user._id, email: user.username });
                // return response.created(res, { token, email: user.email });
                return response.created(res, { email: user.email });
            } else {
                return response.conflict(res, { message: 'user not found'});
            }
        } catch (error) {
            return response.error(res, error);
        }
    },
    me: async (req, res) => {
        try {
            let user = await userHelper.find({ _id: req.user.id });
            return response.ok(res, user);
        }
        catch (error) {
            return response.error(res, error);
        }
    }

};
