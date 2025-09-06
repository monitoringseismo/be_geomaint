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
        await page.setContent(html, { waitUntil: 'networkidle0' });
        // await page.waitForTimeout(500);
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

    exportPemeliharaanForm(data){
        var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Pemeliharaan Peralatan</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 10px; font-size: 14px }
        .container { max-width: 800px; margin: auto; border: 1px solid #ccc; padding: 10px; }
        .header, .footer { display: flex; justify-content: space-between; align-items: flex-start; }
        .header img { width: 60px; height: auto; }
        .header-info { text-align: left; }
        .title { text-align: center; margin: 5px 0; font-weight: bold; }
        .job-info table, .equipment-table, .signature-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .job-info td { padding: 5px; }
        .equipment-table th, .equipment-table td { border: 1px solid black; padding: 8px; text-align: center; }
        .equipment-table th { background-color: #f2f2f2; }
        .equipment-table .category-row td { background-color: #e9e9e9; font-weight: bold; text-align: left; }
        .equipment-table .item-name { text-align: left; }
        .signature-table td { vertical-align: top; text-align: center; padding-top: 15px; }
        .signature-box { height: 80px; }
        .no-print { margin-top: 20px; text-align: center; }
        @media print {
            .no-print { display: none; }
            body { margin: 0; }
            .container { border: none; }
        }
    </style>
</head>
<body>

<div class="container" id="form-container">
    </div>

<script>
    // Data JSON dari dokumen
    const formData = {
      "dokumen": {
        "no": "FM.IRG.DIK.25",
        "terbit": "02 Juli 2025",
        "revisi": "00",
        "halaman": "3 / 3",
        "judul": "FORM PEMELIHARAAN PERALATAN",
        "sub_judul": "PEMELIHARAAN ALOPTAMA"
      },
      "pekerjaan": {
        "nama_tim": "TIM PEMELIHARAAN ALOPTAMA GEOFISIKA",
        "lokasi": "Site DBKI",
        "tanggal": "02 Juli 2025-04 Juli 2025"
      },
      "peralatan": [
        {
          "kategori": "SISTEM SENSOR DAN AKUISISI DATA",
          "items": [
            { "nama": "Seismometer", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" },
            { "nama": "Accelerometer", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" },
            { "nama": "Digitizer", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" }
          ]
        },
        {
          "kategori": "SISTEM POWER",
          "items": [
            { "nama": "Baterai", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" },
            { "nama": "Solar Panel", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" },
            { "nama": "MPPT Solar Controler", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" }
          ]
        },
        {
          "kategori": "SISTEM KOMUNIKASI",
          "items": [
            { "nama": "LNB", "operasi": "-", "kondisi": "-", "keterangan": "" },
            { "nama": "BUC", "operasi": "-", "kondisi": "-", "keterangan": "" },
            { "nama": "Feedhorn", "operasi": "-", "kondisi": "-", "keterangan": "" },
            { "nama": "Modem VSAT", "operasi": "-", "kondisi": "-", "keterangan": "" },
            { "nama": "Modem GSM", "operasi": "Normal", "kondisi": "Bersih", "keterangan": "" }
          ]
        }
      ],
      "personil": {
        "ketua_tim": {
          "nama": "Nama Ketua Tim Anda",
          "nip": "NIP Ketua Tim Anda"
        },
        "teknisi": [
          { "nama": "Nama Teknisi 1" },
          { "nama": "Nama Teknisi 2" },
          { "nama": "Nama Teknisi 3" }
        ]
      }
    };

    // Fungsi untuk membangun HTML dari data JSON
    function renderForm(data) {
        const container = document.getElementById('form-container');

        // Generate Equipment Table Rows
        let equipmentRows = '';
        data.peralatan.forEach((category, catIndex) => {
            equipmentRows += '<tr class="category-row"><td colspan="6"><b>${catIndex + 1}. ${category.kategori}</b></td></tr>';
            category.items.forEach(item => {
                equipmentRows += '
                    <tr>
                        <td class="item-name">${item.nama}</td>
                        <td>${item.operasi === 'Normal' ? '√' : ''}</td>
                        <td>${item.operasi === 'Tidak Normal' ? '√' : ''}</td>
                        <td>${item.kondisi === 'Bersih' ? '√' : ''}</td>
                        <td>${item.kondisi === 'Kotor' ? '√' : ''}</td>
                        <td>${item.keterangan}</td>
                    </tr>
                ';
            });
        });
        
        // Generate Technicians Signature
        let techSignatures = '';
        data.personil.teknisi.forEach(tech => {
            techSignatures += '
                <td>
                    <div class="signature-box"></div>
                    <u>${tech.nama}</u>
                </td>
            ';
        });


        // Full HTML Structure
        container.innerHTML = '
            <div class="header">
                <img src="https://possaku.store/dev/monitor/images/Logo_BMKG.png" alt="Logo BMKG">
            <div class="title">
                        <h2>DIREKTORAT INSTRUMENTASI DAN KALIBRASI</h2>
            </div>
                <div class="header-info">
                    <p>
                        No. Dokumen: ${data.dokumen.no}<br>
                        Tanggal terbit: ${data.dokumen.terbit}<br>
                        No. Revisi: ${data.dokumen.revisi}<br>
                        Halaman: ${data.dokumen.halaman}<br>
                    </p>
                </div>
            </div>
            <div class="title">
                <h3>${data.dokumen.judul} ${data.dokumen.sub_judul}</h3>
            </div>
            <hr>
            <table class="job-info">
                <tr>
                    <td width="20%"><b>NAMA TIM KERJA</b></td>
                    <td width="5%">:</td>
                    <td>${data.pekerjaan.nama_tim}</td>
                </tr>
                <tr>
                    <td><b>LOKASI</b></td>
                    <td>:</td>
                    <td>${data.pekerjaan.lokasi}</td>
                </tr>
                 <tr>
                    <td><b>TANGGAL</b></td>
                    <td>:</td>
                    <td>${data.pekerjaan.tanggal}</td>
                </tr>
            </table>

            <table class="equipment-table">
                <thead>
                    <tr>
                        <th rowspan="2" width="30%">Nama Peralatan</th>
                        <th colspan="2">Operasi (√)</th>
                        <th colspan="2">Kondisi (√)</th>
                        <th rowspan="2">Keterangan</th>
                    </tr>
                    <tr>
                        <th>Normal</th>
                        <th>Tidak Normal</th>
                        <th>Bersih</th>
                        <th>Kotor</th>
                    </tr>
                </thead>
                <tbody>
                    ${equipmentRows}
                </tbody>
            </table>

            <table class="signature-table">
                <tr>
                    <td width="50%">Mengetahui,<br>Ketua Tim Kerja Pemeliharaan Aloptama Geofisika</td>
                    <td width="50%" colspan="3">Teknisi On Duty</td>
                </tr>
                <tr>
                    <td>
                        <div class="signature-box"></div>
                        <u>${data.personil.ketua_tim.nama}</u><br>
                        ${data.personil.ketua_tim.nip}
                    </td>
                    ${techSignatures}
                </tr>
            </table>
        ';
    }

    // Panggil fungsi untuk merender form saat halaman dimuat
    document.addEventListener('DOMContentLoaded', () => {
        renderForm(formData);
    });

</script>
</body>
</html>`
return html;
    }

    exportCheckListForm(data){
        var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FORM CHECKLIST PERALATAN DAN PERLENGKAPAN PERSIAPAN PEMELIHARAAN ALOPTAMA</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .container {
            width: 800px;
            margin: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            padding: 5px;
            vertical-align: top;
        }
        .header-table td {
            border: solid;
        }
        .centerize {
            text-orientation: ;
        }
        .header-table .logo {
            width: 100px;
            text-align: center;
        }
        .header-table .title-section {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
        }
        .header-table .doc-info {
            width: 250px;
        }
        .main-content-table, .main-content-table th, .main-content-table td {
            border: 1px solid black;
        }
        .main-content-table th {
            text-align: center;
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .signature-table {
            margin-top: 40px;
            text-align: center;
        }
        .signature-table td {
            border: none;
            width: 33.33%;
        }
        .signature-box {
            height: 80px;
            margin-bottom: 5px;
        }
        .no-border td {
            border: none;
        }
        .border td{
            border: none;
        }
        .bold {
            font-weight: bold;
        }
        @media print {
            body {
                margin: 0;
            }
            .container {
                width: 100%;
            }
            button {
                display: none;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <button onclick="window.print()" style="margin-bottom: 20px;">Print Form</button>

        <table class="header-table">
            <tr>
                <td class="logo"><img src="https://possaku.store/dev/monitor/images/Logo_BMKG.png" alt="Logo" style="width:90px;"></td>
                <td class="title-section"><br><br>
                    DIREKTORAT INSTRUMENTASI DAN KALIBRASI
                </td>
                <td class="doc-info">
                    <table>
                        <tr class="border">
                            <td>No. Dokumen</td>
                            <td>:</td>
                            <td id="no_dokumen"></td>
                        </tr>
                        <tr class="border">
                            <td>Tanggal terbit</td>
                            <td>:</td>
                            <td id="tanggal_naskah"></td>
                        </tr>
                        <tr class="border">
                            <td>No. Revisi</td>
                            <td>:</td>
                            <td id="no_revisi"></td>
                        </tr>
                        <tr class="border">
                            <td>Halaman</td>
                            <td>:</td>
                            <td id="halaman"></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                
                <td colspan="3" class="title-section">
                    FORM CHECKLIST PERALATAN DAN PERLENGKAPAN<br>
                    PERSIAPAN PEMELIHARAAN ALOPTAMA
                </td>
            </tr>
        </table>

        <br>

        <table>
            <tr class="no-border">
                <td style="width:25%;" class="bold">NAMA TIM KERJA</td>
                <td style="width:75%;">: <span id="nama_tim_kerja"></span></td>
            </tr>
            <tr class="no-border">
                <td class="bold">NAMA ALAT/SENSOR</td>
                <td>: <span id="nama_alat_sensor"></span></td>
            </tr>
            <tr class="no-border">
                <td class="bold">LOKASI</td>
                <td>: <span id="lokasi"></span></td>
            </tr>
            <tr class="no-border">
                <td class="bold">TANGGAL</td>
                <td>: <span id="tanggal_pelaksanaan"></span></td>
            </tr>
        </table>

        <br>

        <p class="bold">PERLENGKAPAN DAN PERALATAN YANG DIBAWA :</p>

        <table class="main-content-table">
            <thead>
                <tr>
                    <th colspan="4">Sebelum (Berangkat)</th>
                    <th colspan="4">Sesudah (Pulang)</th>
                </tr>
                <tr>
                    <th>No</th>
                    <th>Daftar Sensor dan Peralatan Pendukung yang dibawa<br>(cantumkan serial number jika ada)</th>
                    <th>Jumlah</th>
                    <th>Kondisi</th>
                    <th>No</th>
                    <th>Daftar Sensor dan Peralatan Pendukung yang dibawa</th>
                    <th>Jumlah</th>
                    <th>Kondisi</th>
                </tr>
            </thead>
            <tbody id="equipment_table_body">
                </tbody>
        </table>

        <table class="signature-table">
            <tr>
                <td>Mengetahui,<br>Ketua Tim Kerja Pemeliharaan<br>Aloptama Geofisika</td>
                <td></td>
                <td>Teknisi On Duty</td>
            </tr>
            <tr>
                <td>
                    <div class="signature-box" id="ttd_ketua"></div>
                    <span id="nama_ketua"></span><br>
                    NIP. <span id="nip_ketua"></span>
                </td>
                <td></td>
                <td>
                    <div id="teknisi_list">
                        </div>
                </td>
            </tr>
        </table>
    </div>

    <script>
        const formData = ${JSON.stringify(data)};

        // Populate header and general info
        document.getElementById('no_dokumen').textContent = formData.no_dokumen;
        document.getElementById('tanggal_naskah').textContent = formData.tanggal_naskah;
        document.getElementById('no_revisi').textContent = formData.no_revisi;
        document.getElementById('halaman').textContent = formData.halaman;
        document.getElementById('nama_tim_kerja').textContent = formData.nama_tim_kerja;
        document.getElementById('nama_alat_sensor').textContent = formData.nama_alat_sensor;
        document.getElementById('lokasi').textContent = formData.lokasi;
        document.getElementById('tanggal_pelaksanaan').textContent = formData.tanggal_pelaksanaan;

        // Populate equipment table
        const tableBody = document.getElementById('equipment_table_body');
        const maxRows = Math.max(formData.peralatan_sebelum.length, formData.peralatan_sesudah.length);

        for (let i = 0; i < maxRows; i++) {
            const row = document.createElement('tr');
            const itemSebelum = formData.peralatan_sebelum[i] || { nama: '', jumlah: '', kondisi: '' };
            const itemSesudah = formData.peralatan_sesudah[i] || { nama: '', jumlah: '', kondisi: '' };
            
            row.innerHTML = '
                <td style="text-align:center;">${i + 1}</td>
                <td>${itemSebelum.nama}</td>
                <td style="text-align:center;">${itemSebelum.jumlah}</td>
                <td style="text-align:center;">${itemSebelum.kondisi}</td>
                <td style="text-align:center;">${i + 1}</td>
                <td>${itemSesudah.nama}</td>
                <td style="text-align:center;">${itemSesudah.jumlah}</td>
                <td style="text-align:center;">${itemSesudah.kondisi}</td>
            ';
            tableBody.appendChild(row);
        }

        // Populate signatures
        document.getElementById('nama_ketua').textContent = formData.ketua_tim.nama;
        document.getElementById('nip_ketua').textContent = formData.ketua_tim.nip;
        if (formData.ketua_tim.ttd_path) {
            document.getElementById('ttd_ketua').innerHTML = '<img src="${formData.ketua_tim.ttd_path}" alt="Ttd Ketua" style="max-height: 80px;">';
        }

        const teknisiContainer = document.getElementById('teknisi_list');
        formData.teknisi.forEach(teknisi => {
            const teknisiDiv = document.createElement('div');
            teknisiDiv.style = "display: inline-block; width: 100px; margin: 0 10px;";
            
            let ttdImage = '';
            if (teknisi.ttd_path) {
                ttdImage = '<img src="${teknisi.ttd_path}" alt="Ttd Teknisi" style="max-height: 80px;">';
            }

            teknisiDiv.innerHTML = '
                <div class="signature-box">${ttdImage}</div>
                <span>${teknisi.nama}</span>
            ';
            teknisiContainer.appendChild(teknisiDiv);
        });
    </script>
</body>
</html> `
return html;
    }

    exportIdentifikasiForm(data, user) {
        var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FORM IDENTIFIKASI KERUSAKAN PERALATAN</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            width: 800px;
            margin: auto;
            border: 1px solid #ccc;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        .header img {
            width: 100px;
            height: auto;
        }
        .header .title {
            flex-grow: 1;
        }
        .header h3, .header h4 {
            margin: 5px 0;
        }
        .doc-info {
            float: right;
            text-align: left;
            margin-left: 10px;
        }
        .doc-info table {
            border-collapse: collapse;
        }
        .doc-info td {
            padding: 2px 5px;
        }
        .content-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .content-table th, .content-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        .content-table th {
            width: 30%;
            background-color: #f2f2f2;
        }
        .signature-section {
            margin-top: 40px;
            width: 100%;
        }
        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }
        .signature-table td {
            padding: 10px;
            text-align: center;
            vertical-align: top;
        }
        .signature-box {
            height: 80px;
        }
        .print-button {
            display: block;
            width: 100px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        @media print {
            .print-button {
                display: none;
            }
            .container {
                border: none;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <img src="https://possaku.store/dev/monitor/images/Logo_BMKG.png" alt="BMKG Logo">
        <div class="title">
            <h3>DIREKTORAT INSTRUMENTASI DAN KALIBRASI</h3>
            <h4>FORM IDENTIFIKASI KERUSAKAN PERALATAN PEMELIHARAAN ALOPTAMA</h4>
        </div>
        <div class="doc-info">
            <table>
                <tr>
                    <td>No. Dokumen</td>
                    <td>:</td>
                    <td id="no_dokumen"></td>
                </tr>
                <tr>
                    <td>Tanggal terbit</td>
                    <td>:</td>
                    <td id="tanggal_terbit"></td>
                </tr>
                <tr>
                    <td>No. Revisi</td>
                    <td>:</td>
                    <td id="no_revisi"></td>
                </tr>
                <tr>
                    <td>Halaman</td>
                    <td>:</td>
                    <td id="halaman"></td>
                </tr>
            </table>
        </div>
    </div>

    <table class="content-table">
        <tr>
            <th>NAMA TIM KERJA</th>
            <td id="nama_tim_kerja"></td>
        </tr>
        <tr>
            <th>NAMA ALAT/SENSOR</th>
            <td id="nama_alat_sensor"></td>
        </tr>
        <tr>
            <th>LOKASI</th>
            <td id="lokasi"></td>
        </tr>
        <tr>
            <th>TANGGAL</th>
            <td id="tanggal_kegiatan"></td>
        </tr>
        <tr>
            <th>URAIAN KERUSAKAN</th>
            <td id="uraian_kerusakan"></td>
        </tr>
        <tr>
            <th>URAIAN TINDAKAN PERBAIKAN</th>
            <td id="uraian_tindakan_perbaikan"></td>
        </tr>
    </table>

    <div class="signature-section">
        <table class="signature-table">
            <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%;">Mengetahui,</td>
            </tr>
            <tr>
                <td>Teknisi On Duty</td>
                <td>Ketua Tim Kerja Pemeliharaan Aloptama Geofisika</td>
            </tr>
            <tr>
                <td>
                    <div id="teknisi_list" class="signature-box"></div>
                </td>
                <td>
                    <div class="signature-box"></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div id="nama_teknisi_list"></div>
                </td>
                <td>
                    <b id="ketua_nama"></b><br>
                    <span id="ketua_nip"></span>
                </td>
            </tr>
        </table>
    </div>
</div>


<script>
    const formData = ${JSON.stringify(data)};

    document.getElementById('no_dokumen').textContent = formData.no_dokumen;
    document.getElementById('tanggal_terbit').textContent = formData.tanggal_terbit;
    document.getElementById('no_revisi').textContent = formData.no_revisi;
    document.getElementById('halaman').textContent = formData.halaman;
    document.getElementById('nama_tim_kerja').textContent = formData.nama_tim_kerja;
    document.getElementById('nama_alat_sensor').textContent = formData.nama_alat_sensor;
    document.getElementById('lokasi').textContent = formData.lokasi;
    document.getElementById('tanggal_kegiatan').textContent = formData.tanggal_kegiatan;
    document.getElementById('uraian_kerusakan').textContent = formData.uraian_kerusakan;

    const tindakanPerbaikanList = document.getElementById('uraian_tindakan_perbaikan');
    const ul = document.createElement('ul');
    formData.uraian_tindakan_perbaikan.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
    tindakanPerbaikanList.appendChild(ul);

    document.getElementById('ketua_nama').textContent = formData.ketua_tim.nama;
    document.getElementById('ketua_nip').textContent = formData.ketua_tim.nip;
    
    const teknisiList = document.getElementById('nama_teknisi_list');
    formData.teknisi_on_duty.forEach(teknisi => {
        const p = document.createElement('p');
        p.style.margin = '0';
        p.style.display = 'inline-block';
        p.style.marginRight = '20px';
        p.textContent = teknisi.nama;
        teknisiList.appendChild(p);
    });
</script>

</body>
</html>`
return html;
    }

    exportPpmPdf(ppm, user) {
        var html = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="User-Agent" content="Mozilla/5.0">
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