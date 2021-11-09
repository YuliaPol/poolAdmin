
jQuery(function ($) {
    $(document).ready(function () {
        $('.page-wrap').on('mouseenter', '.pools-table .pool-menu-wrap', function(e){
            let heightMenu = parseInt($(this).find('.menu-wrap').outerHeight());
            let heightPanel = parseInt($('.top-panel').outerHeight());
            let scrollTop = parseInt($(window).scrollTop());
            let elTop = parseInt($(this).parents('.table-row').offset().top);
            let posTop = elTop + heightMenu - heightPanel - scrollTop + 150;
            if($( window ).height() < posTop){
                $(this).find('.hidden-menu').addClass('to-top');
            } else {
                $(this).find('.hidden-menu').removeClass('to-top');
            }
        });
    });
});