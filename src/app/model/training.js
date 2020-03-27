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
    shipmentSource: {
        type: String,
    },
    shipmentDestination: {
        type: String,
    },
    handlingInstructions: {
        type: String,
    },
    status: {
        type: String,
        enum : ['ONGOING','ENDED','PENDING'],
        default: 'PENDING'
    },
    attendees: [
        {
            type: ObjectId, 
            ref: 'Users' 
        }
    ],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    prerequsite: {
        isPrerequisite: {
            type: Boolean,
            default: false
        },
        isPrerequisiteFor: {
            type: ObjectId, 
            ref: 'Trainings'
        }
    }
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
module.exports = mongoose.model('Trainings', trainingSchema);
