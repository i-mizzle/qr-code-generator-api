'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// const bcrypt = require('bcrypt');
const trainingSchema = new mongoose.Schema({
    trainingOwner:{
        type: ObjectId, 
        ref: 'Organizations' 
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    prerequisites: [
        {
            type: ObjectId, 
            ref: 'Training'
        },
    ],
    status: {
        type: String,
        enum : ['ONGOING','ENDED','PENDING'],
        default: 'PENDING'
    },
    attendees: [
        {
            type: ObjectId, 
            ref: 'User' 
        }
    ],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    // prerequsite: {
    //     isPrerequisite: {
    //         type: Boolean,
    //         default: false
    //     },
    //     isPrerequisiteFor: {
    //         type: ObjectId, 
    //         ref: 'Training'
    //     }
    // }
}, {
    timestamps: true
});
trainingSchema.set('toJSON', {
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
module.exports = mongoose.model('Training', trainingSchema);
