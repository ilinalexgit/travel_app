$( document ).ready(function() {
    var posFromTop = 85;
    $(window).on("scroll", function(e) {
        if ($(window).scrollTop() > posFromTop/*85*/) {
            console.log('add');
            //$('.table_header').addClass("fixed_header");
        } else {
            console.log('remove');
            //$('.table_header').removeClass("fixed_header");
        }

    });
});
