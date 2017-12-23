var express = require('express');
var dropbox=require('../Utility/Dropbox');
var formidable=require('formidable');
var router = express.Router();
var path = require('path');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
    dropbox.getFileName().then(function (data) {
        res.render('index',{data:data.entries});
    })
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
    form.uploadDir= path.join(__dirname, '/uploads');
    form.parse(req,function (err, fields, file) {
        //path tmp trên server
        var pathf = file.files.path;
        if(file.files.name!=''&&file.files.size<20000000) {
            //thiết lập path mới cho file
            var newpath = form.uploadDir +'\\'+ file.files.name;
            console.log(newpath);
            fs.rename(pathf, newpath, function (err) {
                if (err) console.error(err);
                //
                dropbox.upload(form.uploadDir,file.files.name)
                    .then(function (data) {
                        fs.unlink('./'+file.files.name,function (err) {
                            console.log('xóa bộ đệm tải lên thành công');
                        })
                        console.log(data);
                        res.redirect('/')
                    })
                    .catch(function (err) {
                        console.error(err)
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
    return ;
});
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
