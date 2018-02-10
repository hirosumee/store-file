$(document).ready(() => {
    let files = $('tbody tr').length;
    let height=$(window).height();
    $('#chat').css('height',(height-3)+'px');
    $('#collapse-setting').click(function () {
        $('#form-login').css('margin-right', '89px')
    });
    $('body').click(() => {
        $('#form-login').css('margin-right', '0px')
    });
    $('tbody').click((sender) => {
        window.location='/file/info/'+$(sender.target).attr('id');
    })
    $('#submit-button').click(function () {
        $.ajax({
                url: '/login',
                type: 'post',
                dataType:'json',
                data:{username:$('#exampleInputId').val(),password:$('#exampleInputPassword').val()},
                success:function (ress) {
                    console.log(ress)
                    $('#exampleModal').modal('hide');
                    $('#collapse-setting',).notify("Login Successful",'success');
                    window.location.reload(true);
                }
            }
        )
    })
    var slidebar=false;
    $('#slide-bar').click(function () {
        if(slidebar)
        {
            slidebar=!slidebar;
            $('#chat-content').empty();
            for(i=24;i>=0;i--)
            {
                setTimeout(function (i) {
                    $('#chat').css('width',i+'%');
                },(24-i)*10,i);
            }
        }
        else
        {
            slidebar=!slidebar;
            for(i=1;i<=25;i++)
            {
                setTimeout(function (i) {

                    $('#chat').css('width',i+'%');
                },i*10,i);
            }
        }

    })
    $(document).on('click', '.browse', function(){
        var file = $(this).parent().parent().parent().find('.file');
        file.trigger('click');
    });
    $(document).on('change', '.file', function(){
        $('#filename').val($('input.file').val().replace(/C:\\fakepath\\/i, ''))
    });
    $('#isrequirepassword').click(function () {
        if(!$('#isrequirepassword').attr('checked'))
        {
            $('#password').prop('disabled',false)
        }
    })
    $('#upload-file').click(function () {
        // $.ajax({
        //
        // })
        if($('#filename').val())
        {
            let form =new FormData();
            //console.log(form)
            form.append('file', $('input[name="file"]')[0].files[0])
            form.append('isPublic',$('#public-private').is(':checked'));
            let requirepass=$('#isrequirepassword').is(':checked');
            form.append('isrequirepassword',requirepass);
            if(requirepass)
            {
                form.append('password',$('#password').val());
            }
            let xmlhttprequest=new XMLHttpRequest();
            xmlhttprequest.open('POST','file/upload',true);
            xmlhttprequest.onload=function (event) {
                if(xmlhttprequest.status==200)
                {
                    console.log('upload succesfull');
                    setTimeout(function () {
                        $('#progressbar').css('width', 0+'%').attr('aria-valuenow', 0);
                        $('#ModalUpload').modal('hide')
                    },1000)
                }
                else
                {
                    console.log(`upload spawn an error with status ${xmlhttprequest.status}`);
                }
            }
            xmlhttprequest.onprogress=function (evt) {
                if (evt.lengthComputable)
                {
                    var percentComplete = (evt.loaded / evt.total) * 100;
                    $('#progressbar').css('width', percentComplete+'%').attr('aria-valuenow', percentComplete);
                }
            }
            xmlhttprequest.send(form)
        }
        else
        {
            $('#ModalUpload').modal('hide');
            $('button.browse.btn.btn-dark.input-lg').notify('Please choose a file to upload','warning')
        }
    })
})
