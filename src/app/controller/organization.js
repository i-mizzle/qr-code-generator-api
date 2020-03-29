'use strict';
const mailer = require('../helper/mailer');
const response = require('../responses');
const mongoose = require("mongoose");

const User = mongoose.model('User');
const Organization = mongoose.model('Organization');

module.exports = {
    create: async (req, res) => {
        if (req.user.userType !== "SYSTEM_ADMIN") {
            return response.conflict(res, { message: 'Only an administrator can perform this item'});
        }
        try {
            let organization = new Organization(
                { 
                    organizationName: req.body.name, 
                    invitees: req.body.invitees,
                }
            );
            await organization.save();
            return response.created(res, { organizationDetails: organization });
        } catch (error) {
            return response.error(res, error);
        }
    },
    fetch: async (req, res) => {
        try{
            let organizations = await Organization.find();
            return response.ok(res, { organizations: organizations });
        } catch(error) {
             response.error(res, error);
        }
    },
    fetchOne: async (req, res) => {
        try{
            let organization = await Organization.findOne({ _id: req.params.organizationId });
            return response.ok(res, { organizationDetails: Organization });
        } catch(error) {
             response.error(res, error);
        }
    },
    accept: async (req, res) => {
        if (req.user.userType !== "ORG_ADMIN") {
            return response.conflict(res, { message: 'Only an administrator of this organization can perform this action'});
        }
        try {
           
        } catch (error) {
            return response.error(res, error);
        }
    },
    inviteUser: async (req, res) => {
        
    }
}