var mongoose=require('mongoose');
var moment=require('moment-timezone');
var bcrypt=require('bcrypt');


var schema=new mongoose.Schema({
    username:{type:String},
    password:{type:String,min:4},
    joinTime:{type:String,default:moment.tz(new Date(),"hh:mm:ss", "Asia/Ho_Chi_Minh").format('LLL')},
    position:{type:Number,default:1},
    //1 user
    //2 mod
    //3 slv
    //4 admin
})
var user=mongoose.model('user',schema);
var findbyName=module.exports.findUserbyName=function (username) {
    return new Promise(function (resolve,reject) {
        user.find({username:username},function (err,docs) {
            if(err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.findbyId=function (id) {
    return new Promise(function (resolve,reject) {
        user.findById(id,function (err,doc) {
            if(err) reject(err)
            resolve(doc)
        })
    })
}
module.exports.create=function (username,password) {
    return new Promise(function (resolve,reject) {
        findbyName(username)
            .then(function (docs) {
                //if docs==[] then create
                if(docs.length==0)
                {
                   bcrypt.hash(password,10)
                        .then(function (hash) {
                            user.create({username:username,password:hash});
                            resolve(`create successfull ${username}`);
                        })
                }
                else
                {
                    reject(`user ${username} existed`);
                }
            })
            .catch(function (err) {
                reject(err);
            })
    })
}
module.exports.count=function () {
    return new Promise((resolve,reject)=>{
        user.find()
            .then((docs)=>resolve(docs))
            .catch((err)=>resolve([]))
    })
}
