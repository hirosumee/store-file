module.exports.server={
    keyDb:"mongodb://hirosume:cuong299@ds046267.mlab.com:46267/v3storefile"
    // keyDb:'mongodb://localhost/27017'
}
module.exports.facebook = {
    'facebookAuth' : {
        'clientID'      : '431937823887880', // your App ID
        'clientSecret'  : '74221a23dc42c07706fb49037cdd8452', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    }
};
module.exports.dropbox={
    app:[{client_key:'yVTsOyK9OvAAAAAAAAAAZ_IlL-NV1X6RcSaED0gInBiaoFw1GcYFSIJqCTKVNE8w',maxStorege:2*1024*1024,currentStorge:0},
        {client_key:'fxwt5a1m1YAAAAAAAAAAEVLAO5jwH2yutFXm3464gtgMpllOmge6JjBgxkRF9sBu',maxStorege:2*1024*1024,currentStorge:0}]
}
module.exports.fileUpload={
    maxSize:{
        admin:300*1024*1024,
        user:100*1024*1024
    }
}
