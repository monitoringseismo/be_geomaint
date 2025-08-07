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
            left: 50px;
            top: 20px;
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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAASFBMVEXp8fkAAAD////o8fno8fnu9vwzMzP+/v7y9fp0dHTq9Pnz9fv4+Pny+vvv+fzp8fnk7/jQ2u3l7/k+Pj6wsLD2+vy9vb3x+Pny9/sR32xIAAAACXBIWXMAAAsTAAALEwEAmpwYAAACUUlEQ4nO3b63KqMBBA0YjBghwG8bK9/9dckn2zHw+hJj0k6rKk8/gXj3t3w1i85f4m4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4WHw52b450k6i/3f/1X9N+pD1P01+vV5yv4a/a/X/Tfl/sV5hP3vF+tT9N+H+r+m/J/H9f+9Nf+9b3D4+f23b/uK/f9F+r+d/X/f5B7t7zX6v77H+/3P+v+2+u+y/F//4/n//j4H3t+1+P9/f7j/b93+v/2+v/u1/k8ev+V+/+H+/2P+/6P+r/x8f/94+b5h/H/+Ofr3P+Pj//r+v+2+r9w+L/6H69/w+P/8c/V/7+L6v/j4//j6//fJ//38f/58X/7+v//38f/8+L//n0P/x8f/30P/x8P/78H/0+D//u5/f8D/0+L//eY/v8f/T4v/w9P/99T/7+p/9/U/91j+P8v/4/X/T4v/94P/9/g//38P/4/v/0+D//e//n9P/t9X/7/X/X+t/7+1/+2D//e8/v9L+f/y+v/3m/1/vP8f/t+v/39o/v+w/H+T/r/H//vx/1/e/1/+r9/+f+j/L+L/F+H//e4/v/28fHw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PAw+D9eK83y5/v9AAAAAElFTkSuQmCC" alt="BMKG Logo">
        <div class="title">BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA </div>
        <div class="subtitle">Jl. Angkasa I No. 2, Kemayoran, Jakarta 10720, Telp : (021) 4246321 Fax : (021) 4246703 </div>
        <div class="subtitle">P. O. BOX 3540 Jkt, Website : http://www.bmkg.go.id Email : info@bmkg.go.id </div>
        <hr>
    </div>

    <div class="content">
        <div class="section-title" style="text-align: center;">LAPORAN PEMELIHARAAN KOREKTIF DAN ADAPTIVE INA-TEWS<br>STASIUN SEISMIK INATEWS ${ppm.kode}<br>TAHUN 2024</div>
        
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
        <p>Surat Tugas 1]</p>
        <ul>
            <li>Surat Perintah Tugas Nomor: e.B/IJ.00.00/188/DIK/VII/2025 ]</li>
            <li>Surat Perintah Tugas Nomor: e.B/GF.00.01/061/DGT/VII/2025 ]</li>
        </ul>

        <div class="section-title">Pelaksana Kegiatan </div>
        <table class="no-border-table">
            <tr>
                <td>Nama</td>
                <td>:</td>
                <td>Arief Adhi Nugroho ]</td>
            </tr>
            <tr>
                <td>NIP</td>
                <td>:</td>
                <td>199308252022021001 ]</td>
            </tr>
            <tr>
                <td>Pangkat/Golongan</td>
                <td>:</td>
                <td>Penata Muda Tk.1 / III-b ]</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>PMG Pertama ]</td>
            </tr>
            <tr>
                <td>Unit Organisasi</td>
                <td>:</td>
                <td>Direktorat Instrumentasi dan Kalibrasi ]</td>
            </tr>
            <tr>
                <td>Nama</td>
                <td>:</td>
                <td>Nicholas S Siahaan, S.Tr.Inst ]</td>
            </tr>
            <tr>
                <td>NIP</td>
                <td>:</td>
                <td>19990808 2024041002 ]</td>
            </tr>
            <tr>
                <td>Pangkat/Golongan</td>
                <td>:</td>
                <td>Penata Muda / III-a ]</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>PMG Pertama ]</td>
            </tr>
            <tr>
                <td>Unit Organisasi</td>
                <td>:</td>
                <td>Direktorat Instrumentasi dan Kalibrasi ]</td>
            </tr>
            <tr>
                <td>Nama</td>
                <td>:</td>
                <td>Tatag Maduzena Pambayun, S.Tr.Geof ]</td>
            </tr>
            <tr>
                <td>NIP</td>
                <td>:</td>
                <td>199903292023021001 ]</td>
            </tr>
            <tr>
                <td>Pangkat/Golongan</td>
                <td>:</td>
                <td>Penata Muda / III-a ]</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>PMG Pertama ]</td>
            </tr>
            <tr>
                <td>Unit Organisasi</td>
                <td>:</td>
                <td>Direktorat Instrumentasi dan Kalibrasi ]</td>
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
                <td>Pemeliharaan Adaptif dan Korektif inaTEWS ]</td>
            </tr>
        </table>
        
        <div class="section-title">URAIAN PELAKSANAAN KEGIATAN </div>
        <div class="section-title">Peralatan </div>
        <table>
            <thead>
                <tr>
                    <th rowspan="2">Alat</th>
                    <th colspan="2">Sebelum Pemeliharaan</th>
                    <th colspan="2">Sesudah Pemeliharaan</th>
                </tr>
                <tr>
                    <th>Nama Alat</th>
                    <th>Serial Number</th>
                    <th>Nama Alat</th>
                    <th>Serial Number</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Seismometer</td>
                    <td>Trillium Horizon ]</td>
                    <td>000598 ]</td>
                    <td>Trillium Horizon ]</td>
                    <td>000598 ]</td>
                </tr>
                <tr>
                    <td>Akselerometer</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Digitizer</td>
                    <td>Centaur ]</td>
                    <td>005995 ]</td>
                    <td>Centaur ]</td>
                    <td>005995 ]</td>
                </tr>
                <tr>
                    <td>Data Buffer</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Modem</td>
                    <td>GSM Teltonika ]</td>
                    <td>1125844709 ]</td>
                    <td>GSM Teltonika ]</td>
                    <td>1125844709 ]</td>
                </tr>
                <tr>
                    <td>Solar Panel</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Baterai</td>
                    <td>RHM ]</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>MPPT</td>
                    <td>Growatt ]</td>
                    <td>- ]</td>
                    <td>Growatt ]</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Proteksi Surja</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        
        <div class="section-title">Kondisi Awal </div>
        <ul>
            <li>Ketersedian data dalam kondisi tidak baik atau OFF ]</li>
        </ul>
        
        <div class="section-title">Tindakan Pemeliharaan </div>
        <ul>
            <li>Tanggal: ${ppm.datetime}</li>
            <ul>
                <li>Pembersihan lingkungan: rumput_dahan: ${ppm.pembersihan_lingkungan.rumput_dahan}, sarang: ${ppm.pembersihan_lingkungan.sarang}, cat_tembok: ${ppm.pembersihan_lingkungan.cat_tembok}, cat_pagar: ${ppm.pembersihan_lingkungan.cat_pagar}</li>
                <li>Pembersihan peralatan: parabola_solarcell: ${ppm.pembersihan_peralatan.parabola_solarcell}, regulator: ${ppm.pembersihan_peralatan.regulator}, battery: ${ppm.pembersihan_peralatan.battery}</li>
                <li>Pengecekan sinyal komunikasi ]</li>
                <li>Pengecekan digitizer ]</li>
                <li>Pengecekan baterai ]</li>
                <li>Monitoring setelah pemasangan ]</li>
            </ul>
        </ul>

        <div class="section-title">Hasil Pemeliharaan </div>
        <ul>
            <li>Setelah dilakukan penggantian MPPT Site dalam kondisi ON ]</li>
            <li>Regulator Voltages:</li>
            <ul>
                <li>Regulator 1: Input Panel ${ppm.regulator1.volt.input_panel} V, Input Baterai ${ppm.regulator1.volt.input_baterai} V, Output ${ppm.regulator1.volt.output} V</li>
                <li>Regulator 2: Input Panel ${ppm.regulator2.volt.input_panel} V, Input Baterai ${ppm.regulator2.volt.input_baterai} V, Output ${ppm.regulator2.volt.output} V</li>
                <li>Regulator 3: Input Panel ${ppm.regulator3.volt.input_panel} V, Input Baterai ${ppm.regulator3.volt.input_baterai} V, Output ${ppm.regulator3.volt.output} V</li>
                <li>Regulator 4: Input Panel ${ppm.regulator4.volt.input_panel} V, Input Baterai ${ppm.regulator4.volt.input_baterai} V, Output ${ppm.regulator4.volt.output} V</li>
                <li>Regulator 5: Input Panel ${ppm.regulator5.volt.input_panel} V, Input Baterai ${ppm.regulator5.volt.input_baterai} V, Output ${ppm.regulator5.volt.output} V</li>
                <li>Regulator 6: Input Panel ${ppm.regulator6.volt.input_panel} V, Input Baterai ${ppm.regulator6.volt.input_baterai} V, Output ${ppm.regulator6.volt.output} V</li>
                <li>Regulator 7: Input Panel ${ppm.regulator7.volt.input_panel} V, Input Baterai ${ppm.regulator7.volt.input_baterai} V, Output ${ppm.regulator7.volt.output} V</li>
                <li>Regulator 8: Input Panel ${ppm.regulator8.volt.input_panel} V, Input Baterai ${ppm.regulator8.volt.input_baterai} V, Output ${ppm.regulator8.volt.output} V</li>
            </ul>
            <li>Battery Voltages:</li>
            <ul>
                <li>Battery 1: ${ppm.baterai1_tegangan} V</li>
                <li>Battery 2: ${ppm.baterai2_tegangan} V</li>
                <li>Battery 3: ${ppm.baterai3_tegangan} V</li>
                <li>Battery 4: ${ppm.baterai4_tegangan} V</li>
                <li>Battery 5: ${ppm.baterai5_tegangan} V</li>
                <li>Battery 6: ${ppm.baterai6_tegangan} V</li>
                <li>Battery 7: ${ppm.baterai7_tegangan} V</li>
                <li>Battery 8: ${ppm.baterai8_tegangan} V</li>
            </ul>
            <li>Centering: ${ppm.centering.centering}</li>
            <li>Leveling: broadband: ${ppm.leveling.lv_broadband}, accelerometer: ${ppm.leveling.lv_accelerometer}</li>
            <li>Kabel: ${ppm.kabel.kondisi}</li>
            <li>PLN Tegangan: ${ppm.pln_tegangan}</li>
        </ul>

        <div class="section-title">KESIMPULAN DAN SARAN </div>
        <div class="section-title">Kesimpulan </div>
        <ul>
            <li>Site ${ppm.info_sites[0].kode} sensor, dan modem dalam keadaan baik dan terkirim ke server Jakarta dan bali ]</li>
        </ul>
        
        <div class="section-title">Saran </div>
        <ul>
            <li>Perlu dilakukan pengecekan berkala pada system power dan system komunikasi. ]</li>
        </ul>
        
        <div class="section-title">Pelaksana, </div>
        <table class="signature-table">
            <tr>
                <td>Nama</td>
                <td>Nama</td>
                <td>Nama</td>
            </tr>
            <tr>
                <td>NIP</td>
                <td>NIP</td>
                <td>NIP</td>
            </tr>
            <tr>
                <td style="padding-top: 50px;"></td>
                <td style="padding-top: 50px;"></td>
                <td style="padding-top: 50px;"></td>
            </tr>
            <tr>
                <td>${ppm.nama_pengirim1}</td>
                <td>${ppm.nama_pengirim2}</td>
                <td>${ppm.nama_pengirim3}</td>
            </tr>
            <tr>
                <td>${ppm.nip_pengirim1}</td>
                <td>${ppm.nip_pengirim2}</td>
                <td>${ppm.nip_pengirim3}</td>
            </tr>
        </table>
        
        <div style="page-break-before: always;"></div>
        
        <div class="section-title">LAMPIRAN </div>
        
        <div class="section-title">Lampiran I. Dokumentasi Kegiatan </div>
        <div class="photo-container">
            <div class="photo-item">
                <img src="${ppm.regulator1_ft_input_panel}" alt="Regulator 1 Input Panel">
                <p>Pemeriksaan Sistem Wiring Site</p>
            </div>
            <div class="photo-item">
                <img src="${ppm.regulator1_ft_input_baterai}" alt="Regulator 1 Input Baterai">
                <p>Pemasangan Wiring Dari Baterai ke SCC</p>
            </div>
            <div class="photo-item">
                <img src="${ppm.regulator1_ft_output}" alt="Regulator 1 Output">
                <p>LAN Arrester Setelah dipasang</p>
            </div>
            <div class="photo-item">
                <img src="${ppm.digitizer_foto}" alt="Digitizer Foto">
                <p>SCC setelah dipasang</p>
            </div>
        </div>

    </div>

</body>
</html> `;
    return this.sanitizeHtml(html)
    }
}
module.exports = Helpers;