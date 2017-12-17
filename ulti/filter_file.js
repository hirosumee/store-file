var fs=require('fs');
module.exports=function (path) {
    return new Promise(  function (resolve,reject) {
        fs.readdir(path, function (err,items) {
            if(err){
                reject('no item')
            }
            else
            {
                var data=[];
                 for( i=0;i<items.length;i++)
                {
                    var f=fs.statSync(path+'/'+items[i]);
                    data.push({name:items[i],size:f.size});
                }
                resolve(data);
            }

        })
    })
}