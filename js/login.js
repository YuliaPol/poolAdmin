jQuery(function ($) {
    $(document).ready(function () {
        
        let loginForm = $('.send-form').find('form');
        loginForm.submit(function (e) {
           return validForm();
        });
        if($('.interests-content').length === 0){
            $('form').on('change, input', 'input', function(e){
                if(validForm()){
                    $(this).parents('form').find('.btn-submit').addClass('active');
                }
            });
        }
        if($('.interests-content').length === 0){
            if(validForm()){
                $('form').find('.btn-submit').addClass('active');
            }
        }
        $('.interests-content').on('change', '.interest-item input', function(e){
            $(this).parents('form').find('.btn-submit').addClass('active');
        });
        if($('.text-popUp').length > 0){
            setTimeout(function(){ $('.text-popUp').fadeOut(300); }, 3000);
        }
        function validForm(){
            var erroreArrayElemnts = [];
            var el = loginForm.find('[data-reqired]');
            for (let i = 0; i < el.length; i++) {
                if(el[i].type === 'checkbox'){
                    if(el[i].checked == false){
                        erroreArrayElemnts.push(el[i]);
                    }
                } else {
                    if (el[i].value === '' || el[i].value === ' ' || el[i].value === '-') {
                        erroreArrayElemnts.push(el[i]);
                    }
                }
            }
            if(erroreArrayElemnts.length > 0){
                return false;
            }
            else {
                return true;
            }
        }
        // preloader
        $('.load-wrapper').fadeOut();
    });
});