var mongoose=require('mongoose');
var Schema=mongoose.Schema({
    ip:String,
    count:Number,
    time:Number
})
var user=module.exports=mongoose.model('useracess',Schema);
var create=module.exports.createip=function (ip) {
    user.create({ip:ip,count:0,time:0});
}
var findip=module.exports.findip=function (ip) {
    return new Promise(function (resolve,reject) {
        user.find({ip:ip},function (err,data) {
            if(err||data.length==0) {reject('notfound');}
            resolve(data);
        })
    })
}
module.exports.update=function (ip) {
    findip(ip)
        .then(function (data) {
            data[0].count+=1;
            data[0].save();
        })
        .catch(function (reason) {
            create(ip);
        })
}