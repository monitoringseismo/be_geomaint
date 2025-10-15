const UserCon = require('../app/controllers/user.controller')
const MetadataCon = require('../app/controllers/metadata.controller')
const PpmCon = require('../app/controllers/ppm.controller')
const LkCon = require('../app/controllers/lk.controller')
const ReportCon = require('../app/controllers/report.controller')
const OfficerCon = require('../app/controllers/officer.controller')
const SC = require('../app/controllers/sukucadang.controller')
const user = new UserCon()
const metadata = new MetadataCon()
const ppm = new PpmCon()
const lk = new LkCon()
const report = new ReportCon()
const officer = new OfficerCon()
const sc = new SC()

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
    app.get('/ppm/pdf/:id', ppm.pdf2);
    app.get('/ppm/pdf2/:id', ppm.pdf);
    app.get('/ppm/html/:id', ppm.pdfHtml);
    app.delete('/ppm/:id', user.checkSessionApi , ppm.delete);
    app.post('/ppm/list', user.checkSessionApi , ppm.list);
    app.post('/ppm/site', user.checkSessionApi , ppm.site);
    //----- METADATA Endpoint -------//
    app.post('/metadata/', user.checkSessionApi , metadata.insert);
    app.put('/metadata/:id', user.checkSessionApi , metadata.update);
    app.get('/metadata/:id', user.checkSessionApi , metadata.show);
    app.delete('/metadata/:id', user.checkSessionApi , metadata.delete);
    app.post('/metadata/list', user.checkSessionApi , metadata.list);
    app.post('/metadata/column', user.checkSessionApi ,  metadata.column);
    app.post('/metadata/downloadReport',user.checkSessionApi ,  metadata.downloadReport);
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

    //-- Open API --//
    app.post('/openapi/metadata', metadata.list);
    app.post('/openapi/report',  report.insert);
    app.put('/openapi/report/:id',  report.update);
    app.get('/openapi/report/:id',  report.show);
    app.delete('/openapi/report/:id',  report.delete);
    app.post('/openapi/report/list',  report.list);
    app.get('/openapi/report/pdf/:id', report.pdf);
    app.get('/openapi/report/pdf2/:id', report.pdf2);
    app.post('/openapi/uploadImage', multer({ storage: imagehelper.diskStorage }).single("photo"), ppm.upImg);
    app.post('/openapi/officer/list',  officer.list);

    //-- suku cadang ---//
    app.post('/sukucadang/',  sc.insert);
    app.put('/sukucadang/:id',  sc.update);
    app.get('/sukucadang/:id',  sc.show);
    app.delete('/sukucadang/:id',  sc.delete);
    app.post('/sukucadang/list',  sc.list);
    app.post('/sukucadang/download',  sc.downloadSukucadang);
    // app.post('/sukucadang_activity/download',  sc.downloadSukucadang);
    app.post('/sukucadang/uploadFile', multer({ storage: imagehelper.itemStorage }).single("file"), sc.upFile);
    app.post('/sukucadang_activity/uploadFile', multer({ storage: imagehelper.itemStorage }).single("file"), sc.upFileActivity.bind(sc));
    app.post('/sukucadang_activity/history/:id',  sc.historySukuCadang);
    app.post('/sukucadang_activity/list',  sc.listHistorySukuCadang);
    app.post('/sukucadang_activity/inbound',  sc.inboundSukuCadang);
    app.post('/sukucadang_activity/outbound',  sc.outboundSukuCadang);
    app.post('/sukucadang_activity/rekap',  sc.rekapSukuCadang);
    app.post('/sukucadang_activity/download',  sc.downloadHistorySukuCadang);
}