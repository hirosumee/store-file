var mongoose=require('mongoose');
var fileSchema=mongoose.Schema({
    name:String,
    date:String,
    ip:String,
    user:String,
    download:Number,
    lastdown:String,
    password:String,
    downloadLimited:Number
})
var files=module.exports=mongoose.model('file',fileSchema);
var find=module.exports.FindByName=function (name) {
    return new Promise(function (resolve,reject) {
        files.find({name:name},function (err,data) {
            if(err||!data)
                reject('not found')
            resolve(data);
        })
    })
}
var create=module.exports.Created=function (file) {
    file.date=(new Date()).toUTCString();
    file.download=0;
    files.create(file);
}
var updateDownload=module.exports.Update=function (param) {
    return new  Promise(function (resolve,reject) {
        files.findByIdAndUpdate(param[0]._id, { $set: { lastdown:new Date().toUTCString(),downloadLimited:param[0].downloadLimited-1,download:param[0].download==null?1:param[0].download+1}}, { new: true }, function (err, tank) {
            if (err){console.log(err); reject(err)}
            if(!tank){console.log('khong tim thay file');reject("khoong tim thay file")}
            console.log(tank)
            resolve('update download file')
        });
    })

}