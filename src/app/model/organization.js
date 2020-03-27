'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// const bcrypt = require('bcrypt');
const organizationSchema = new mongoose.Schema({
    organizationName:{
        type: String,  
    },
    invitees: [
        {
            name: {
                type:String
            },
            phone: {
                type: String
            },
            email:{
                type: String
            },
            signedUp: {
                type: Boolean,
                default: false
            },
            signUpCode: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
});
organizationSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});
// userSchema.methods.encryptPassword = (password) => {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// };
// userSchema.methods.isValidPassword = function isValidPassword(password) {
//     return bcrypt.compareSync(password, this.password);
// };
module.exports = mongoose.model('Organization', organizationSchema);
