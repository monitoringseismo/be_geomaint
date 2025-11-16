const MongoConText = require("../../config/mongodb");
const Helpers = require("../helpers/general.helper");
const helper = new Helpers();


class Access_log {
    constructor(context){
        this.context = context
    }
    
    async getInstance(){
        if (!this.db) {
            this.db = await MongoConText.getInstance();
        }
        return this.db;
    }

    async flagDeleted(nsim){
        const db = await this.getInstance();
        const id = {nsim:nsim.toString()}
        const upd = {$set:{status: "inactive", deleted: true}}
        const result = await db.collection('sessions').updateMany(id,upd);
        return "success"
    }

    async checkAccess(nsim, token){
        var session = false
        if(nsim && token){
        const db = await this.getInstance();
        const data = {nsim:nsim.toString(), token:token.toString()}
        const result = await db.collection('sessions').findOne(data);
        if (result) {
            if (result.status == "active") {
                session = true;
            } else {
                session = false;   
            }
        }
        }
        return session;
    }

    async generateToken(nsim){
        const token = helper.generateRandom(32);
        const db = await this.getInstance();
        // const where = { nsim: nsim };
        // const value = { $set: {status: "inactive"} };
        // await db.collection('sessions').updateMany(where, value);
        const newRecord = {nsim: nsim, status: "active", token: token, created_at: new Date()};
        await db.collection('sessions').insertOne(newRecord);
        return token;
    }

    async getLastLog(nsim){
        const db = await this.getInstance();
        const data = {nsim:nsim.toString(), status:"inactive", deleted:{$exists:false}}
        const result = await db.collection('sessions').find(data).sort({_id:-1}).limit(1);
        return result.toArray();
    }

    async saveLogging(data){
        const db = await this.getInstance();
        const result = await db.collection('logging').insertOne(data);
    }
}

module.exports = Access_log;