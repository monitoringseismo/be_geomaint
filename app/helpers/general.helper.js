const crypto = require('crypto');
const puppeteer = require('puppeteer');
var html_to_pdf = require('html-pdf-node');

class Helpers {
    encryptText(text) {
        var encrypted = crypto.createHash('SHA256').update(text).digest('hex');
        return encrypted
    }

   sanitizeHtml(html) {
    return html.replace(/(undefined|null)/g, '');
    }

    async exportHtmlToPdf(html) {
        var file = { content: html };
        var options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'], timeout: 600000, waitUntil: 'networkidle0' };
        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            return pdfBuffer;
        });
        // return null; // Return null as the function is async and we handle the promise in the calling function
    }

    async generatePdf(html) {
        const browser = await puppeteer.launch({
              args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({
            format: 'A4',
            // printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        await browser.close();
        return pdfBuffer;
    }

    statusLK(st) {
        switch (Number(st)) {
            case 0:
                return "Belum Diproses"
            case 1:
                return "Diproses"
            case 2:
                return "Menunggu Respon"
            case 3:
                return "Dikirim"
            case 4:
                return "Dibatalkan"
            default:
                return "Selesai"
        }
    }
    mappingUser(user) {
        var dt = {
            kode: user.kode,
            nama: user.nama,
            role: user.role,
            nsim: user.nsim,
            status: user.status
        }
        return dt
    }
    generateRandom(len) {
        return crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len).toUpperCase();   // return required number of characters
    }

    dateRange(start, end) {
        var startDate = new Date(start);
        var endDate = new Date(end);
        return {
            $gte: startDate,
            $lte: endDate
        }
    }

    exportPpmPdf(ppm, user) {
        var html = `<!DOCTYPE html>
<html>
<head>
    <title>Laporan Pemeliharaan</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            font-size: 12pt;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 100px;
            height: auto;
            position: absolute;
            left: 10px;
            top: 0px;
        }
        .header .title {
            font-size: 14pt;
            font-weight: bold;
        }
        .header .subtitle {
            font-size: 12pt;
        }
        .content {
            margin: 0 50px;
        }
        .content img {
            max-width: 200px;
            height: auto;
        }
        .section-title {
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .no-border-table td {
            border: none;
            padding: 0;
        }
        .signature-table {
            margin-top: 50px;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            border: none;
        }
        .photo-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 20px;
        }
        .photo-item {
            width: 48%;
            margin-bottom: 20px;
            text-align: center;
        }
        .photo-item img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>

    <div class="header">
        <img src="${process.env.BASE_URL}/images/Logo_BMKG.png" style="width: 50px; height: auto;" alt="BMKG Logo">
        <div class="title">BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA </div>
        <div class="subtitle">Jl. Angkasa I No. 2, Kemayoran, Jakarta 10720, Telp : (021) 4246321 Fax : (021) 4246703 </div>
        <div class="subtitle">P. O. BOX 3540 Jkt, Website : http://www.bmkg.go.id Email : info@bmkg.go.id </div>
        <hr>
    </div>

    <div class="content">
        <div class="section-title" style="text-align: center;">LAPORAN PEMELIHARAAN KOREKTIF DAN ADAPTIVE INA-TEWS<br>STASIUN SEISMIK INATEWS ${ppm.kode}<br>TAHUN ${ppm.created_at.getFullYear()}</div>

        <div class="section-title">UMUM </div>
        <table class="no-border-table">
            <tr>
                <td>Nama Site</td>
                <td>:</td>
                <td>${ppm.info_sites[0].nama}, ${ppm.info_sites[0].kecamatan}, ${ppm.info_sites[0].kota_kab}</td>
            </tr>
            <tr>
                <td>Kode</td>
                <td>:</td>
                <td>${ppm.kode}</td>
            </tr>
            <tr>
                <td>Type</td>
                <td>:</td>
                <td>${ppm.info_sites[0].tipe}</td>
            </tr>
            <tr>
                <td>Koordinat</td>
                <td>:</td>
                <td>Lintang: ${ppm.info_sites[0].latitude}°, Bujur: ${ppm.info_sites[0].longitude}°</td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>${ppm.info_sites[0].alamat}</td>
            </tr>
            <tr>
                <td>Stasiun Penanggung Jawab</td>
                <td>:</td>
                <td>${ppm.info_sites[0].stasiun_pj}</td>
            </tr>
        </table>
        
        <div class="section-title">DASAR PELAKSANAAN </div>
        <p>Surat Tugas 1</p>
        <ul>
            <li>Surat Perintah Tugas Nomor: ${ppm.sebelum_pm.spt}</li>
        </ul>

        <div class="section-title">Pelaksana Kegiatan </div>
        <table class="no-border-table">
            <tr>
                <td>Nama</td>
                <td>:</td>
                <td>${ppm.sebelum_pm.tim}</td>
            </tr>
        </table>
        <br>
        <table class="no-border-table">
            <tr>
                <td>Tempat/Lokasi</td>
                <td>:</td>
                <td>Site ${ppm.info_sites[0].kode}, ${ppm.info_sites[0].kelurahan}, ${ppm.info_sites[0].kecamatan}, ${ppm.info_sites[0].kota_kab}</td>
            </tr>
            <tr>
                <td>Tanggal Pelaksanaan</td>
                <td>:</td>
                <td>${ppm.datetime}</td>
            </tr>
            <tr>
                <td>Tujuan</td>
                <td>:</td>
                <td>Pemeliharaan Adaptif dan Korektif inaTEWS </td>
            </tr>
        </table>
        
        <div class="section-title">URAIAN PELAKSANAAN KEGIATAN </div>
        
        <div class="section-title">Kondisi Awal </div>
            <ul>
              <li>Selter Sisi 1</li>
              <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.knds_shelter_sisi1}" ></li>

                <li>Selter Sisi 2</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.knds_shelter_sisi2}" ></li>
      
                <li>Selter Sisi 3</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.knds_shelter_sisi3}" ></li>
      
                <li>Selter Sisi 4</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.knds_shelter_sisi4}" ></li>
      
                <li>Selter Sisi 5</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.solar_cell_kondisi}" ></li>
      
                <li>Antena</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.antenna_kondisi}" ></li>
      
                <li>Accu</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.sistem_power_accu_kondisi}" ></li>
      
                <li>PLN</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.pln_kondisi}" ></li>
      
                <li>Regulator</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.sistem_power_regulator_kondisi}" ></li>
      
              <li> kondisi alat</li>
      
                <li>Seismograph ${ppm.sebelum_pm.seismik_seismograf.input}</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.seismik_seismograf.foto}" ></li>
      
                <li>Accelerometer ${ppm.sebelum_pm.seismik_accelerometer.input}</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.seismik_accelerometer.foto}" ></li>
      
                <li>Digitizer ${ppm.sebelum_pm.seismik_modem.input}</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.seismik_modem.foto}" ></li>
            </ul>
        <div class="section-title">Tindakan Pemeliharaan </div>
        <ul>
            <li>Tanggal: ${ppm.datetime}</li>
            <ul>
                <li>Pembersihan lingkungan: rumput_dahan: ${ppm.pembersihan_lingkungan.rumput_dahan}, sarang: ${ppm.pembersihan_lingkungan.sarang}, cat_tembok: ${ppm.pembersihan_lingkungan.cat_tembok}, cat_pagar: ${ppm.pembersihan_lingkungan.cat_pagar}</li>
                <li>Pembersihan peralatan: parabola_solarcell: ${ppm.pembersihan_peralatan.parabola_solarcell}, regulator: ${ppm.pembersihan_peralatan.regulator}, battery: ${ppm.pembersihan_peralatan.battery}</li>
                <li>Pengecekan sinyal komunikasi </li>
                <li>Pengecekan digitizer </li>
                <li>Pengecekan baterai </li>
                <li>Monitoring setelah pemasangan </li>
                <li>Regulator Voltages:</li>
      
                <li>Regulator 1: Input Panel ${ppm.regulator1.volt.input_panel || 0} V, Input Baterai ${ppm.regulator1.volt.input_baterai || 0} V, Output ${ppm.regulator1.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator1_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator1_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator1_ft_output}"></li>
          
                <li>Regulator 2: Input Panel ${ppm.regulator2.volt.input_panel || 0} V, Input Baterai ${ppm.regulator2.volt.input_baterai || 0} V, Output ${ppm.regulator2.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator2_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator2_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator2_ft_output}"></li>
          
                <li>Regulator 3: Input Panel ${ppm.regulator3.volt.input_panel || 0} V, Input Baterai ${ppm.regulator3.volt.input_baterai || 0} V, Output ${ppm.regulator3.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator3_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator3_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator3_ft_output}"></li>
          
                <li>Regulator 4: Input Panel ${ppm.regulator4.volt.input_panel || 0} V, Input Baterai ${ppm.regulator4.volt.input_baterai || 0} V, Output ${ppm.regulator4.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator4_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator4_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator4_ft_output}"></li>
          
                <li>Regulator 5: Input Panel ${ppm.regulator5.volt.input_panel || 0} V, Input Baterai ${ppm.regulator5.volt.input_baterai || 0} V, Output ${ppm.regulator5.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator5_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator5_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator5_ft_output}"></li>
          
                <li>Regulator 6: Input Panel ${ppm.regulator6.volt.input_panel || 0} V, Input Baterai ${ppm.regulator6.volt.input_baterai || 0} V, Output ${ppm.regulator6.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator6_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator6_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator6_ft_output}"></li>
          
                <li>Regulator 7: Input Panel ${ppm.regulator7.volt.input_panel || 0} V, Input Baterai ${ppm.regulator7.volt.input_baterai || 0} V, Output ${ppm.regulator7.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator7_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator7_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator7_ft_output}"></li>
          
                <li>Regulator 8: Input Panel ${ppm.regulator8.volt.input_panel || 0} V, Input Baterai ${ppm.regulator8.volt.input_baterai || 0} V, Output ${ppm.regulator8.volt.output || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator8_ft_input_panel}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator8_ft_input_baterai}"></li>
                <li><img src="${process.env.BASE_URL}${ppm.regulator8_ft_output}"></li>
            </ul>
            <li>Battery Voltages:</li>
            <ul>
                <li>Battery 1: ${ppm.baterai1_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai1_foto}"></li>
      
                <li>Battery 2: ${ppm.baterai2_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai2_foto}"></li>
      
                <li>Battery 3: ${ppm.baterai3_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai3_foto}"></li>
      
                <li>Battery 4: ${ppm.baterai4_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai4_foto}"></li>
      
                <li>Battery 5: ${ppm.baterai5_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai5_foto}"></li>
      
                <li>Battery 6: ${ppm.baterai6_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai6_foto}"></li>
      
                <li>Battery 7: ${ppm.baterai7_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai7_foto}"></li>
      
                <li>Battery 8: ${ppm.baterai8_tegangan || 0} V</li>
                <li><img src="${process.env.BASE_URL}${ppm.baterai8_foto}"></li>
            </ul>
            <li>Centering: ${ppm.centering.centering}</li>
            <li>Leveling: broadband: ${ppm.leveling.lv_broadband}, accelerometer: ${ppm.leveling.lv_accelerometer}</li>
            <li>Kabel: ${ppm.kabel.kondisi}</li>
            <li>PLN Tegangan: ${ppm.pln_tegangan || 0}</li>
            <li> kondisi alat</li>
      
                <li>Seismograph ${ppm.sesudah_pm.seismik_seismograf.input}</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.seismik_seismograf.foto}" ></li>
      
                <li>Accelerometer ${ppm.sesudah_pm.seismik_accelerometer.input}</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.seismik_accelerometer.foto}" ></li>
      
                <li>Digitizer ${ppm.sesudah_pm.seismik_modem.input}</li>
                <li><img src="${process.env.BASE_URL}${ppm.sebelum_pm.seismik_modem.foto}" ></li>
            </ul>
            </ul>
        </ul>

        <div class="section-title">Hasil Pemeliharaan </div>
        <ul>
            <li>Regulator Voltages:</li>
            <ul>
                <li>Regulator 1: Input Panel ${ppm.regulator1.volt.input_panel || 0} V, Input Baterai ${ppm.regulator1.volt.input_baterai || 0} V, Output ${ppm.regulator1.volt.output || 0} V</li>
                <li>Regulator 2: Input Panel ${ppm.regulator2.volt.input_panel || 0} V, Input Baterai ${ppm.regulator2.volt.input_baterai || 0} V, Output ${ppm.regulator2.volt.output || 0} V</li>
                <li>Regulator 3: Input Panel ${ppm.regulator3.volt.input_panel || 0} V, Input Baterai ${ppm.regulator3.volt.input_baterai || 0} V, Output ${ppm.regulator3.volt.output || 0} V</li>
                <li>Regulator 4: Input Panel ${ppm.regulator4.volt.input_panel || 0} V, Input Baterai ${ppm.regulator4.volt.input_baterai || 0} V, Output ${ppm.regulator4.volt.output || 0} V</li>
                <li>Regulator 5: Input Panel ${ppm.regulator5.volt.input_panel || 0} V, Input Baterai ${ppm.regulator5.volt.input_baterai || 0} V, Output ${ppm.regulator5.volt.output || 0} V</li>
                <li>Regulator 6: Input Panel ${ppm.regulator6.volt.input_panel || 0} V, Input Baterai ${ppm.regulator6.volt.input_baterai || 0} V, Output ${ppm.regulator6.volt.output || 0} V</li>
                <li>Regulator 7: Input Panel ${ppm.regulator7.volt.input_panel || 0} V, Input Baterai ${ppm.regulator7.volt.input_baterai || 0} V, Output ${ppm.regulator7.volt.output || 0} V</li>
                <li>Regulator 8: Input Panel ${ppm.regulator8.volt.input_panel || 0} V, Input Baterai ${ppm.regulator8.volt.input_baterai || 0} V, Output ${ppm.regulator8.volt.output || 0} V</li>
            </ul>
            <li>Battery Voltages:</li>
            <ul>
                <li>Battery 1: ${ppm.baterai1_tegangan || 0} V</li>
                <li>Battery 2: ${ppm.baterai2_tegangan || 0} V</li>
                <li>Battery 3: ${ppm.baterai3_tegangan || 0} V</li>
                <li>Battery 4: ${ppm.baterai4_tegangan || 0} V</li>
                <li>Battery 5: ${ppm.baterai5_tegangan || 0} V</li>
                <li>Battery 6: ${ppm.baterai6_tegangan || 0} V</li>
                <li>Battery 7: ${ppm.baterai7_tegangan || 0} V</li>
                <li>Battery 8: ${ppm.baterai8_tegangan || 0} V</li>
            </ul>
            <li>Centering: ${ppm.centering.centering}</li>
            <li>Leveling: broadband: ${ppm.leveling.lv_broadband}, accelerometer: ${ppm.leveling.lv_accelerometer}</li>
            <li>Kabel: ${ppm.kabel.kondisi}</li>
            <li>PLN Tegangan: ${ppm.pln_tegangan || 0}</li>
        </ul>

        <div class="section-title">KESIMPULAN DAN SARAN </div>
        <div class="section-title">Kesimpulan </div>
        
        <div class="section-title">Saran </div>
        <ul>
            <li>${ppm.rekomendasi}</li>
        </ul>
        
        <div style="page-break-before: always;"></div>

    </div>

</body>
</html> `;
    return this.sanitizeHtml(html)
    }
}
module.exports = Helpers;