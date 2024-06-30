const LkModel = require('../models/lk.model')
const SessionModel = require('../models/session.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const lk = new LkModel()
const session = new SessionModel()
const {ObjectId} = require('mongodb')
require("core-js/actual/array/group-by");
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

    async statusLK(req, res){
        try {
            const listlk = await lk.list({},{},0);
            var mapLK = listlk.groupBy((lk)=> {return lk.status});
            var {belum_diproses, diproses, menunggu_respon, dikirim, dibatalkan} = mapLK
            var mp = {
                "Belum Diproses" : belum_diproses || [],
                "Diproses" : diproses || [],
                "Menunggu Respon" : menunggu_respon || [],
                "Dikirim" : dikirim || [],
                "Dibatalkan" : dibatalkan || []
            }
            message = {success:true, data:mp};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async statistikLK(req, res){
        try {
            data = req.body
            const listlk = await lk.statistik();
            var a = 0,b = 0,c=0,d=0,e=0
            listlk.forEach(stat => {
                var str = stat._id
                switch (Number(str)) {
                    case 1:
                        a = stat.count
                        break;
                    case 2:
                        b = stat.count
                        break;
                    case 3:
                        c = stat.count
                        break;
                    case 4:
                        d = stat.count
                        break;
                    case 5:
                        e = stat.count
                        break;
                    default:
                        break;
                }
            });
            var dt = {
                "Belum Diproses" : a,
                "Diproses":b,
                "Menunggu Respon":c,
                "Dikirim":d,
                "Dibatalkan":e
            }
            message = {success:true, data:dt};
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