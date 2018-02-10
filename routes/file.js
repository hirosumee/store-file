var express=require('express');
var Route=express.Router();
var multer=require('multer');
var FILE=require('../mongoose/models/file');
var controller=require('../dropbox/controler');
var fs=require('fs')

var dropbox=new controller();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files-upload/')
    },
    filename: function (req, file, cb) {
        req.fileuploadname=Date.now()+'-'+file.originalname;
        cb(null,req.fileuploadname)
    }
})
upload=multer({storage:storage,limits:{fileSize:300*1024*1024}});
Route.post('/upload',upload.single('file'),function (req,res) {
    upload.limits.fileSize=express.adminconfig.downlength;
    if(req.adminconfig.upload) {
        let temp = {
            name: req.fileuploadname,
            size: req.file.size,
            requirePassword: req.body.isrequirepassword === 'true',
            password: req.body.password ? req.body.password : '',
            isPublic: req.body.isPublic === 'true',
            owner: (req.user && req.user.username) ? req.user.username : req.clientIp,
            type: req.file.mimetype
        }
        if (req.file.size > 0 && req.file.originalname.trim() !== '')
        {
            FILE.Create(temp);
            dropbox.uploadOne(req.fileuploadname, req.file.size)
                .then(function (re) {
                    console.log('upload ', req.fileuploadname)
                })
            res.send({success: true})
        }
        else {
            fs.unlink('files-upload/' + req.fileuploadname, function () {
                console.log('delete ok')
            })
            res.send({success: false})
        }
    }
    else
    {
        res.status(300).end('server is in the blocking upload state')
    }
})
Route.get('/requirepass/:id',function (req,res) {
    FILE.FindfilebyId(req.params.id)
        .then(function (data) {
            res.send({result:data.requirePassword})
        })
        .catch(function (err) {
            res.status(404).end(err.toString());
        })
})
Route.post('/download',function (req,res) {
    if(req.adminconfig.download)
    {
        FILE.FindfilebyId(req.body.id)
            .then(function (data) {
                // console.log(data)
                if (data.isPublic && (!data.requirePassword || data.password === req.body.password))
                {
                    let ip = (req.user && req.user.username) ? req.user.username : req.clientIp;
                    ip = ip.toString();
                    let found = false;
                    for (i = 0; i < data.userDownload.length; i++)
                    {
                        if (data.userDownload[i].username === ip)
                        {
                            found = true;
                            data.userDownload[i].countdown++;
                        }
                    }
                    if (!found)
                    {
                        data.userDownload.push({username: ip, countdown: 1});
                    }
                    FILE.Update({id: data._id, downloads: data.downloads + 1, userDownload: data.userDownload})
                        .then(function (doc) {
                            console.log('update file info ok!!!');
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                    dropbox.findone(data.name)
                        .then(function (docs) {
                            let index = 0;
                            let allow=true;
                            for (let i = 0; i < docs.length; i++)
                            {
                                if (docs[i].matches.length >= 1)
                                {
                                    index = i;
                                    allow=docs[i].matches[0].metadata.size<=express.adminconfig.downlength;
                                    break;
                                }
                            }
                            if(allow) {
                                dropbox.downloadFile('/' + data.name, index)
                                    .then(function (name) {
                                        res.download('files-upload/' + name, function (err) {
                                            fs.unlink('files-upload/' + name, function () {
                                                console.log('xóa bộ đệm tải xuống thành công');
                                            })
                                        })
                                    })
                            }
                            else
                            {
                                res.status(404).end('server is in blocking download with file size larger than',express.adminconfig.downlength);
                            }
                        })
                }
            })
            .catch(function (err) {
                res.send('file not found')
            })
    }
    else {
        res.status(300).end('server is in the blocking download state ')
    }
})
Route.get('/info/:id',function (req,res) {
    let id=req.params.id;
    FILE.FindfilebyId(id)
        .then(function (doc) {
            console.log(doc)
            res.render('file',{islogin:!!req.user,doc});
         })
        .catch(function (err) {
            res.status(404).end(err.toString());
        })
})
module.exports=Route;
