const UsersModel = require('../models/user.model')
const SessionModel = require('../models/session.model')
const Helpers = require('../helpers/general.helper')
const { ObjectId } = require('mongodb')
const help = new Helpers()
const user = new UsersModel()
const session = new SessionModel()

var message, data;

class UserController {
    async login(req, res){
        try {
            const {nsim, password} = req.body
            if(!nsim || !password) throw Error("NSIM & Password tidak tepat !")
            const key = help.encryptText(password)
            var filter = {nsim, key}
            const usr = await user.show(filter)
            if (!usr) throw Error("Akun Tidak Ditemukan !");
            var token = await session.generateToken(nsim)
            var mapUsr = help.mappingUser(usr);
            mapUsr.token = token
            message = {success: true, user: mapUsr}
            res.status(200).json(message)
        } catch (error) {
            message = {success :  false, message: error}
            res.status(500).json(message)
        }
    }
    async logout(req, res){
        try {
            
        } catch (error) {
            message = {success :  false, message: error}
            res.status(500).json(message)
        }
    }
    async show(req, res){
        try {
            data = req.params;
            const userData = await user.show({_id:new ObjectId(data.id)});
            message = {success: true, user: help.mappingUser(userData)};
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
            const userData = await user.insert(data);
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
            const listuser = await user.list(data.filter, data.sort, data.limit);
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

    async update(req, res){
        try {
            data = req.body
            var upd = {$set : data};
            var id = req.params.id;
            const update = await user.update({_id: new ObjectId(id)},upd);
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
            const deleteuser = await user.delete(data.id);
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

module.exports = UserController;