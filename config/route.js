const UserCon = require('../app/controllers/user.controller')
const MetadataCon = require('../app/controllers/metadata.controller')
const PpmCon = require('../app/controllers/ppm.controller')
const LkCon = require('../app/controllers/lk.controller')
const user = new UserCon()
const metadata = new MetadataCon()
const ppm = new PpmCon()
const lk = new LkCon()
module.exports.route = (app) => {
    app.get('/', function(req, res){
        res.json('Seismonitor Active Mode');
    })
    //----- USER Endpoint -------//
    app.post('/login', user.login);
    app.post('/user/', user.insert);
    app.put('/user/:id', user.update);
    app.get('/user/:id', user.show);
    app.delete('/user/:id', user.delete);
    app.post('/user/list', user.list);
    //----- PPM Endpoint -------//
    app.post('/ppm/', ppm.insert);
    app.put('/ppm/:id', ppm.update);
    app.get('/ppm/:id', ppm.show);
    app.delete('/ppm/:id', ppm.delete);
    app.post('/ppm/list', ppm.list);
    //----- METADATA Endpoint -------//
    app.post('/metadata/', metadata.insert);
    app.put('/metadata/:id', metadata.update);
    app.get('/metadata/:id', metadata.show);
    app.delete('/metadata/:id', metadata.delete);
    app.post('/metadata/list', metadata.list);
    //----- LAPORAN KERUSAKAN Endpoint -------//
    app.post('/laporanKerusakan/', lk.insert);
    app.put('/laporanKerusakan/:id', lk.update);
    app.get('/laporanKerusakan/:id', lk.show);
    app.delete('/laporanKerusakan/:id', lk.delete);
    app.post('/laporanKerusakan/list', lk.list);
   //----- LAPORAN KERUSAKAN Endpoint -------//
   app.get('/monitoring/statusSensor', metadata.statusSensor)
}