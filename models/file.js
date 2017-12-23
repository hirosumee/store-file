var mongoose=require('mongoose');
var fileSchema=mongoose.Schema({
    name:String,
    date:String,
    ip:String,
    user:String
})
var files=module.exports=mongoose.model('file',fileSchema);
var find=module.exports.FindByName=function (name) {
    return new Promise(function (resolve,reject) {
        file.find({name:name},function (err,data) {
            if(err||!data)
                reject('not found')
            resolve(data);
        })
    })
}
var create=module.exports.Created=function (file) {
    file.date=(new Date()).toUTCString();
    files.create(file);
}