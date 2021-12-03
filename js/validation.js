
jQuery(function ($) {
    $(document).ready(function () {
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
                console.log($(arrayElements[0]));
                $('.questions-box').scrollTo($(arrayElements[0]));
            }
        });
    });
});