'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// const bcrypt = require('bcrypt');
const assessmentSchema = new mongoose.Schema({
    training:{
        type: ObjectId, 
        ref: 'Training' 
    },
    assessmentTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    questions: [
        {
            question: {
                type: String,
            }, 
            options: [
                {
                    option: {type:String},
                    optionLabel:{type: String, enum:['A','B','C','D']}
                }
            ],
            correctAnswer: {
                type: String,
                enum:['A','B','C','D']
            }
        },
    ],
    passingScore: {
        type: Number, 
    }
}, {
    timestamps: true
});
assessmentSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});
module.exports = mongoose.model('Assessment', assessmentSchema);
