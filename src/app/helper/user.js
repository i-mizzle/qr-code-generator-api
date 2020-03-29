'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = {
    deleteUser: (condition) => {
        return User.remove(condition);
    },
    find: (condition) => {
        return User.findOne(condition, { password: 0, __v: 0 });
    },
    isOrganizationAdmin: (user, organizationId) => {
        if(user.organization.organization.toString() === organizationId.toString() && user.organization.role === "ADMIN"){
            return true;
        } else {
            return false
        }
    }
};
