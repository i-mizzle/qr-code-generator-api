'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const qrCodesSchema = new mongoose.Schema({
    qrCodeData: {
        type: String,
    },
    qrCodeUrl: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
qrCodesSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Qrcode', qrCodesSchema);
