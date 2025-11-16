const Jimp    = require("jimp");
var path = require("path");
        
class Resize{
async resize(filename, size) {
    // Jimp.resize()
    await Jimp.read(__dirname+'/images/'+filename)
        .then(image => {
             image
            .resize(size, Jimp.AUTO) // resize
            .quality(100) // set quality
            .write(path.resolve(__dirname+'/images/'+filename))
        }).catch(err=>{
            console.log(err)
        })
    }

}
module.exports = Resize;