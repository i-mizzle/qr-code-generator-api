const userHelper = require('./../helper/user');
const helpers = require('./../helper/helper');
const response = require('./../responses');
const mongoose = require("mongoose");
const fs = require('fs');
const qrcode = require('qrcode');
const s3 = require('../helper/s3');
const Qrcode = mongoose.model('Qrcode');


module.exports = {
    generateQRCode: async (req, res) => {
        try {
            const qrCode = await qrcode.toDataURL(req.body.qrCodeData);

            // fs.writeFileSync('./qr.html', `<img src="${qrCode}">`);
            // console.log('Wrote to ./qr.html');
            // return response.created(res, 'Wrote to ./qr.html')

            await s3.uploadBase64({
                qrCodeData: req.body.qrCodeData, 
                base64Image: qrCode
            }, res)
        } 
        catch (error) {
            return response.error(res, error)
        }
    },

    listAll: async (req, res) => {
        try{
            let qrCodes = await Qrcode.find();
            return response.ok(res, qrCodes.reverse());
        } catch(error) {
             response.error(res, error);
        }
    },
}