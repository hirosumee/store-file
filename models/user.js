var mongoose=require('mongoose');
var userSchema=mongoose.Schema({
    username:String,
    password:String,
    position:String
});
var user=module.exports=mongoose.model('user',userSchema);

var find=module.exports.Find=function (username) {
    return new Promise(function (resolve,reject) {
        user.findOne({'username':username},function (err,data) {
            if(err||!data)
                reject('username not found');
            if(data)
                resolve(data);
        })
    })
};
module.exports.Create=function (User) {

    return new Promise(function (resolve,reject) {

        find(User.username)
            .then(function (data) {
                reject('account existed')
            })
            .catch(function (data) {
                user.create(User);
                resolve('created')
            })
    })
}

module.exports.Compare=function (User) {
    return new Promise(function (resolve,reject) {
        find(User.username)
            .then(function (data) {
                if(User.username===data.username&&User.password===data.password)
                {
                    resolve(data)
                }
                else
                {
                    reject('not same')
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })

}
module.exports.FindById=function (id) {
return new Promise(function (resolve,reject) {
    user.findById(id,function (err,data) {
        if(err||!data)
            reject('not found');
        if(data)
            resolve(data)
    })
})
}