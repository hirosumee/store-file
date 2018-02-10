$(document).ready(function () {
    let files = $('tbody tr').length;
    let height=$(window).height();
    for(var i=0;i<=height/58-files;i++)
    {
        $('#list').append("<tr class=\"ddd\" style='height: 40px;'>\n" +
            "                    <th scope=\"row\"></th>\n" +
            "                    <td id=\"\"></td>\n" +
            "                    <td id=\"\"></td>\n" +
            "                    <td id=\"\"></td>\n" +
            "                </tr>");
    }
})