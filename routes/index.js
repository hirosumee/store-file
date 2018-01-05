var express = require('express');
var dropbox = require('../Utility/Dropbox');
var formidable = require('formidable');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads/', limits: {fileSize: 10000000}});

var userConfig = require('../config/user-config');
var serverConfig = require('../config/server-config')

var files = require('../models/file');
var timeIndex = new Date();
var isfirst = true;
var listOfFile = [];
/* GET home page. */
router.get('/', function (req, res, next) {
    var t = (new Date()) - timeIndex;
    if (t >= serverConfig.timeGetList || isfirst) {
        isfirst = false;
        dropbox.getFileName().then(function (data) {
            timeIndex = new Date();
            listOfFile = data.entries;
            var usn = '';
            if (req.user) {
                usn = req.user.username;
            }
            res.render('index', {data: data.entries, status: userConfig.user.alert_filesize, username: usn});
        })
    }
    else {
        var usn = '';
        if (req.user) {
            usn = req.user.username;
        }
        res.render('index', {data: listOfFile, status: userConfig.user.alert_filesize, username: usn});
    }

});
router.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    else {
        res.render('login');
    }
});
router.post('/upload', upload.single("files"), function (req, res, next) {
    if (req.file && req.file.originalname.trim().length > 0) {
        var path_name = './uploads/' + req.file.originalname;
        fs.rename('./uploads/' + req.file.filename, path_name, function (err) {
            if (err) {
                res.redirect('/')
            }
            else {
                dropbox.upload('./uploads', req.file.originalname)
                    .then(function (data) {
                        fs.unlink(path_name, function (err) {
                            console.log('xóa bộ đệm tải lên thành công');
                        });
                        var ip = req.headers['x-forwarded-for'] ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;
                        var filec = {
                            name: req.file.originalname,
                            ip: ip,
                            user: 'notLogined',
                            password: req.body.password.trim(),
                            downloadLimited: (Number(req.body.downloadLimited)&&Number(req.body.downloadLimited)!=-1) ? Number(req.body.downloadLimited) : 1000
                        };
                        if (req.user) {
                            filec.user = req.user.username;
                        }
                        files.Created(filec);
                        console.log(data);
                        res.redirect('/file/' + req.file.originalname);
                    })
                    .catch(function (err) {
                        console.error(err);
                        res.redirect('/');
                    })
            }
        });
    }
    else {
        if (req.file) {
            fs.unlink('./uploads/' + req.file.filename, function (err) {
                console.log('xóa bộ đệm tải lên thành công');
            });
        }
        res.redirect('/');
    }
})
//router.post('/upload',function (req,res) {
// var form=new formidable.IncomingForm();
// form.multiples=false;
// form.uploadDir= './';
// form.parse(req,function (err, fields, file) {
//     //path tmp trên server
//     var pathf = file.files.path;
//
//     if(file.files.name!=''&&file.files.size<=res.uploadRange) {
//         //thiết lập path mới cho file
//         var newpath = form.uploadDir +file.files.name;
//         fs.rename(pathf, newpath, function (err) {
//             if (err) console.error(err);
//             //
//             dropbox.upload('\\',file.files.name)
//                 .then(function (data) {
//                     fs.unlink(file.files.name,function (err) {
//                         console.log('xóa bộ đệm tải lên thành công');
//                     });
//                     var ip = req.headers['x-forwarded-for'] ||
//                         req.connection.remoteAddress ||
//                         req.socket.remoteAddress ||
//                         req.connection.socket.remoteAddress;
//
//                     var filec={
//                         name:file.files.name,
//                         ip:ip,
//                         user:'notLogined'
//                     };
//                     if(req.user)
//                     {
//                         filec.user=req.user.username;
//                     }
//                     files.Created(filec);
//                     console.log(data);
//                     res.redirect('/');
//                 })
//                 .catch(function (err) {
//                     console.error(err);
//                     res.redirect('/');
//                 })
//         });
//     }
//     else
//     {
//         fs.unlink(pathf,function (err) {
//             console.log('delete file size null');
//         });
//         res.redirect('/');
//     }
// });
//});
router.get('/file/:id', function (req, res) {
    Promise.all([dropbox.getFileName(), files.FindByName(req.params.id)])
        .then(function (data) {
            var check = false;
            for (i = 0; i < data[0].entries.length; i++) {
                if (req.params.id == data[0].entries[i].name) {
                    check = true;
                    var usn;
                    if (req.user) {
                        usn = req.user.username;
                    }
                    res.render('file', {
                        name: req.params.id,
                        size: Math.round(data[0].entries[i].size / (1024)),
                        uploaded: data[1][0].date,
                        status: userConfig.user.alert_filesize,
                        downloads: data[1][0].download,
                        username: usn,
                        password:data[1][0].password==""?0:1
                    });
                }
            }
            if (!check) {
                res.redirect('/');
            }
        })
        .catch(function (err) {
            res.redirect('/');
        })
})
router.post('/download', function (req, res) {
    files.FindByName(req.body.name)
        .then(function (dataF) {
            if (req.body.password == dataF[0].password&&dataF[0].downloadLimited>0) {
                dropbox.download(dataF[0].name)
                    .then(function (data) {
                        res.download(data, function (e) {
                            if (e) {
                                console.error('lỗi tải xuống', e);
                            }
                            else {
                                console.log('tải xuống thành công');
                                fs.unlink(data, function () {
                                    console.log('xóa bộ đệm tải xuống thành công');
                                })
                            }
                        })
                    })
                    .catch(function (value) {
                        console.log(value);
                        res.redirect(req.originalUrl);
                    });
            }
            else
            {
                res.redirect(req.originalUrl);
            }
            if(dataF.length>0){
                files.Update(dataF)
                    .then(function (resp1) {
                        console.log(resp1)
                    })
                    .catch(function (reason) {
                        console.log(reason)
                    })
            }
        })
        .catch(function (reason) {
            console.log(reason)
        })

});
router.get('/preview/:link', function (req, res) {
    dropbox.getThumbnail(req.params.link)
        .then(function (data) {
            res.write(data, "binary");
            res.end();
        })
        .catch(function (reason) {
            res.send(reason);
        })
})
module.exports = router;
