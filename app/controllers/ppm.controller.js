const PpmModel = require('../models/ppm.model')
const MetadataModel = require('../models/metadata.model')
const Helpers = require('../helpers/general.helper')
const help = new Helpers()
const ppm = new PpmModel()
const {ObjectId} = require('mongodb')
const metadata = new MetadataModel()
var html_to_pdf = require('html-pdf-node');
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

    // print data from html to pdf use puppeteer
    async pdf(req, res){
        try {
            var id = req.params.id;
            const ppmData = await ppm.getDetails(id);
            if (!ppmData) {
                message = {success: false, error: 'PPM not found'};
                res.status(404).send(message);
                return;
            }
            const html = await help.exportPpmPdf(ppmData[0], "")
            // console.log(ppmData[0]);
            // const pdfBuffer = await help.exportHtmlToPdf(html);
            var file = { content: html };
            var options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 600000, waitUntil: 'networkidle0', preferCSSPageSize: true, puppeteerArgs: { headless: true } };
            html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=ppm_report_${ppmData[0].kode}.pdf`
                });
                res.send(pdfBuffer);
            });
            console.log("PDF generated successfully");
            // console.log(pdfBuffer);
            // res.send(html);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async pdfHtml(req, res){
        try {
            var id = req.params.id;
            const ppmData = await ppm.getDetails(id);
            if (!ppmData) {
                message = {success: false, error: 'PPM not found'};
                res.status(404).send(message);
                return;
            }
            const html = await help.exportPpmPdf(ppmData[0], "")
            // console.log(ppmData[0]);
            // const pdfBuffer = await help.exportHtmlToPdf(html);
            // var file = { content: html };
            // var options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'], timeout: 600000, waitUntil: 'networkidle0' };
            // html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            //     res.set({
            //     'Content-Type': 'application/pdf',
            //     'Content-Disposition': `attachment; filename=ppm_report_${ppmData[0].kode}.pdf`
            //     });
            //     res.send(pdfBuffer);
            // });
            console.log("PDF generated successfully");
            // console.log(pdfBuffer);
            res.send(html);
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
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async site(req, res){
        try {
            data = req.body
            const listppm = await ppm.site(data.filter, data.sort, data.limit);
            message = {success:true, data:listppm};
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
            const update = await ppm.update({_id:new ObjectId(id)},upd);
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
            const deleteppm = await ppm.delete(data.id);
            message = {success:true, data:deleteppm};
            res.status(200);
            res.send(message);
        } catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
    async upImg(req, res){
        const filename = req.file.filename;
        // const file = req.file.path;
        // var size = 300;
        // if (req.body.type == 'gaji') {
        //   size = 600;
        // }
        // if (!file) {
        //   res.status(400).send({
        //     status: false,
        //     data: "No File is selected.",
        //   });
        // }
        // resize.resize(filename, size);
        // const url = `https://possaku.s3.amazonaws.com/${process.env.AWS_S3_KEY}/images/${filename}`
        data = {succcess:true, path: `/images/${filename}`}
        res.send(data);
    }
    async upFile(req, res){
        const filename = req.file.filename;
        // const file = req.file.path;
        // var size = 300;
        // if (req.body.type == 'gaji') {
        //   size = 600;
        // }
        // if (!file) {
        //   res.status(400).send({
        //     status: false,
        //     data: "No File is selected.",
        //   });
        // }
        // resize.resize(filename, size);
        // const url = `https://possaku.s3.amazonaws.com/${process.env.AWS_S3_KEY}/images/${filename}`
        data = {succcess:true, path: `/file/${filename}`}
        res.send(data);
    }
}
module.exports = PpmController;