const MongoConText = require("../../config/mongodb");
const Constant = require("../../config/constant");
const { ObjectId } = require("mongodb");

class SC {
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
        const result = await db.collection('suku_cadang').insertOne(data);
        return this.show(result.insertedId);
    }

    async list(filter, sort, limit = 0){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        var result 
        if (limit > 0) {
            result = await db.collection('suku_cadang').find(filter).sort(sort).limit(limit);
        } else {
            result = await db.collection('suku_cadang').find(filter).sort(sort);
        }
        return result.toArray();
    }

    async show(id){
        const db = await this.getInstance();
        const result = await db.collection('suku_cadang').findOne({_id:new ObjectId(id), deleted_at:{$exists:false}});
        return result;
    }

    async update(id, upd){
        const db = await this.getInstance();
        id.deleted_at = {$exists:false}
        upd.$set.updated_at = new Date();
        await db.collection('suku_cadang').updateOne(id,upd);
        const show = await this.show(id._id);
        return show;
    }


    async delete(id){
        const db = await this.getInstance();
        var update = {$set:{deleted_at:new Date()}};
        const result = await db.collection('suku_cadang').updateOne({_id:new ObjectId(id), deleted_at:{$exists : false}},update);
        // var message = Constant.FAILED_DELETE_DATA;
        // var dlt = result.result;
        // if (dlt.nModified == 1 && dlt.ok == 1) {
            var message = Constant.SUCCESS_DELETE_DATA;
        // }
        return message;
    }

    
    async addHistorySukuCadang(data){
        const db = await this.getInstance();
        const result = await db.collection('history_suku_cadang').insertOne(data);
        return result;
    }

    async historySukuCadang(filter, sort, limit = 0){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        var result 
        if (limit > 0) {
            result = await db.collection('history_suku_cadang').find(filter).sort(sort).limit(limit);
        } else {
            result = await db.collection('history_suku_cadang').find(filter).sort(sort);
        }
        return result.toArray();
    }
}
module.exports = SC;