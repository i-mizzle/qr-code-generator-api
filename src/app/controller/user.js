'use strict';
const userHelper = require('./../helper/user');
const mailer = require('./../helper/mailer');
const response = require('./../responses');
const passport = require('passport');
const jwtService = require("./../services/jwtService");
const mongoose = require("mongoose");

const User = mongoose.model('User');
const Airline = mongoose.model('Airline');
module.exports = {
    // login controller
    login: async (req, res) => {
        let user = await User.findOne({ email: req.body.email, confirmed: true });
        if (!user) {
            return response.conflict(res, { message: 'This account has not been confirmed.'});
        }
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
                businessName: user.business.businessName,
                email: user.email,
                phone: user.phone
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
                        userType: req.body.userType
                    }
                );
                user.password = user.encryptPassword(req.body.password);
                user.confirmationCode = userHelper.generateRandomCode(35);

                if(req.body.userType === 'AIRLINE_ADMIN') {
                    if(!req.body.airline || req.body.airline === ""){
                        return response.conflict(res, { message: 'Please provide an airline for this Airline Admin'});
                    } else {
                        let airlineDetails = await Airline.findOne({_id: req.body.airline})
                        let inviteeEmails =  []
                        for(let i = 0; i < airlineDetails.airlineAdmins.length; i ++){
                            inviteeEmails.push(airlineDetails.airlineAdmins[i].email)
                        }
                        if(!inviteeEmails.includes(req.body.email)){
                            return response.conflict(res, { message: 'Sorry, you have not been invited to be an administrator of this airline'});
                        }
                    }
                }
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
            let user = await User.findOne({ 
                confirmationCode: req.params.confirmationCode, 
                confirmed: false });
            if (user) {
                user.name = req.body.name
                user.business.businessName = req.body.business.businessName
                user.business.businessAddress = req.body.business.businessAddress
                user.business.products = req.body.business.products 
                user.confirmed = true

                await user.save();
                // let token = await new jwtService().createJwtToken({ id: user._id, email: user.username });
                // return response.created(res, { token, email: user.email });
                return response.ok(res, { user });
            } else {
                return response.conflict(res, { message: 'user not found or account already confirmed'});
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
