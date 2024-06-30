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
        const result = await db.collection('metadata').find(filter).sort(sort).limit(limit);
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
}
module.exports = Metadata;