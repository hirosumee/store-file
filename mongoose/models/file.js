var mongoose=require('mongoose');
var Promise = require("bluebird");
// Promise.promisifyAll(mongoose);
mongoose.Promise=Promise;
var moment=require('moment-timezone');
var user=new mongoose.Schema({
    username:String,countdown:Number
})
var schema=new mongoose.Schema({
    name:String,
    size:Number,
    time:String,
    type:String,
    userDownload:[user],
    requirePassword:Boolean,
    password:String,
    isPublic:Boolean,
    owner:String,
    downloads:{type:Number,default:0}
})
var FILE=mongoose.model('file',schema);
module.exports.Create=function (data) {
    let temp={
        name:data.name,
        size:data.size,
        time:moment.tz(new Date(),"hh:mm:ss", "Asia/Ho_Chi_Minh").format('LLL'),
        userDownload:[],
        requirePassword:data.requirePassword,
        password:data.password,
        isPublic:data.isPublic,
        owner:data.owner,
        type:data.type
    }
    return FILE.create(temp);
}
module.exports.Update=function (data) {
    let tmp={};
    if(data.name)
    {
        tmp.name=data.name;
    }
    if(data.requirePassword)
    {
        tmp.requirePassword=data.requirePassword;
    }
    if(data.password)
    {
        tmp.password=data.password;
    }
    if(data.userDownload)
    {
        tmp.userDownload=data.userDownload;
    }
    if(data.isPublic)
    {
        tmp.isPublic=data.isPublic;
    }
    if(data.downloads)
    {
        tmp.downloads=data.downloads;
    }
    return FILE.findByIdAndUpdate(data.id, { $set:tmp}, { new: true })
}
module.exports.Getallpublic=function () {
    return FILE.find({isPublic:true});
}
module.exports.Getall=function (username) {
    return FILE.find({owner:username});
}
module.exports.GetallAdmin=function () {
    return FILE.find();
}
module.exports.FindbyName=function (filename) {
    return FILE.find({name:filename});
}
module.exports.FindfilebyId=function (id) {
    return FILE.findById(id);
}
module.exports.GetallOwner=function (name) {
    return FILE.find({owner:name});
}
module.exports.GetCountDown=function () {
    return new  Promise(function (resolve,reject) {
         FILE.find()
             .then(function (docs) {
                 var count=0;
                 for(let i=0;i<docs.length;i++)
                 {
                     count+=docs[i].downloads;
                 }
                 resolve(count)
             })
             .catch((e)=>resolve(0))
    })
}