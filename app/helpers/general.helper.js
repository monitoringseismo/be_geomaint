const crypto = require('crypto');

class Helpers{
    encryptText(text){
        var encrypted = crypto.createHash('SHA256').update(text).digest('hex');
        return encrypted
    }
    mappingUser(user){
        var dt = {
            metadata : user.metadata,
            nama: user.nama,
            role: user.role,
            nsim: user.nsim,
            status: user.status
        }
        return dt
    }
    generateRandom(len){
        return crypto.randomBytes(Math.ceil(len/2))
                    .toString('hex') // convert to hexadecimal format
                    .slice(0,len).toUpperCase();   // return required number of characters
    }
}
module.exports = Helpers;