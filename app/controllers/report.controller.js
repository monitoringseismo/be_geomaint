const ReportModel = require('../models/report.model')
const Helpers = require('../helpers/general.helper')
const { ObjectId } = require('mongodb')
const help = new Helpers()
var html_to_pdf = require('html-pdf-node');
const report = new ReportModel()
var message, data;

class ReportController {
    async show(req, res){
        try {
            data = req.params;
            console.log("Fetching report with ID:", data.id);
            const reportData = await report.findOne({_id:new ObjectId(data.id)});
            message = {success: true, report: reportData};
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

    async pdf(req, res){
        try {
            var id = req.params.id;
            console.log("Generating PDF for report ID:", id);
            const reportData = await report.findOne({_id:new ObjectId(id)});
            console.log("Report Data:", reportData);
            if (!reportData) {
                res.status(404).send({ success: false, error: 'Report not found' });
                return;
            }
            var html;
            switch (reportData.type) {
                case 'identifikasi_form':
                    // Handle identifikasi_form report
                    html = help.exportIdentifikasiForm(reportData);
                    break;
                case 'checklist_form':
                    // Handle checklist_form report
                    break;
                case 'pemeliharaan_form':
                    // Handle pemeliharaan_form report
                    break;
                default:
                    break;
            }
            // const pdf = await report.pdf(id);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=report_${id}.pdf`);
            res.send(html);
        }  catch (error) {
            message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message); 
        }
    }

    async pdf2(req, res){
        try {
            var id = req.params.id;
            console.log("Generating PDF for report ID:", id);
            const reportData = await report.findOne({_id:new ObjectId(id)});
            // console.log("Report Data:", JSON.stringify(reportData));
            if (!reportData) {
                res.status(404).send({ success: false, error: 'Report not found' });
                return;
            }
            var html;
            switch (reportData.type) {
                case 'identifikasi_form':
                    // Handle identifikasi_form report
                    html = help.exportIdentifikasiForm(reportData, "");
                    break;
                case 'checklist_form':
                    // Handle checklist_form report
                    html = help.exportCheckListForm(reportData);
                    break;
                case 'pemeliharaan_form':
                    // Handle pemeliharaan_form report
                    html = help.exportPemeliharaanForm(reportData);
                    break;
                default:
                    html = help.exportInaTEWS(reportData);
                    break;
            }
            // const pdf = await report.pdf(id);
            // console.log(html)
            var file = { content: html };
                        var options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 600000, waitUntil: 'networkidle0', preferCSSPageSize: true, puppeteerArgs: { headless: true } };
                        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                            res.set({
                            'Content-Type': 'application/pdf',
                            'Content-Disposition': `attachment; filename=report_${id}.pdf`
                            });
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', `attachment; filename=report_${id}.pdf`);
                            res.send(pdfBuffer);
                        });
        }  catch (error) {
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