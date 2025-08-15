const ReportModel = require('../models/report.model')
const Helpers = require('../helpers/general.helper')
const { ObjectId } = require('mongodb')
const help = new Helpers()
const report = new ReportModel()
var message, data;

class ReportController {
    async show(req, res){
        try {
            data = req.params;
            const userData = await report.show({_id:new ObjectId(data.id)});
            message = {success: true, user: help.mappingUser(userData)};
            res.status(200).send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
    async insert(req, res){
        try {
            data = req.body;
            const userData = await report.insert(data);
            message = {success: true, user: help.mappingUser(userData)};
            res.status(200).send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async list(req, res){
        try {
            data = req.body
            const listuser = await report.list(data.filter, data.sort, data.limit);
            message = {success:true, data:listuser};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async update(req, res){
        try {
            data = req.body
            var upd = {$set : data};
            var id = req.params.id;
            const update = await report.update({_id: new ObjectId(id)},upd);
            message = {success:true, data:help.mappingUser(update)};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async delete(req, res){
        try {
            data = req.params
            const deleteuser = await report.delete(data.id);
            message = {success:true, data:deleteuser};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
}

module.exports = ReportController;