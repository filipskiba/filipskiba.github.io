$(document).ready(function () {
    var apiRoot = 'https://pacific-castle-21497.herokuapp.com/api/rates';
    var rates = [];
    getRates();

    function getRates() {
        $.ajax({
            url: apiRoot,
            method: 'GET',
            success: function (data) {
                rates = data;
                newsRotate(0);
            }
        });
    }

    function newsRotate(i) {

        $("#newsbar").fadeOut(1000);
        $("#newsbar").promise().done(function () {
            $("#newsbar").html(rates[i].currency + " " + rates[i].mid + "zł");
            $("#newsbar").fadeIn(1000).delay(5000);
            if (i < rates.length - 1)
                newsRotate(i + 1);
            else
                newsRotate(0);
        });

    }

});