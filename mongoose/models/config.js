var mongoose=require('mongoose');
var Promise = require("bluebird");
mongoose.Promise=Promise;
var server=new mongoose.Schema({
    id:{type:Number,default:1},
    download:{type:Boolean,default:true},
    upload:{type:Boolean,default:true},
    limitup:{type:Boolean,default:true},
    limitdown:{type:Boolean,default:true},
    uplength:{type:Number,default:100*1024*1024},
    downlength:{type:Number,default:100*1024*1024},
});
var server=mongoose.model('server',server);

module.exports.load=function () {
    return server.findOne({id:1})
}
module.exports.update=function (inp) {
    let temp={};
    if(inp.download!=null)
    {
        temp.download=inp.download;
    }
    if(inp.upload!=null)
    {
        temp.upload=inp.upload;
    }
    if(inp.limitup!=null)
    {
        temp.limitup=inp.limitup;
    }
    if(inp.limitdown!=null)
    {
        temp.limitdown=inp.limitdown;
    }
    if(inp.uplength!=null)
    {
        temp.uplength=inp.uplength;
    }
    if(inp.downlength!=null)
    {
        temp.downlength=inp.downlength;
    }
    return  server.findByIdAndUpdate('5a64572783768eb43536193f', { $set:temp}, { new: true })
}
