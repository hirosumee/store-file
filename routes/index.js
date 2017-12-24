var express = require('express');
var dropbox=require('../Utility/Dropbox');
var formidable=require('formidable');
var router = express.Router();
var fs = require('fs');
var userConfig=require('../config/user-config');
var serverConfig=require('../config/server-config')

var files=require('../models/file');
var timeIndex=new Date();
var listOfFile=[];
/* GET home page. */
router.get('/', function(req, res, next) {
    var t=(new Date())-timeIndex;
    if(t>=serverConfig.timeGetList)
    {
        dropbox.getFileName().then(function (data) {
            timeIndex=new Date();
            listOfFile=data.entries;
            var usn='';
            if(req.user)
            {
                usn=req.user.username;
            }
            res.render('index',{data:data.entries,status:userConfig.user.alert_filesize,username:usn});
        })
    }
    else
    {
        var usn='';
        if(req.user)
        {
            usn=req.user.username;
        }
        res.render('index',{data:listOfFile,status:userConfig.user.alert_filesize,username:usn});
    }

});
router.get('/login', function(req, res, next) {
    if(req.isAuthenticated())
    {
        res.redirect('/')
    }
    else
    {
        res.render('login');
    }
});
router.post('/upload',function (req,res) {
    var form=new formidable.IncomingForm();
    form.multiples=false;
    form.uploadDir= './';
    form.parse(req,function (err, fields, file) {
        //path tmp trên server
        var pathf = file.files.path;

        if(file.files.name!=''&&file.files.size<=res.uploadRange) {
            //thiết lập path mới cho file
            var newpath = form.uploadDir +file.files.name;
            fs.rename(pathf, newpath, function (err) {
                if (err) console.error(err);
                //
                dropbox.upload('\\',file.files.name)
                    .then(function (data) {
                        fs.unlink(file.files.name,function (err) {
                            console.log('xóa bộ đệm tải lên thành công');
                        });
                        var ip = req.headers['x-forwarded-for'] ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;

                        var filec={
                            name:file.files.name,
                            ip:ip,
                            user:'notLogined'
                        };
                        if(req.user)
                        {
                            filec.user=req.user.username;
                        }
                        files.Created(filec);
                        console.log(data);
                        res.redirect('/');
                    })
                    .catch(function (err) {
                        console.error(err);
                        res.redirect('/');
                    })
            });
        }
        else
        {
            fs.unlink(pathf,function (err) {
                console.log('delete file size null');
            });
            res.redirect('/');
        }
    });
});
router.get('/file/:id',function (req,res) {
    Promise.all([dropbox.getFileName(),files.FindByName(req.params.id)])
        .then(function (data) {
            for(i=0;i<data[0].entries.length;i++)
            {
                if(req.params.id==data[0].entries[i].name)
                {
                    res.render('file',{name:req.params.id,size:Math.round(data[0].entries[i].size/(1024*1024)),uploaded:data[1][0].date,username:'',status:userConfig.user.alert_filesize})
                }
            }
        })
        .catch(function (err) {
            res.redirect('/');
        })
})
router.get('/download/:id',function (req,res) {
    dropbox.download(req.params.id)
        .then(function (data) {
            res.download(data,function (e) {
                if(e)
                {
                    console.error('lỗi tải xuống');
                }
                else
                {
                    console.log('tải xuống thành công',req.params.id);
                    fs.unlink(data,function (err) {
                        console.log('xóa bộ đệm tải xuống thành công');
                    })
                }
            })
        })
        .catch(function (err) {
            console.error(err);
            res.redirect('/');
        })
});
module.exports = router;
