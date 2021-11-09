jQuery(function ($) {
    $(document).ready(function () {
        //activation filter
        $('.content-wrap').on('change', '.filter-item select', function(e){
            $(this).parents('.filter-item').addClass('picked');
        });
        //chnage mode view
        $('.content-wrap').on('click', '.mode-view', function(e){
            if($(this).hasClass('mode-full') && !$(this).hasClass('active')){
                $('.listbox').removeClass('icons-mode');
                $('.mode-view.mode-icons').removeClass('active');
                $(this).addClass('active');
            } else if($(this).hasClass('mode-icons') && !$(this).hasClass('active')) {
                $('.listbox').addClass('icons-mode');
                $('.mode-view.mode-full').removeClass('active');
                $(this).addClass('active');
            }
        });
    });
});