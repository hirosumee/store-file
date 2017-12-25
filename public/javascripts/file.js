function check_review() {
    var alt=$('#image-pre').attr('alt');
    alt=alt.split('.');
    alt=alt[alt.length-1];
    if(alt=='jpg'||alt=='png'||alt=='jepg')
    {

    }
    else
    {
        $('#btn-open-popup').addClass('invisible');
    }
}
$(document).ready(function(){
    check_review();
    $("#btn-open-popup").click(function(even) {
        even.preventDefault(); // không truy cập đến link trong thẻ a
        $.get("/preview/"+$('#image-pre').attr('alt'), function(response){
            console.log('ok')
            $('#image-pre').attr('src','/preview/'+$('#image-pre').attr('alt'));
           loadPopup(); // function show popup
        });

    });
    $("#btn-close").click(function(){
        disablePopup();
    });
    $(this).keydown(function(event) {
        if (event.which == 27) { // 27 is 'Ecs' in the keyboard
            disablePopup();  // function close pop up
        }
    });
    $("#background-popup").click(function() {
        disablePopup();  // function close pop up
        disableLoginPopup();
    });
    var popupStatus = 0; // set value
    function loadPopup() {
        if(popupStatus == 0) { // if value is 0, show popup
            $("#to-popup").fadeIn(200); // fadein popup div
            $("#background-popup").css("opacity", "0.8"); // css opacity, supports IE7, IE8
            $("#background-popup").fadeIn(200);
            popupStatus = 1; // and set value to 1
        }
    }
    function disablePopup() {
        if(popupStatus == 1) { // if value is 1, close popup
            $("#to-popup").fadeOut(300);
            $("#background-popup").fadeOut(300);
            $('body,html').css("overflow","auto");//enable scroll bar
            popupStatus = 0;  // and set value to 0
        }
    }
});