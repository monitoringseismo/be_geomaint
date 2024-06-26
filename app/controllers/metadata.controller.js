const MetadataModel = require('../models/metadata.model')
const SessionModel = require('../models/session.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const metadata = new MetadataModel()
const {ObjectId} = require('mongodb')
const session = new SessionModel()
var message, data
class MetadataController{
    async insert(req, res){
        try {
            data = req.body;
            const metadataData = await metadata.insert(data);
            message = {success: true, metadata: metadataData};
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
            const metadataData = await metadata.show(data.id);
            message = {success: true, metadata: metadataData};
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
            const listmetadata = await metadata.list(data.filter, data.sort, data.limit);
            message = {success:true, data:listmetadata};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
    async statusSensor(req, res){
        try {
            data = req.body
            const listmetadata = await metadata.list({}, {}, 1000);
            message = {success:true, data:listmetadata};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async update(req, res){
        try {
            data = req.body
            var upd = {$set : data};
            var id = req.params.id;
            const update = await metadata.update({_id:new ObjectId(id)},upd);
            message = {success:true, data:update};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async delete(req, res){
        try {
            data = req.params
            const deletemetadata = await metadata.delete(data.id);
            message = {success:true, data:deletemetadata};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
}
module.exports = MetadataController;