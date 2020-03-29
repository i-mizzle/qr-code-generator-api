'use strict';
const response = require('../responses');
const mongoose = require('mongoose');
const Organization = mongoose.model('Organization');
module.exports = {
    deleteOrganization: (condition) => {
        return Organization.remove(condition);
    },
    find: (condition) => {
        return Organization.findOne(condition, { password: 0, __v: 0 });
    },
    createOrganization: async (inputData) => {
        try {
            let organization = new Organization(
                { 
                    organizationName: inputData.organizationName, 
                    invitees: inputData.invitees,
                }
            );
            await organization.save();
            return organization;
        } catch (error) {
            return false;
        }
    }
};
