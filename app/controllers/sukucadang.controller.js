const SukuCadangModel = require('../models/sukucadang.model')
const sukuCadang = new SukuCadangModel()
const {ObjectId} = require('mongodb')
const XLSX = require('xlsx');
const fs = require('fs');
const MetadataModel = require('../models/metadata.model')
const metadata = new MetadataModel()
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
            var listSukuCadang = await sukuCadang.downloadHistorySukuCadang(data.filter, data.sort, data.limit);
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

    async _inboundSukuCadang(data) {
        data.type = 'inbound'
        data.created_at = new Date();
        const checkSukuCadang = await sukuCadang.show(data.suku_cadang_id);
        if (!checkSukuCadang) {
            throw new Error('Suku cadang tidak ditemukan');
        }
        if (!data.quantity || data.quantity <= 0) {
            throw new Error('Qty harus lebih dari 0');
        }
        if (data.transaction_date) {
            data.transaction_date = new Date(data.transaction_date)
        } else {
            data.transaction_date = new Date()
        }
        const sukuCadangData = await sukuCadang.addHistorySukuCadang(data);
        if (sukuCadangData) {
            var filter = { _id: new ObjectId(data.suku_cadang_id) }
            var upd = { $inc: { quantity: data.quantity }, $set: { updated_at: new Date() } }
            await sukuCadang.update(filter, upd);
        }
        const show = await sukuCadang.showSukuCadangActivity(sukuCadangData.insertedId);
        return { success: true, sukuCadang: sukuCadangData, history: show };
    }

    async inboundSukuCadang(req, res) {
        try {
            const result = await this._inboundSukuCadang(req.body);
            res.status(200).send(result);
        } catch (error) {
            var message = { success: false, error: error.message };
            // await help.pushTelegram(req, error.message);
            res.status(500).send(message);
        }
    }

    async _outboundSukuCadang(data) {
        data.type = 'outbound'
        data.created_at = new Date();
        const checkSukuCadang = await sukuCadang.show(data.suku_cadang_id);
        if (!checkSukuCadang) {
            throw new Error('Suku cadang tidak ditemukan');
        }
        if (!data.quantity || data.quantity <= 0) {
            throw new Error('Qty harus lebih dari 0');
        }
        if (data.quantity > checkSukuCadang.quantity) {
            throw new Error('Qty melebihi stok yang ada');
        }
        if (data.transaction_date) {
            data.transaction_date = new Date(data.transaction_date)
        } else {
            data.transaction_date = new Date()
        }
        const sukuCadangData = await sukuCadang.addHistorySukuCadang(data);
        if (sukuCadangData) {
            var filter = { _id: new ObjectId(data.suku_cadang_id) }
            var upd = { $inc: { quantity: -data.quantity }, $set: { updated_at: new Date() } }
            // console.log(filter, upd);
            await sukuCadang.update(filter, upd);
        }
        const show = await sukuCadang.showSukuCadangActivity(sukuCadangData.insertedId);
        return { success: true, data: show };
    }

    async outboundSukuCadang(req, res) {
        try {
            const result = await this._outboundSukuCadang(req.body);
            res.status(200).send(result);
        } catch (error) {
            var message = { success: false, error: error.message };
            // await help.pushTelegram(req, error.message);
            res.status(500).send(message);
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

    async upFile(req, res){
        try {
            // Pastikan file ada
            if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            // Baca file Excel
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Konversi ke JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

            // Hapus file setelah dibaca (opsional)
            fs.unlinkSync(req.file.path);

            // mapping data dan validasi
            const mappedData = jsonData.map((item, index) => {
            if (!item.nama || !item.merek || !item.quantity) {
                throw new Error(`Missing required fields in row ${index + 2}`);
            }
            return {
                kode: item.kode,
                nama: item.nama,
                jenis: item.jenis,
                merek: item.merek,
                tipe: item.tipe,
                quantity: Number(item.quantity),
                category: item.kategori,
                serial_number: item.serial_number.split(',').map(sn => sn.trim())
            };
            });

            // Insert data ke database
            const insertPromises = mappedData.map(data => sukuCadang.insert(data));
            await Promise.all(insertPromises);

            // Kirim hasil JSON
            return res.json({
            success: true,
            sheetName,
            rows: jsonData.length,
            data: jsonData,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
            success: false,
            message: "Error processing file",
            error: error.message,
            });
        }
        };

        async upFileActivity(req, res){
        try {
            // Pastikan file ada
            if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            // Baca file Excel
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Konversi ke JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });
            // console.log(jsonData);

            // Hapus file setelah dibaca (opsional)
            fs.unlinkSync(req.file.path);

            // mapping data dan validasi
            const mappedDataPromises = jsonData.map(async (item, index) => {
                const sc = await sukuCadang.findOne({ kode: item.kode_sukucadang}, { projection: { _id: 1 } });
                if (!sc) {
                    throw new Error(`Suku cadang tidak ditemukan untuk nama: ${item.nama}, merek: ${item.merek} di row ${index + 2}`);
                }
                const meta = await metadata.findOne({ kode: item.site }, { projection: { _id: 1 } });
                return {
                    suku_cadang_id: sc._id.toString(),
                    type: item.jenis === 'inbound' ? 'inbound' : 'outbound',
                    created_at: new Date(),
                    petugas: item.petugas || 'System',
                    jenis: item.jenis, // inbound/outbound
                    qty: Number(item.quantity),
                    referensi: item.nomor_referensi,
                    keterangan: item.keterangan,
                    transaction_date: item.tanggal_transaksi ? new Date(item.tanggal_transaksi) : new Date(),
                    metadata_id: meta ? meta._id.toString() : null,
                    serial_number: item.serial_number.split(',').map(sn => sn.trim())
                };
            });
            const mappedData = await Promise.all(mappedDataPromises);
            // console.log(mappedData);

            // Insert data ke database
            const insertPromises = mappedData.map(data => {
                if (data.jenis === 'inbound') {
                     this._inboundSukuCadang(data);
                } else if (data.jenis === 'outbound') {
                     this._outboundSukuCadang(data);
                } else {
                    throw new Error(`Invalid type '${data.jenis}' for suku cadang activity`);
                }
            });
            await Promise.all(insertPromises);

            // Kirim hasil JSON
            return res.status(200).json({
            success: true,
            sheetName,
            rows: jsonData.length,
            data: jsonData,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
            success: false,
            message: "Error processing file",
            error: error.message,
            });
        }
        };

    async downloadSukucadang(req, res){
        try {
            var data = req.body;
            
            var listSukuCadang = await sukuCadang.list(data.filter, data.sort, data.limit);
            console.log(listSukuCadang);
            const filePath = `public/file/sukucadang_report_${new Date().toISOString()}.xlsx`;
            
                const worksheet = XLSX.utils.json_to_sheet(listSukuCadang);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "SukuCadang");
                XLSX.writeFile(workbook, filePath);
                res.download(filePath, (err) => {
                        if (err) {
                            console.error("Error downloading the file:", err);
                            res.status(500).send("Error downloading the file");
                        }
                        fs.unlinkSync(filePath);
                });

            // return;
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

    async downloadHistorySukuCadang(req, res){
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
            var listHistorySukuCadang = await sukuCadang.downloadHistorySukuCadang(data.filter, data.sort, data.limit);
            // console.log(listHistorySukuCadang);
            const filePath = `public/file/history_sukucadang_report_${new Date().toISOString()}.xlsx`;

                const worksheet = XLSX.utils.json_to_sheet(listHistorySukuCadang);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "HistorySukuCadang");
                XLSX.writeFile(workbook, filePath);
                res.download(filePath, (err) => {
                        if (err) {
                            console.error("Error downloading the file:", err);
                            res.status(500).send("Error downloading the file");
                        }
                        fs.unlinkSync(filePath);
                });
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }

}
module.exports = SkController;
