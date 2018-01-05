(function () {
    var name=$('#username').text();
    console.log(name)
    if(name.trim()==''){
        $('#username_a').addClass('invisible')
    }
})();