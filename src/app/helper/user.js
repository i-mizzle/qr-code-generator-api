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
    generateRandomCode: (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
};
