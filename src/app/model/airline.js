'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// const bcrypt = require('bcrypt');
const airlineSchema = new mongoose.Schema({
    airlineName:{
        type: String,  
    },
    airlineType: {
        type: String,
        enum : ['CARGO','PASSENGER','PRIVATE'],
        default: 'CARGO'
    },
    airlineAdmins: [
        {
            name: {
                type:String
            },
            phone: {
                type: String
            },
            email:{
                type: String
            }
        }
    ],
    planes:[ 
        {
           name: { type:String },
           planeType: { type:String },
           model: { type:String },
           capacity: { type:Number }
        }
    ],
    routes: [
        { routeId: { type: String } }
    ]
}, {
    timestamps: true
});
airlineSchema.set('toJSON', {
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
module.exports = mongoose.model('Airline', airlineSchema);
