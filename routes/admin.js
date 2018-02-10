var express=require('express')
var Route=express.Router();
var control=require('../dropbox/controler');
var FILE=require('../mongoose/models/file');
var USER=require('../mongoose/models/user');
var dropbox=new control();
var config=require('../mongoose/models/config');
Route.get('/dashboard',function (req,res) {
    if(req.isAuthenticated()&&req.user.position===4)
    {

        Promise.all([dropbox.getUsageSpace(),FILE.GetCountDown(),USER.count()]).then(function (doc) {
            let spaceused=0,spaceallocate=0;
            for(i=0;i<doc[0].length;i++)
            {
                spaceused+=doc[0][i].used;
                spaceallocate+=doc[0][i].allocation.allocated;
            }
            res.render('admin',{spaceused:spaceused,allocate:spaceallocate,countdown:doc[1],countUser:doc[2].length,listUser:doc[2]});
        })

    }
    else
    {
        res.status(404).end('bạn không đủ quyền');
    }
})
Route.post('/chart',function (req,res) {
    res.send({result:{dataDailySalesCha:[40, 40, 40, 40, 23, 18, 38,12, 17, 7, 17, 23, 18, 38,12, 17, 7, 17, 23, 18, 38,22,22,33]}})
})
Route.post('/config/:id',function (req,res) {
    if(req.isAuthenticated()&&req.user.position===4)
    {
        switch (req.params.id)
        {
            case 'download':
            {
                config.update({download: !express.adminconfig.download})
                    .then(function (re) {
                        express.adminconfig.download = !express.adminconfig.download;
                        res.send({success: 'ok'});

                    })
                break;
            }
            case 'upload':
            {
                config.update({upload: !express.adminconfig.upload})
                    .then(function (re) {
                        express.adminconfig.upload = !express.adminconfig.upload;
                        res.send({success: 'ok'});
                    })
                break;
            }
            case 'limitup':
            {
                config.update({limitup: !express.adminconfig.limitup})
                    .then(function (re) {
                        express.adminconfig.limitup = !express.adminconfig.limitup;
                        res.send({success: 'ok'});
                    })
                break;
            }
            case 'limitdown':
            {
                config.update({limitdown: !express.adminconfig.limitdown})
                    .then(function (re) {
                        console.log(re)
                        express.adminconfig.limitdown = !express.adminconfig.limitdown;
                        res.send({success: 'ok'});
                    })
                break;
            }
            case 'downloadlimit':
            {
                if (Number(req.body.size))
                {
                    config.update({downlength: req.body.size})
                        .then(function (re) {
                            console.log(re)
                            express.adminconfig.downlength = req.body.size;
                            res.send({success: 'ok'});
                        })
                }
                break;
            }
            case 'uploadlimit':
            {
                console.log(req.body)
                if (Number(req.body.size))
                {
                    config.update({uplength: req.body.size})
                        .then(function (re) {
                            console.log(re)
                            express.adminconfig.uplength = req.body.size;
                            res.send({success: 'ok'});
                        })
                }
                break;
            }
        }
    }
})
Route.post('/loadcheckbox',function (req,res) {
    if(req.isAuthenticated()&&req.user.position===4) {
        config.load().then(function (doc) {
            res.send({
                result: {
                    download: doc.download,
                    upload: doc.upload,
                    uploadlimit: doc.limitup,
                    downloadlimit: doc.limitdown,
                    downloadsize: doc.downlength,
                    uploadsize: doc.uplength
                }
            })
        })
    }
})
Route.get('/user',function (req,res) {
    if(req.isAuthenticated()&&req.user.position===4) {
        res.render('user')
    }
})
Route.get('/files',function (req,res) {
    if(req.isAuthenticated()&&req.user.position===4) {
        FILE.GetallAdmin()
            .then(function (data) {
                res.render('table',{data:data})
            })
            .catch(function (err) {
                res.status(404).end(err);
            })
    }
})
module.exports=Route;