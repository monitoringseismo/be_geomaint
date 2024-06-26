const MongoConText = require("../../config/mongodb");
const Constant = require("../../config/constant");
const { ObjectId } = require("mongodb");

class Users {
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
        const result = await db.collection('users').insertOne(data);
        return this.show({_id:new ObjectId(result.insertedId)});
    }

    async list(filter, sort, limit){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('users').find(filter).sort(sort).limit(limit);
        return result.toArray();
    }

    async show(filter, projection = {}){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('users').findOne(filter, projection)
        return result;
    }

    async shows(id){
        const result = await this.show({_id:new ObjectId(id)})
        return result;
    }

    async update(id, upd){
        const db = await this.getInstance();
        id.deleted_at = {$exists:false}
        upd.$set.updated_at = new Date();
        await db.collection('users').updateOne(id,upd);
        const show = await this.show(id._id);
        return show;
    }


    async delete(id){
        const db = await this.getInstance();
        var update = {$set:{deleted_at:new Date()}};
        const result = await db.collection('users').updateOne({_id:new ObjectId(id), deleted_at:{$exists : false}},update);
        // var message = Constant.FAILED_DELETE_DATA;
        // var dlt = result.result;
        // if (dlt.nModified == 1 && dlt.ok == 1) {
            var message = Constant.SUCCESS_DELETE_DATA;
        // }
        return message;
    }
}
module.exports = Users;