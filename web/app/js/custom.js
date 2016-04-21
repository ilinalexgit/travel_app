$( document ).ready(function() {
    var posFromTop = 85;
    $(window).on("scroll", function(e) {
        if ($(window).scrollTop() > posFromTop/*85*/) {
            //$('.table_header').addClass("fixed_header");
        } else {
            //$('.table_header').removeClass("fixed_header");
        }

    });
});
