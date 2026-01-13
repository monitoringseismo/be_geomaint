const OfficerModel = require('../models/officer.model');
const officer = new OfficerModel()

class OfficerController
 {
    async list(req, res) {
        try {
            var data = req.body
            const listofficer = await officer.list(data.filter, data.sort, data.limit);
            var message = {success:true, data:listofficer};
            res.status(200);
            res.send(message);
        } catch (error) {
            var message = {success:false, error: error.message};
            // await help.pushTelegram(req, error.message);
            res.status(500);
            res.send(message);
        }
    }
}

module.exports = OfficerController;