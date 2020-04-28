const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const config = require("config");
const response = require('../responses');
const helper = require('./helper');
const mongoose = require("mongoose");
const Qrcode = mongoose.model('Qrcode');


const s3 = new AWS.S3({
    accessKeyId: config.awsS3.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.awsS3.AWS_SECRET_ACCESS_KEY
});

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'evendor-posts',
        // bucket: s3Bucket,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
});

const uploadBase64 = async (uploadData, res) => {
    AWS.config = {
        accessKeyId: config.awsS3.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.awsS3.AWS_SECRET_ACCESS_KEY,
        // region:"us-east-1"
    }

    const s3Bucket = new AWS.S3({ params: { Bucket: 'evendor-posts' } });
    // req.body.imageBinary.
    // let buf = new Buffer(base64Image)
    let buf = new Buffer(uploadData.base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let key = Date.now().toString() + '_' + helper.generateRandomCode(15)
    var data = {
        Key: key,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    
    await s3Bucket.putObject(data,  async (err, data) => {
        try{
            let url = 'https://evendor-posts.s3.amazonaws.com/' + key 

            let qrCodeObject = new Qrcode(
                {
                    qrCodeData: uploadData.qrCodeData,
                    qrCodeUrl: url,
                }
            );

            await qrCodeObject.save()

            response.created(res, qrCodeObject)

        } catch (error) {
            console.log('Error uploading data: ', err);
            return response.error(res, err);
        }

    });


}


module.exports = {
    uploadS3: uploadS3,
    uploadBase64: uploadBase64
};