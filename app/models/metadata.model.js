const MongoConText = require("../../config/mongodb");
const Constant = require("../../config/constant");
const { ObjectId } = require("mongodb");

class Metadata {
    constructor(context){
        this.context = context
    }
    
    async getInstance(){
        if (!this.db) {
            this.db = await MongoConText.getInstance();
        }
        return this.db;
    }

    async insert(data){
        const db = await this.getInstance();
        data.created_at = new Date();
        data.updated_at = new Date();
        const result = await db.collection('metadata').insertOne(data);
        const show = await this.show(result.insertedId)
        return show;
    }

    async list(filter, sort, limit){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('metadata').aggregate([
            { $match: filter },
            {
                $lookup:
                {
                    from: "ppm",
                    let: {
                        kodeMetadata: "$kode"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$kode", "$$kodeMetadata"]
                                }
                            }
                        },
                        {
                            $count: "jumlah"
                        }
                    ],
                    as: "ppm_count"
                }
            },
            {
                $addFields:
                {
                    count_pm: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    "$ppm_count.jumlah",
                                    0
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $unset: 'ppm_count'
            },
            { $sort: sort },
            { $limit: limit }
        ]);
        return result.toArray();
    }

    async downloadReport(filter, sort, limit, columns){
       const projectStage = columns.reduce((acc, field) => {
            acc[field.nama_kolom] = `$${field.kode}`;
            return acc;
            }, { _id: 0 });
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('metadata').aggregate([
            {$match: filter},
            {$sort: sort},
            {$limit: limit},
            {$project: projectStage}
        ]);
        return result.toArray();
    }

    async statistik(){
        const db = await this.getInstance();
        // filter.deleted_at = {$exists:false}
        const result = await db.collection('metadata').aggregate([
            {"$group" : {_id:"$status_site", count:{$sum:1}}}
        ])
        return result.toArray();
    }

    async show(id){
        const db = await this.getInstance();
        const result = await db.collection('metadata').findOne({_id:new ObjectId(id), deleted_at:{$exists:false}});
        return result;
    }

    async findOne(filter, projection = {}){
        const db = await this.getInstance();    
        const result = await db.collection('metadata').findOne(filter, { projection });
        return result;
    }

    async update(id, upd){
        const db = await this.getInstance();
        id.deleted_at = {$exists:false}
        upd.$set.updated_at = new Date();
        await db.collection('metadata').updateOne(id,upd);
        const show = await this.show(id._id);
        return show;
    }


    async delete(id){
        const db = await this.getInstance();
        var update = {$set:{deleted_at:new Date()}};
        const result = await db.collection('metadata').updateOne({_id:new ObjectId(id), deleted_at:{$exists : false}},update);
        // var message = Constant.FAILED_DELETE_DATA;
        // var dlt = result.result;
        // if (dlt.nModified == 1 && dlt.ok == 1) {
            var message = Constant.SUCCESS_DELETE_DATA;
        // }
        return message;
    }

    async column(){
       return [
            { "kode": "kode", "nama_kolom": "Kode" },
            { "kode": "tipe", "nama_kolom": "Tipe" },
            { "kode": "latitude", "nama_kolom": "Latitude" },
            { "kode": "longitude", "nama_kolom": "Longitude" },
            { "kode": "altitude", "nama_kolom": "Altitude" },
            { "kode": "wilayah_waktu", "nama_kolom": "Wilayah Waktu" },
            { "kode": "tahun", "nama_kolom": "Tahun" },
            { "kode": "nama", "nama_kolom": "Nama Site" },
            { "kode": "alamat", "nama_kolom": "Alamat Site" },
            { "kode": "kelurahan", "nama_kolom": "Kelurahan Site" },
            { "kode": "kecamatan", "nama_kolom": "Kecamatan Site" },
            { "kode": "kota_kab", "nama_kolom": "Kota/Kabupaten Site" },
            { "kode": "provinsi", "nama_kolom": "Provinsi Site" },
            { "kode": "nama_cp_site", "nama_kolom": "Nama Penanggung Jawab Site" },
            { "kode": "jabatan_cp_site", "nama_kolom": "Jabatan Penanggung Jawab Site" },
            { "kode": "no_cp_site", "nama_kolom": "No. Telepon Penanggung Jawab Site" },
            { "kode": "stasiun_pj", "nama_kolom": "Nama Stasiun Penanggung Jawab" },
            { "kode": "alamat_pj", "nama_kolom": "Alamat Penanggung Jawab" },
            { "kode": "telp_pj", "nama_kolom": "No. Telepon Penanggung Jawab" },
            { "kode": "kelurahan_pj", "nama_kolom": "Kelurahan Penanggung Jawab" },
            { "kode": "kecamatan_pj", "nama_kolom": "Kecamatan Penanggung Jawab" },
            { "kode": "kota_kab_pj", "nama_kolom": "Kota/Kabupaten Penanggung Jawab" },
            { "kode": "provinsi_pj", "nama_kolom": "Provinsi Penanggung Jawab" },
            { "kode": "jabatan_cp", "nama_kolom": "Jabatan Contact Person" },
            { "kode": "nama_cp", "nama_kolom": "Nama Contact Person" },
            { "kode": "hp_cp", "nama_kolom": "No. HP Contact Person" },
            { "kode": "status", "nama_kolom": "Status Site" },
            { "kode": "akses_lokasi", "nama_kolom": "Akses ke Lokasi" },
            { "kode": "ruangan", "nama_kolom": "Keterangan Ruangan" },
            { "kode": "rekomendasi", "nama_kolom": "Rekomendasi" },
            { "kode": "status_site", "nama_kolom": "Status Kesiapan Site" },
            { "kode": "last_pm", "nama_kolom": "Tanggal Pemeriksaan Terakhir (Last PM)" }
        ];
    }
}
module.exports = Metadata;