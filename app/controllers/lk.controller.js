const LkModel = require('../models/lk.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const lk = new LkModel()
const {ObjectId} = require('mongodb')
const axios = require('axios');
require("core-js/actual/array/group-by");
class LkController{
    async insert(req, res){
        try {
            var data = req.body;
            data.status = 0
            const lkData = await lk.insert(data);
            var message = {success: true, lk: lkData};
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
            const lkData = await lk.show(data.id);
            if (lkData) {
                lkData.status = help.statusLK(lkData.status)
            }
            var message = {success: true, data: lkData};
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
            var listlk = await lk.list(data.filter, data.sort, data.limit);
            listlk.map((lk)=>{
                lk.status = help.statusLK(lk.status)
            })
            var message = {success:true, data:listlk};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async statusLK(req, res){
        try {
            const listlk = await lk.list({},{},0);
            var mapLK = listlk.groupBy((lk)=> {return lk.status});
            var mp = {
                "Belum Diproses" : mapLK["0"] || [],
                "Diproses" : mapLK["1"] || [],
                "Menunggu Respon" :mapLK["2"] || [],
                "Dikirim" : mapLK["3"] || [],
                "Dibatalkan" : mapLK["4"] || []
            }
            var message = {success:true, data:mp};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async statistikLK(req, res){
        try {
            // var data = req.body
            const listlk = await lk.statistik();
            var a = 0,b = 0,c=0,d=0,e=0
            listlk.forEach(stat => {
                var str = stat._id
                switch (Number(str)) {
                    case 0:
                        a = stat.count
                        break;
                    case 1:
                        b = stat.count
                        break;
                    case 2:
                        c = stat.count
                        break;
                    case 3:
                        d = stat.count
                        break;
                    case 4:
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
            var message = {success:true, data:dt};
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
            var update = await lk.update({_id:new ObjectId(id)},upd);
            if (update) {
                update.status = help.statusLK(update.status)
            }
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
            const deletelk = await lk.delete(data.id);
            var message = {success:true, data:deletelk};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async slmon(req, res){
        try {
            var date = Date.now()
            const call = await axios.get(`http://202.90.198.40/sismon-wrs/assets/sismon-slmon2/data/slmon.all.laststatus.json?_=${date}`)
            res.status(200);
            res.send(call.data);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
}
module.exports = LkController;