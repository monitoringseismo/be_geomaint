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
      function renderPeralatan(peralatan) {
  let rows = "";
  peralatan.forEach((cat, i) => {
    rows += `<tr class="category-row"><td colspan="6"><b>${i + 1}. ${cat.kategori}</b></td></tr>`;
    cat.items.forEach(item => {
      rows += `
        <tr>
          <td class="item-name">${item.nama}</td>
          <td>${item.operasi === "Normal" ? "√" : ""}</td>
          <td>${item.operasi === "Tidak Normal" ? "√" : ""}</td>
          <td>${item.kondisi === "Bersih" ? "√" : ""}</td>
          <td>${item.kondisi === "Kotor" ? "√" : ""}</td>
          <td>${item.keterangan || ""}</td>
        </tr>
      `;
    });
  });
  return rows;
}

// build teknisi
function renderTeknisi(teknisi) {
  if (!teknisi || teknisi.length === 0) {
    return `<td colspan="3">-</td>`;
  }
  return teknisi.map(t => `
    <td>
      <div class="signature-box"></div>
      <u>${t.nama}</u>
    </td>
  `).join("");
}
return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Form Pemeliharaan</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 10px; font-size: 14px }
      .container { max-width: 800px; margin: auto; border: 1px solid #ccc; padding: 10px; }
      .header { display: flex; justify-content: space-between; }
      .header img { width: 60px; height: auto; }
      .header-info { text-align: left; }
      .title { text-align: center; margin: 5px 0; font-weight: bold; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      td, th { border: 1px solid black; padding: 6px; text-align: center; }
      th { background-color: #f2f2f2; }
      .category-row td { background-color: #e9e9e9; text-align: left; font-weight: bold; }
      .item-name { text-align: left; }
      .signature-box { height: 80px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://possaku.store/dev/monitor/images/Logo_BMKG.png" />
        <div class="title"><h2>DIREKTORAT INSTRUMENTASI DAN KALIBRASI</h2></div>
        <div class="header-info">
          <p>
            No. Dokumen: ${data.dokumen.no}<br>
            Tanggal terbit: ${data.dokumen.terbit}<br>
            No. Revisi: ${data.dokumen.revisi}<br>
            Halaman: ${data.dokumen.halaman}
          </p>
        </div>
      </div>

      <div class="title">
        <h3>${data.dokumen.judul} ${data.dokumen.sub_judul}</h3>
      </div>

      <table>
        <tr><td width="20%"><b>NAMA TIM KERJA</b></td><td width="5%">:</td><td>${data.pekerjaan.nama_tim}</td></tr>
        <tr><td><b>LOKASI</b></td><td>:</td><td>${data.pekerjaan.lokasi}</td></tr>
        <tr><td><b>TANGGAL</b></td><td>:</td><td>${data.pekerjaan.tanggal}</td></tr>
      </table>

      <table>
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
          ${renderPeralatan(data.peralatan)}
        </tbody>
      </table>

      <table>
        <tr>
          <td width="50%">Mengetahui,<br>Ketua Tim Kerja Pemeliharaan Aloptama</td>
          <td width="50%" colspan="3">Teknisi On Duty</td>
        </tr>
        <tr>
          <td>
            <div class="signature-box">
              <img src="${data.personil.ketua_tim.ttd_path}" style="height:80px"/>
            </div>
            <u>${data.personil.ketua_tim.nama}</u><br>
            ${data.personil.ketua_tim.nip}
          </td>
          ${renderTeknisi(data.personil.teknisi)}
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}

    exportCheckListForm(formData){
       const rows = [];
  const maxRows = Math.max(
    formData.peralatan_sebelum.length,
    formData.peralatan_sesudah.length
  );

  for (let i = 0; i < maxRows; i++) {
    const itemSebelum = formData.peralatan_sebelum[i] || { nama: "", jumlah: "", kondisi: "" };
    const itemSesudah = formData.peralatan_sesudah[i] || { nama: "", jumlah: "", kondisi: "" };

    rows.push(`
      <tr>
        <td style="text-align:center;">${i + 1}</td>
        <td>${itemSebelum.nama}</td>
        <td style="text-align:center;">${itemSebelum.jumlah}</td>
        <td style="text-align:center;">${itemSebelum.kondisi}</td>
        <td style="text-align:center;">${i + 1}</td>
        <td>${itemSesudah.nama}</td>
        <td style="text-align:center;">${itemSesudah.jumlah}</td>
        <td style="text-align:center;">${itemSesudah.kondisi}</td>
      </tr>
    `);
  }

  const teknisiHtml = formData.teknisi.map(t => `
    <div style="display:inline-block; width:100px; margin:0 10px;">
      <div class="signature-box">
        ${t.ttd_path ? `<img src="${t.ttd_path}" alt="Ttd Teknisi" style="max-height: 80px;">` : ""}
      </div>
      <span>${t.nama}</span>
    </div>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Checklist Form</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
    .container { width: 800px; margin: auto; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 5px; vertical-align: top; }
    .header-table td { border: solid; }
    .header-table .title-section { text-align: center; font-weight: bold; font-size: 18px; }
    .main-content-table, .main-content-table th, .main-content-table td { border: 1px solid black; }
    .main-content-table th { text-align: center; font-weight: bold; background-color: #f2f2f2; }
    .signature-table { margin-top: 40px; text-align: center; }
    .signature-table td { border: none; width: 33.33%; }
    .signature-box { height: 80px; margin-bottom: 5px; }
    .bold { font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <table class="header-table">
      <tr>
        <td><img src="https://possaku.store/dev/monitor/images/Logo_BMKG.png" style="width:90px;"></td>
        <td class="title-section">DIREKTORAT INSTRUMENTASI DAN KALIBRASI</td>
        <td>
          <table>
            <tr><td>No. Dokumen</td><td>:</td><td>${formData.no_dokumen}</td></tr>
            <tr><td>Tanggal terbit</td><td>:</td><td>${formData.tanggal_naskah}</td></tr>
            <tr><td>No. Revisi</td><td>:</td><td>${formData.no_revisi}</td></tr>
            <tr><td>Halaman</td><td>:</td><td>${formData.halaman}</td></tr>
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
      <tr><td class="bold" style="width:25%;">NAMA TIM KERJA</td><td>: ${formData.nama_tim_kerja}</td></tr>
      <tr><td class="bold">NAMA ALAT/SENSOR</td><td>: ${formData.nama_alat_sensor}</td></tr>
      <tr><td class="bold">LOKASI</td><td>: ${formData.lokasi}</td></tr>
      <tr><td class="bold">TANGGAL</td><td>: ${formData.tanggal_pelaksanaan}</td></tr>
    </table>

    <p class="bold">PERLENGKAPAN DAN PERALATAN YANG DIBAWA :</p>
    <table class="main-content-table">
      <thead>
        <tr>
          <th colspan="4">Sebelum (Berangkat)</th>
          <th colspan="4">Sesudah (Pulang)</th>
        </tr>
        <tr>
          <th>No</th><th>Daftar</th><th>Jumlah</th><th>Kondisi</th>
          <th>No</th><th>Daftar</th><th>Jumlah</th><th>Kondisi</th>
        </tr>
      </thead>
      <tbody>${rows.join("")}</tbody>
    </table>

    <table class="signature-table">
      <tr>
        <td>Mengetahui,<br>Ketua Tim</td><td></td><td>Teknisi On Duty</td>
      </tr>
      <tr>
        <td>
          <div class="signature-box">
            ${formData.ketua_tim.ttd_path ? `<img src="${formData.ketua_tim.ttd_path}" style="max-height:80px;">` : ""}
          </div>
          ${formData.ketua_tim.nama}<br>
          NIP. ${formData.ketua_tim.nip}
        </td>
        <td></td>
        <td>${teknisiHtml}</td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
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