var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable=require('formidable');
var dropbox=require('../ulti/Dropbox');
/* GET home page. */
router.get('/', function(req, res, next) {
    //
    dropbox.getFileName().then(function (data) {
        res.render('index', { title: 'Express' ,remain:'Server chỉ có 500mb lưu trữ',data:data.entries });
    })
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
            console.error(err)
        })
});
router.post('/upload',function (req,res) {
    var form =  new formidable.IncomingForm();
    //Thiết lập thư mục chứa file trên server
    form.uploadDir = "./";
    //xử lý upload
    form.parse(req,function (err, fields, file) {
        //path tmp trên server
        var path = file.choose.path;
        if(file.choose.name!='') {
            //thiết lập path mới cho file
            var newpath = form.uploadDir + file.choose.name;
            fs.rename(path, newpath, function (err) {
                if (err) console.error(err);
                dropbox.upload('.\\store-file',file.choose.name)
                    .then(function (data) {
                        fs.unlink('./'+file.choose.name,function (err) {
                            console.log('xóa bộ đệm tải lên thành công');
                        })
                        console.log(data);
                        res.redirect('/')
                    })
                    .catch(function (err) {
                        console.error(err)
                    })
            });
        }
        else
        {
          fs.unlink(path,function (err) {
              console.log('delete file size null');
          });
          res.send('vui lòng chọn file hoặc file có tên không hợp lệ!!');
        }
    });
    return ;
})
module.exports = router;
