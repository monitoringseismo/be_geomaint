const SukuCadangModel = require('../models/sukucadang.model')
// const Helpers = require('../helpers/general.helper')
// const help = new Helpers()
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

    // suku cadang activity

    async historySukuCadang(req, res){
        try {
            var data = req.body
            var id = req.params.id;
            if(data?.filter?.startDate && data?.filter?.endDate){
                data.filter.created_at = {
                    $gte: new Date(data.filter.startDate),
                    $lte: new Date(data.filter.endDate  )
                }
                delete data.filter.startDate
                delete data.filter.endDate
            }
            if (id) {
                data.filter = {...data.filter, suku_cadang_id: id}
            }
            console.log(data.filter);
            var skcd = await sukuCadang.show(id);
            if (!skcd) {
                throw new Error('Suku cadang tidak ditemukan');
            }
            var listSukuCadang = await sukuCadang.historySukuCadang(data.filter, data.sort, data.limit);
            // listSukuCadang.map((sukuCadang)=>{
            //     sukuCadang.status = help.statusLK(sukuCadang.status)
            // })
            var message = {success:true, data:{listSukuCadang, suku_cadang: skcd}};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async listHistorySukuCadang(req, res){
        try {
            var data = req.body
            if(data?.filter?.startDate && data?.filter?.endDate){
                data.filter.created_at = {
                    $gte: new Date(data.filter.startDate),
                    $lte: new Date(data.filter.endDate  )
                }
                delete data.filter.startDate
                delete data.filter.endDate
            }
            if (data?.id) {
                data.filter = {...data.filter, suku_cadang_id: data.id}
                delete data.id
            }
            // console.log(data.filter);
            // var skcd = await sukuCadang.show(id);
            // if (!skcd) {
            //     throw new Error('Suku cadang tidak ditemukan');
            // }
            var listSukuCadang = await sukuCadang.historySukuCadang(data.filter, data.sort, data.limit);
            // listSukuCadang.map((sukuCadang)=>{
            //     sukuCadang.status = help.statusLK(sukuCadang.status)
            // })
            var message = {success:true, data:{listSukuCadang}};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async inboundSukuCadang(req, res){
        try {
            var data = req.body;
            data.type = 'inbound'
            data.created_at = new Date();
            const checkSukuCadang = await sukuCadang.show(data.suku_cadang_id);
            if (!checkSukuCadang) {
                throw new Error('Suku cadang tidak ditemukan');
            }
            if (!data.qty || data.qty <= 0) {
                throw new Error('Qty harus lebih dari 0');
            }
            if(data.transaction_date){
                data.transaction_date = new Date(data.transaction_date)
            } else {
                data.transaction_date = new Date()
            }
            const sukuCadangData = await sukuCadang.addHistorySukuCadang(data);
            if (sukuCadangData) {
                var filter = {_id:new ObjectId(data.suku_cadang_id)}
                var upd = {$inc : {quantity: data.qty}, $set: {updated_at: new Date()}}
                const update = await sukuCadang.update(filter, upd);
            }
            const show = await sukuCadang.showSukuCadangActivity(sukuCadangData.insertedId);
            var message = {success: true, sukuCadang: sukuCadangData, history: show};
            res.status(200).send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async outboundSukuCadang(req, res){
        try {
            var data = req.body;
            data.type = 'outbound'
            data.created_at = new Date();
            const checkSukuCadang = await sukuCadang.show(data.suku_cadang_id);
            if (!checkSukuCadang) {
                throw new Error('Suku cadang tidak ditemukan');
            }
            if (!data.qty || data.qty <= 0) {
                throw new Error('Qty harus lebih dari 0');
            }
            if(data.qty > checkSukuCadang.quantity){
                throw new Error('Qty melebihi stok yang ada');
            }
            if(data.transaction_date){
                data.transaction_date = new Date(data.transaction_date)
            } else {
                data.transaction_date = new Date()
            }
            const sukuCadangData = await sukuCadang.addHistorySukuCadang(data);
            if (sukuCadangData) {
                var filter = {_id:new ObjectId(data.suku_cadang_id)}
                var upd = {$inc : {quantity: -data.qty}, $set: {updated_at: new Date()}}
                const update = await sukuCadang.update(filter, upd);
            }
            const show = await sukuCadang.showSukuCadangActivity(sukuCadangData.insertedId);
            var message = {success: true, data: show};
            res.status(200).send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async rekapSukuCadang(req, res){
        try {
            var data = req.body
            if(data?.startDate && data?.endDate){
                var startDate = new Date(data.startDate);
                var endDate = new Date(data.endDate);
            }
            const rekap = await sukuCadang.rekapSukuCadangActivity(startDate, endDate);
            var message = {success:true, data:rekap};
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