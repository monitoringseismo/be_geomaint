const LkModel = require('../models/lk.model')
const SessionModel = require('../models/session.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const lk = new LkModel()
const session = new SessionModel()
const {ObjectId} = require('mongodb')
var message, data
class LkController{
    async insert(req, res){
        try {
            data = req.body;
            const lkData = await lk.insert(data);
            message = {success: true, lk: lkData};
            res.status(200).send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async show(req, res){
        try {
            data = req.params;
            const lkData = await lk.show(data.id);
            message = {success: true, data: lkData};
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
            const listlk = await lk.list(data.filter, data.sort, data.limit);
            message = {success:true, data:listlk};
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
            const update = await lk.update({_id:new ObjectId(id)},upd);
            message = {success:true, data:update};
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
            const deletelk = await lk.delete(data.id);
            message = {success:true, data:deletelk};
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
module.exports = LkController;