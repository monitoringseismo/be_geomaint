const PpmModel = require('../models/ppm.model')
const MetadataModel = require('../models/metadata.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const ppm = new PpmModel()
const {ObjectId} = require('mongodb')
const metadata = new MetadataModel()
var message, data
class PpmController{
    async insert(req, res){
        try {
            data = req.body;
            const ppmData = await ppm.insert(data);
            if (data.status_site) {
                var query = {kode:data.kode}
                var upd = {$set:{status_site:data.status_site, rekomendasi:data.rekomendasi, last_pm:new Date()}}
                await metadata.update(query,upd)
            }
            message = {success: true, ppm: ppmData};
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
            const ppmData = await ppm.show(data.id);
            message = {success: true, ppm: ppmData};
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
            const listppm = await ppm.list(data.filter, data.sort, data.limit);
            message = {success:true, data:listppm};
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
            const update = await ppm.update({_id:new ObjectId(id)},upd);
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
            const deleteppm = await ppm.delete(data.id);
            message = {success:true, data:deleteppm};
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
module.exports = PpmController;