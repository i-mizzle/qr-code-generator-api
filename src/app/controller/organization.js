'use strict';
const mailer = require('../helper/mailer');
const response = require('../responses');
const mongoose = require("mongoose");

const User = mongoose.model('User');
const Airline = mongoose.model('Organization');

module.exports = {
    create: async (req, res) => {
        if (req.user.userType !== "SYSTEM_ADMIN") {
            return response.conflict(res, { message: 'Only an administrator can perform this item'});
        }
        try {
            let airline = new Airline(
                { 
                    airlineName: req.body.airlineName, 
                    airlineType: req.body.airlineType,
                    airlineAdmins: req.body.airlineAdmins,
                    planes: req.body.planes,
                    routes: req.body.routes,
                }
            );
            await airline.save();
            return response.created(res, { airlineDetails: airline });
        } catch (error) {
            return response.error(res, error);
        }
    },
    fetch: async (req, res) => {
        try{
            let airlines = await Airline.find();
            return response.ok(res, { airlines: airlines });
        } catch(error) {
             response.error(res, error);
        }
    },
    fetchOne: async (req, res) => {
        try{
            let airline = await Airline.findOne({ _id: req.params.airlineId });
            return response.ok(res, { airlineDetails: airline });
        } catch(error) {
             response.error(res, error);
        }
    },
    accept: async (req, res) => {
        if (req.user.userType !== "ORG_ADMIN") {
            return response.conflict(res, { message: 'Only an administrator of this airline can perform this action'});
        }
        try {
           
        } catch (error) {
            return response.error(res, error);
        }
    },
    inviteUser: async (req, res) => {
        
    }
}