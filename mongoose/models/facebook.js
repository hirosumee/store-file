var mongoose=require('mongoose');
var schema = new mongoose.Schema({
    id: String ,
    token:String,
    name:String,
    email:String,
    displayName:String
});
var user=module.exports= mongoose.model('facebook',schema);