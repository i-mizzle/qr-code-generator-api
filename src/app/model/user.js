'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique:true,
    },
    password: {
        type: String,
    },
    confirmationCode: {
        type: String,
    },
    confirmed:{
        type:Boolean,
        default: false
    },
    userType: {
        type: String,
        enum : ['SYSTEM_ADMIN','TRAINEE','ORG_ADMIN'],
        default: 'TRAINEE'
    },
    organization: {
        organization: {
            type: ObjectId,
            ref: 'Organizations'
        },
        role: {
            type: String,
            enum: ['ADMIN']
        }
    },
    refreshToken: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
userSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', userSchema);
