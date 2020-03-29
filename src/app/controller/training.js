'use strict';
const userHelper = require('../helper/user');
const mailer = require('../helper/mailer');
const response = require('../responses');
const passport = require('passport');
const jwtService = require("../services/jwtService");
const mongoose = require("mongoose");

const Training = mongoose.model('Training');
module.exports = {
    create: async (req, res) => {
        try {
            let user = await userHelper.find({ _id: req.user.id });
            if(userHelper.isOrganizationAdmin(user, req.params.organizationId)){
                let training = new Training(
                    { 
                        trainingOwner: req.params.organizationId, 
                        name: req.body.name,
                        description: req.body.description,
                        prerequisites: req.body.prerequisites,
                        attendees: req.body.attendees,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    }
                );
                await training.save();
                return response.created(res, { trainingDetails: training });
            } else {
                return response.conflict(res, {message: "Sorry, You are not authorized to create trainings for this Organization"})
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    fetchAll: async (req, res) => {
        try{
            let trainings = await Training.find();
            return response.ok(res, { trainings: trainings });
        } catch(error) {
             response.error(res, error);
        }
    },

    fetchAllForOrganization: async (req, res) => {
        try{
            let trainings = await Training.find({trainingOwner: req.params.organizationId});
            return response.ok(res, { trainings: trainings });
        } catch(error) {
             response.error(res, error);
        }
    },

    fetchOne: async (req, res) => {
        try{
            let training = await Training.findOne({ _id: req.params.trainingId });
            return response.ok(res, { trainingDetails: training });
        } catch(error) {
             response.error(res, error);
        }
    },

    assignToUsers: async (req, res) => {
        try {
            let training = await Training.findOne({ _id: req.params.trainingId });
            if(!training){
                return response.notFound(res, {message: "Training not found"})
            }
            let user = await userHelper.find({ _id: req.user.id });
            if(userHelper.isOrganizationAdmin(user, training.trainingOwner)){
                let assignees = req.body.assignees;
                let assigneesNotAdded = []
                assignees.forEach(assignee => {

                    // TO DO: Check if the assignee has passed the prerequisites for this training 
                    // If they have not, push them to a separate array and return with the success object

                    training.attendees.push(assignee)
                });
                await training.save();
                return response.ok(res, { trainingDetails: training });
            } else {
                return response.conflict(res, {message: "Sorry, You are not authorized to add trainees for this Organization"})
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    update: async (req, res) => {

    }
}