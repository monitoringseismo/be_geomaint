const UserCon = require('../app/controllers/user.controller')
const MetadataCon = require('../app/controllers/metadata.controller')
const PpmCon = require('../app/controllers/ppm.controller')
const LkCon = require('../app/controllers/lk.controller')
const user = new UserCon()
const metadata = new MetadataCon()
const ppm = new PpmCon()
const lk = new LkCon()

const multer = require("multer");
const imagehelper = require("../app/helpers/images.helper")
module.exports.route = (app) => {
    app.get('/', function(req, res){
        res.json('Seismonitor Active Mode');
    })

    app.post('/uploadImage', multer({ storage: imagehelper.diskStorage }).single("photo"), ppm.upImg);
    app.post('/uploadFile', multer({ storage: imagehelper.itemStorage }).single("file"), ppm.upFile);
    //----- USER Endpoint -------//
    app.post('/login', user.login);
    app.post('/user/', user.checkSessionApi ,user.insert);
    app.put('/user/:id', user.checkSessionApi ,user.update);
    app.get('/user/:id', user.checkSessionApi ,user.show);
    app.delete('/user/:id', user.checkSessionApi ,user.delete);
    app.post('/user/list', user.checkSessionApi ,user.list);
    //----- PPM Endpoint -------//
    app.post('/ppm/', user.checkSessionApi , ppm.insert);
    app.put('/ppm/:id', user.checkSessionApi , ppm.update);
    app.get('/ppm/:id', user.checkSessionApi , ppm.show);
    app.delete('/ppm/:id', user.checkSessionApi , ppm.delete);
    app.post('/ppm/list', user.checkSessionApi , ppm.list);
    //----- METADATA Endpoint -------//
    app.post('/metadata/', user.checkSessionApi , metadata.insert);
    app.put('/metadata/:id', user.checkSessionApi , metadata.update);
    app.get('/metadata/:id', user.checkSessionApi , metadata.show);
    app.delete('/metadata/:id', user.checkSessionApi , metadata.delete);
    app.post('/metadata/list', user.checkSessionApi , metadata.list);
    //----- LAPORAN KERUSAKAN Endpoint -------//
    app.post('/laporanKerusakan/', user.checkSessionApi , lk.insert);
    app.put('/laporanKerusakan/:id', user.checkSessionApi , lk.update);
    app.get('/laporanKerusakan/:id', user.checkSessionApi , lk.show);
    app.delete('/laporanKerusakan/:id', user.checkSessionApi , lk.delete);
    app.post('/laporanKerusakan/list', user.checkSessionApi , lk.list);
   //----- LAPORAN KERUSAKAN Endpoint -------//
   app.get('/monitoring/statusSensor',user.checkSessionApi, metadata.statusSensor)
   app.get('/monitoring/statistikSensor',user.checkSessionApi, metadata.statistikSensor)
   app.get('/monitoring/statistikLK',user.checkSessionApi, lk.statistikLK)
   app.get('/monitoring/statusLK',user.checkSessionApi, lk.statusLK)
    //----- Get External API ----//
    app.get('/monitoring/slmon',user.checkSessionApi, lk.slmon)
}