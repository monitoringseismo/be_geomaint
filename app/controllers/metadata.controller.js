const MetadataModel = require('../models/metadata.model')
const SessionModel = require('../models/session.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const metadata = new MetadataModel()
const {ObjectId} = require('mongodb')
const session = new SessionModel()
const xlsx = require('xlsx');
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
            // await help.pushTelegram(req, error.message);
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
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    //function to download report as .xlsx file
    async downloadReport(req, res){
        try {
            data = req.body
            var columns = data.columns || await metadata.column();
            const listmetadata = await metadata.downloadReport(data.filter, data.sort, data.limit, columns);
            const ws = xlsx.utils.json_to_sheet(listmetadata, {header: columns.map(col => col.nama_kolom)});
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Metadata Report');
            const filePath = `public/file/metadata_report_${new Date().toISOString()}.xlsx`;
            xlsx.writeFile(wb, filePath);
            res.download(filePath);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async statistikSensor(req, res){
        try {
            data = req.body
            var a = 0
            var b = 0
            var c = 0
            const listmetadata = await metadata.statistik();
            listmetadata.forEach(stat => {
                var str = stat._id.toLowerCase();
                console.log(str)
                if (str === "sudah pm dan status ok"){ 
                    a = stat.count
                } else if ( str === "sudah pm tapi perlu penanganan"){
                    b = stat.count
                } else {
                    c = stat.count
                }
            });
            var dt = { "Site ON": a, "Site Off": c, "Site ON Perlu Penanganan" : b}
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
            const update = await metadata.update({_id:new ObjectId(id)},upd);
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
            const deletemetadata = await metadata.delete(data.id);
            message = {success:true, data:deletemetadata};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async column(req, res){
        try {
            console.log("Fetching columns for metadata");
            const columns = await metadata.column();
            message = {success:true, data:columns};
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
module.exports = MetadataController;