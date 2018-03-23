$(".scroll1").on('click', function(event) {
    var divPosition = $('.page2').offset();
    $('html, body').animate({
        scrollTop: divPosition.top
    }, 1000);
});