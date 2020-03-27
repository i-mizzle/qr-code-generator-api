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
            let airline = new Airline(
                { 
                    organizationName: inputData.airlineName, 
                    invitees: inputData.airlineAdmins,
                }
            );
            await airline.save();
            return true;
        } catch (error) {
            return response.error(res, error);
        }
    }
};
