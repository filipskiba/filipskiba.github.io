$(document).ready(function () {
    // Get the current year for the copyright
    $('#year').text(new Date().getFullYear());

    $('body').scrollspy({ target: '#main-nav', offset: 100 });

   //Smooth Scrolling and affix 100
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
});