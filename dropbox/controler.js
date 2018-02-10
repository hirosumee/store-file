var dropbox=require('./dropbox');
var config=require('../configure/config').dropbox.app;
var fs=require('fs');
var controlDropbox=function() {
    let tmp=[];
    let configs=config;
    for(i=0;i<configs.length;i++)
    {
        if(!this.lisdrop)
        {
            this.listdrop=[];
        }
        tmp.push(new dropbox(configs[i].client_key))
    }
    this.listdrop=tmp;
}
controlDropbox.prototype.getAll=function () {
    let temp=[];
    for(i=0;i<this.listdrop.length;i++)
    {
        temp.push(this.listdrop[i].getAllFile())
    }
    return Promise.all(temp);
}
controlDropbox.prototype.findone=function (name) {
    let temp=[];
    for(i=0;i<this.listdrop.length;i++)
    {
        temp.push(this.listdrop[i].FindFile(name))
    }
    return Promise.all(temp);
}
controlDropbox.prototype.createNew=function (token) {
    this.listDropbox.push(new dropbox(token));
}
controlDropbox.prototype.removeOne=function (index) {
    controlDropbox.listDropbox.slice(index,1);
}
function DropUsage(list,size) {
    return new Promise((resolve,reject)=>{
        for(let i=0;i<list.length;i++)
        {
            list[i].SpaceUsage()
                .then(function (data) {
                    if(data.used+size<data.allocation.allocated)
                    {
                        resolve(i);
                    }
                    else
                    {
                        if(i===list.length-1)
                        {
                            reject('not found')
                        }
                    }
                })
        }
    })
}
controlDropbox.prototype.getUsageSpace=function () {
    let temp=this.listdrop.map((elem)=>elem.SpaceUsage())
    return Promise.all(temp);
}
controlDropbox.prototype.uploadOne=function (name,size) {
    let temp=this.listdrop;
    return new Promise((resolve ,reject)=>{
        DropUsage(temp,size)
            .then(function (index) {
                fs.readFile('files-upload/'+name,function (err,data) {
                    if(!err){
                        fs.unlink('files-upload/'+name,(err)=>console.log('delete in local oke'))
                        temp[index].UploadOne('/'+name,data)
                            .then((re)=>resolve('oke'))
                    }
                })
            })
    })

}
controlDropbox.prototype.downloadFile=function (name,index) {
    var tmp=this.listdrop;
    return new Promise((resolve ,reject)=>{
        tmp[index].Download(name)
            .then(function (data) {
                fs.writeFile('files-upload/'+data.name, data.fileBinary, 'binary', function (err) {
                    if (err) { throw err; }
                    console.log('File: ' + data.name + ' saved.');
                    resolve(data.name);
                });
            })
            .catch(function (err) {
                reject(err)
            })
    })
}
module.exports=controlDropbox;