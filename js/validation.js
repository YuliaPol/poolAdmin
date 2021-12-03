
jQuery(function ($) {
    $(document).ready(function () {
        jQuery.fn.scrollTo = function(elem, speed) { 
            $(this).animate({
                scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top  - 20
            }, speed == undefined ? 1000 : speed); 
            return this; 
        };
        $('.constr-wrap').on('submit', '.constructo-form', function(e){
            let els = $(this).find('[data-required]');
            let arrayElements = new Array();
            for (let i = 0; i < els.length; i++) {
                if($(els[i]).val() == null || $(els[i]).val() == ""){
                    arrayElements.push($(els[i]));
                    $(els[i]).addClass('has-error');
                    $(els[i]).focus(function(e){
                        $(this).removeClass('has-error');
                    });
                }
            }
            if(arrayElements.length > 0){
                e.preventDefault();
                let top = $(arrayElements[0]).offset().top;
                let topBox = $('.questions-box').offset().top;
                $('.questions-box').scrollTo($(arrayElements[0]), 1000); //custom animation speed 
            }
        });
    });
});