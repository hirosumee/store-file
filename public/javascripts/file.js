$(document).ready(function () {
    var alt = $('li.list-group-item span').attr('id');
    console.log(alt)
    alt = alt.split('.');
    alt = alt[alt.length - 1];
    if (alt == 'jpg' || alt == 'png' || alt == 'jepg' || alt == 'PNG')
    {
        $('div.button-control button').after('<a href="#" class="btn btn-danger btn-lg" style="margin-left: 10px;">Preview</a>')
    }
    $('div.button-control button').click(function (evt) {
        $.ajax({
            url:'/file/requirepass/'+$('div.button-control button').attr('id'),
            type:'get',
            dataType:'json',
            success:function (result) {
                console.log(result)
                if(result.result)
                {
                    $('#requirepassword').modal('show');
                }
                else
                {
                    var form = $('<form></form>').attr('action', '/file/download').attr('method', 'post');
                    form.append($("<input></input>").attr('type', 'hidden').attr('name', 'id').attr('value', $('div.button-control button').attr('id')));
                    form.appendTo('body').submit().remove();
                }
            }
        })
    })
    $('#download-button').click(function (evt) {
        var form = $('<form></form>').attr('action', '/file/download').attr('method', 'post');
        form.append($("<input></input>").attr('type', 'hidden').attr('name', 'id').attr('value', $('div.button-control button').attr('id')));
        form.append($("<input></input>").attr('type', 'hidden').attr('name', 'password').attr('value',$('#passwordfile').val() ));
        form.appendTo('body').submit().remove();
    })
})