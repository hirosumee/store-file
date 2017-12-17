var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable=require('formidable');
var filter_File=require('../ulti/filter_file');
/* GET home page. */
router.get('/', function(req, res, next) {
  var a=filter_File('store-file');
  a.then(function (data) {
      res.render('index', { title: 'Express' ,remain:'Server chỉ có 500mb lưu trữ',data:data });
  })
});
router.get('/download/:id',function (req,res) {
  res.download('store-file/'+req.params.id,function (e) {
      if(e)
      {
        console.error('lỗi tải xuống');
      }
      else
      {
        console.log('tải xuống thành công',req.params.id);
      }
  })
});
router.post('/upload',function (req,res) {
    var form =  new formidable.IncomingForm();
    //Thiết lập thư mục chứa file trên server
    form.uploadDir = "store-file/";
    //xử lý upload
    form.parse(req,function (err, fields, file) {
        //path tmp trên server
        var path = file.choose.path;
        if(file.choose.name!='') {
            //thiết lập path mới cho file
            var newpath = form.uploadDir + file.choose.name;
            fs.rename(path, newpath, function (err) {
                if (err) console.error(err);
                res.redirect('/')
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
