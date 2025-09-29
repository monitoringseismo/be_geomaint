const SukuCadangModel = require('../models/sukucadang.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const sukuCadang = new SukuCadangModel()
const {ObjectId} = require('mongodb')
const axios = require('axios');
require("core-js/actual/array/group-by");
class SkController{
    async insert(req, res){
        try {
            var data = req.body;
            data.status = 0
            const sukuCadangData = await sukuCadang.insert(data);
            var message = {success: true, sukuCadang: sukuCadangData};
            res.status(200).send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async show(req, res){
        try {
            var data = req.params;
            const sukuCadangData = await sukuCadang.show(data.id);
            var message = {success: true, data: sukuCadangData};
            res.status(200).send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }


    async list(req, res){
        try {
            var data = req.body
            var listSukuCadang = await sukuCadang.list(data.filter, data.sort, data.limit);
            // listSukuCadang.map((sukuCadang)=>{
            //     sukuCadang.status = help.statusLK(sukuCadang.status)
            // })
            var message = {success:true, data:listSukuCadang};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async update(req, res){
        try {
            var data = req.body
            var upd = {$set : data};
            var id = req.params.id;
            var update = await sukuCadang.update({_id:new ObjectId(id)},upd);
            // if (update) {
            //     update.status = help.statusLK(update.status)
            // }
            var message = {success:true, data:update};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async delete(req, res){
        try {
            var data = req.params
            const deletesc = await sukuCadang.delete(data.id);
            var message = {success:true, data:deletesc};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
}
module.exports = SkController;