const MongoConText = require("../../config/mongodb");
const Constant = require("../../config/constant");
const { ObjectId } = require("mongodb");

class Officer {
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
        const result = await db.collection('officer').insertOne(data);
        return this.show({_id:new ObjectId(result.insertedId)});
    }

    async list(filter, sort = {_id:-1}, limit = 1000){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        console.log("Officer List Filter:", filter);
        const result = await db.collection('officer').find(filter).sort(sort).limit(limit);
        return result.toArray();
    }

    async show(filter, projection = {}){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('officer').findOne(filter, projection)
        return result;
    }

    async shows(id){
        const result = await this.show({_id:new ObjectId(id)})
        return result;
    }

    async findOne(filter){
        const db = await this.getInstance();    
        const result = await db.collection('officer').findOne(filter)
        return result;
    }

    async update(id, upd){
        const db = await this.getInstance();
        id.deleted_at = {$exists:false}
        upd.$set.updated_at = new Date();
        await db.collection('officer').updateOne(id,upd);
        const show = await this.show(id._id);
        return show;
    }

    async addLastActivityDate(nsim){
        const db = await this.getInstance();
        const id = {nsim:nsim.toString()}
        const upd = {$set:{last_activity_date: new Date()}}
        await db.collection('officer').updateMany(id,upd);
    }

    async delete(id){
        const db = await this.getInstance();
        var update = {$set:{deleted_at:new Date()}};
        const result = await db.collection('officer').updateOne({_id:new ObjectId(id), deleted_at:{$exists : false}},update);
        // var message = Constant.FAILED_DELETE_DATA;
        // var dlt = result.result;
        // if (dlt.nModified == 1 && dlt.ok == 1) {
            var message = Constant.SUCCESS_DELETE_DATA;
        // }
        return message;
    }
}
module.exports = Officer;