const crypto = require('crypto');

class Helpers {
    encryptText(text) {
        var encrypted = crypto.createHash('SHA256').update(text).digest('hex');
        return encrypted
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
}
module.exports = Helpers;