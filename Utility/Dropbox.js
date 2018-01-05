var dropbox=require('dropbox');
var fs=require('fs');
dropbox.access_token='yVTsOyK9OvAAAAAAAAAAL7tjqxUEWOGqH-Og8rcuge-J9tSAx9HKEPDlVwFZhA_e';
var dbx=new dropbox({accessToken:dropbox.access_token});

//
var getfile=module.exports.getFileName=function () {
    return new Promise(function (resolve,reject) {
        dbx.filesListFolder({path:''})
            .then(function (res) {
                resolve(res);
            })
            .catch(function (err) {
                reject('lỗi get file name');
            })
    })
};
var upload=module.exports.upload=function (path,name) {
    return new Promise(function (resolve,reject) {
        getfile()
            .then(function (res) {
                for( i=0;i<res.entries.length;i++)
                {
                    if(res.entries[i]['.tag']==='file')
                    {
                        if(res.entries[i].name===name)
                        {
                            reject('file đã tồn tại')
                        }
                    }
                }
                //
                fs.readFile(path+'/'+name,function (err,data) {
                    if(err)
                    {
                        console.log(err);
                        reject('lỗi đọc file');
                    }
                    else
                    {
                        dbx.filesUpload({path:'/'+name,contents:data})
                            .then(function (res) {

                                resolve('upload thành công :'+name);
                            })
                    }
                })
                //
            })
            .catch (function (err) {
                reject(err);
            })
    });
};
//
var download =module.exports.download=function (name) {
    return new Promise(function (resolve,reject) {
        getfile()
            .then( function (res) {
                for( i=0;i<res.entries.length;i++)
                {
                    if(res.entries[i]['.tag']==='file')
                    {
                        if(res.entries[i].name===name)
                        {
                            dbx.filesDownload({path:'/'+name}).then(
                                function (data) {
                                    //  console.log(data);
                                    fs.writeFile(data.name, data.fileBinary, 'binary', function (err) {
                                        if (err) { throw err; }
                                        console.log('File: ' + data.name + ' saved.');
                                        resolve(data.name);
                                    });
                                }
                            )

                        }
                    }
                }
                //file không tồn tại
                //
            })
            .catch(function (err) {
                reject(err)
            })
    });
};
module.exports.getThumbnail=function (name) {
    return new Promise(function (resolve,reject) {
        getfile()
            .then( function (res) {
                for( i=0;i<res.entries.length;i++)
                {
                    if(res.entries[i]['.tag']==='file')
                    {
                        if(res.entries[i].name===name)
                        {
                            dbx.filesDownload({path:'/'+name}).then(
                                function (data) {
                                    resolve(data.fileBinary);
                                    //  console.log(data);
                                    // fs.writeFile('./public\\images\\'+data.name, data.fileBinary, 'binary', function (err) {
                                    //     if (err) { throw err; }
                                    //     console.log('File: ' + data.name + ' saved.');
                                    //     resolve(data.name);
                                    // });
                                }
                            )

                        }
                    }
                }
                //file không tồn tại
                //
            })
            .catch(function (err) {
                reject(err)
            })
    });
};