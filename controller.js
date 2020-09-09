$(document).ready(function () {
    // Get the current year for the copyright
    $('#year').text(new Date().getFullYear());


   //Smooth Scrolling
    $("#main-nav a").on('click', function (event) {
         if(this.hash !== ""){
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top -100
            }, 800, function () {
                window.location.hash = hash-100;
            });
        }
    });

    $('#downloadFile').click(function () {
        downloadCv();
    });

    function downloadCv(){
        var url = window.location.origin+'/filipskiba.github.io/CV.pdf';
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "blob";

        req.onload = function (event) {
            var blob = req.response;
            console.log(blob.size);
            var link=document.createElement('a');
            link.href=window.URL.createObjectURL(blob);
            link.download="Filip Skiba CV.pdf";
            link.click();
        };

        req.send();
    }
});