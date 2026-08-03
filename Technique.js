$(document).ready ( function() {

    $('.side_nav_a').click(function() {
        let name = $(this).text();
//        let coords_top = $('.content').find('#'+name.replaceAll(' ', '_')).offset().top;
//        let coords_left = $('.content').find('#'+name.replaceAll(' ', '_')).offset().left;
//        console.log(coords_top, coords_left)
//        window.scrollTo(coords_top, coords_left);
        let coords = $('.content').find('#'+name.replaceAll(' ', '_')).offset()
        console.log(coords)
        window.scrollTo(coords);

    });

});