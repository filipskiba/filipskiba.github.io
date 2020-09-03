$(document).ready(function () {
    var rates = [];
    newsRotate(0);


    function newsRotate(i) {

        $("#newsbar").fadeOut(1000);
        $("#newsbar").promise().done(function () {
            $("#newsbar").html(rates[i]);
            $("#newsbar").fadeIn(1000).delay(5000);
            if (i < rates.length - 1)
                newsRotate(i + 1);
            else
                newsRotate(0);
        });

    }

});