require('isomorphic-fetch');
var dropbox=require('dropbox');
var fs=require('fs');
// var config=require('../configure/config');
// var dbx=new dropbox({accessToken:config.dropbox.client_key});
var Dropbox=function (accessToken) {
    this.accessToken=accessToken;
    this.dbx=new dropbox({accessToken:this.accessToken});
};
Dropbox.prototype.getAllFile=function()
{
    return this.dbx.filesListFolder({path:''});
}
Dropbox.prototype.FindFile=function (name) {
    return this.dbx.filesSearch({path:'',query:name,start:0,mode:'filename'});
}
Dropbox.prototype.Download=function(filename)
{
    return this.dbx.filesDownload({path:filename});
}
Dropbox.prototype.UploadOne=function (pathandname,binary) {
     return this.dbx.filesUpload({path:pathandname,contents:binary});
}
Dropbox.prototype.SpaceUsage=function () {
    return this.dbx.usersGetSpaceUsage();
}
module.exports=Dropbox;
