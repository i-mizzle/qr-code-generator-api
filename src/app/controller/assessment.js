'use strict';
const userHelper = require('./../helper/user');
const helpers = require('./../helper/helper');
const mailer = require('../helper/mailer');
const response = require('../responses');
const mongoose = require("mongoose");
const Training = mongoose.model('Training');

const Assessment = mongoose.model('Assessment');

module.exports = {
    create: async (req, res) => {
        try {
            let user = await userHelper.find({ _id: req.user.id });
            let training = await Training.findOne({ _id: req.params.trainingId });            
            if(userHelper.isOrganizationAdmin(user, training.trainingOwner)){
                let assessment = new Assessment(
                    { 
                        training: req.params.trainingId, 
                        assessmentTitle: req.body.assessmentTitle,
                        description: req.body.description,
                        questions: req.body.questions,
                        passingScore: req.body.passingScore,
                    }
                );
                await assessment.save();
                return response.created(res, { assessmentDetails: assessment });
            } else {
                return response.conflict(res, {message: "Sorry, You are not authorized to create assessments for this Organization"})
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    fetchAll: async (req, res) => {

    },
    fetchAllForOrganization: async (req, res) =>{

    },
    fetchOne: async (req, res) => {

    },
    assignToUsers: async (req, res) => {

    },
    recordScores: async (req,res) => {

    },
    update: async (req, res) => {

    }

}