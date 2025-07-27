const MongoConText = require("../../config/mongodb");
const Constant = require("../../config/constant");
const { ObjectId } = require("mongodb");

class Ppm {
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
        const result = await db.collection('ppm').insertOne(data);
        const ppm = await this.show(result.insertedId)
        return ppm;
    }

    async list(filter, sort, limit){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('ppm').find(filter).sort(sort).limit(limit);
        return result.toArray();
    }

    async site(filter, sort, limit){
        const db = await this.getInstance();
        var filter = {status_site: filter.status_site, deleted_at: {$exists: false}};
        if (filter.kode) {
            filter.kode = filter.kode;
        }
        const result = await db.collection('ppm').aggregate([
            { $match: filter },
            { $lookup: {
                from: 'metadata',
                localField: 'kode',
                foreignField: 'kode',
                as: 'metadata'
            }},
            { $unwind: '$metadata' },
            { $project: {
                _id: 1,
                kode: 1,
                status_site: 1,
                rekomendasi: 1,
                last_pm: 1,
                metadata: {
                    nama: '$metadata.nama',
                    lokasi: '$metadata.lokasi'
                }
            }}
        ]);
        return result.toArray();
    }

    async show(id){
        const db = await this.getInstance();
        const result = await db.collection('ppm').findOne({_id:new ObjectId(id), deleted_at:{$exists:false}});
        return result;
    }

    async update(id, upd){
        const db = await this.getInstance();
        id.deleted_at = {$exists:false}
        upd.$set.updated_at = new Date();
        await db.collection('ppm').updateOne(id,upd);
        const show = await this.show(id._id);
        return show;
    }


    async delete(id){
        const db = await this.getInstance();
        var update = {$set:{deleted_at:new Date()}};
        const result = await db.collection('ppm').updateOne({_id:new ObjectId(id), deleted_at:{$exists : false}},update);
        // var message = Constant.FAILED_DELETE_DATA;
        // var dlt = result.result;
        // if (dlt.nModified == 1 && dlt.ok == 1) {
            var message = Constant.SUCCESS_DELETE_DATA;
        // }
        return message;
    }
}
module.exports = Ppm;