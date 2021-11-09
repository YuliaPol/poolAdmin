
jQuery(function ($) {
    $(document).ready(function () {
        $('.create-pool-wrap').on('change', '.add-banner', function(e){
            let imgContainer = $(this).parents('.form-group').find('.img-container');
            if (e.target.files && e.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    imgContainer.css('background-image', 'url('+e.target.result+')');
                    imgContainer.addClass('active');
                    imgContainer.css('background-position', 'center');
                    imgContainer.css('background-repeat', 'no-repeat');
                    imgContainer.css('background-size', 'contain');
                }
                reader.readAsDataURL(e.target.files[0]);
            }
            $(this).parents('.input-file').find('label').addClass('active');
        });

        $('.create-pool-wrap').on('change', '.add-pool-files', function(e){
            if (e.target.files && e.target.files[0]) {
                let fileHtml = 
                '<div class="file-item">'
                +'    <div class="btn-delete">'
                +'    </div>'
                +'    <div class="file-icon"></div>'
                +'</div>';
                $(this).parents('.form-group').find('.files-container').html(fileHtml);
            }
            $(this).parents('.input-file').find('label').addClass('active');
        });
        $('.create-pool-wrap').on('click', '.files-container .btn-delete', function(e){
            let formGroup = $(this).parents('.form-group');
            $(this).parents('.file-item').remove();
            let inputName = $(this).parents('.form-group').find('input[type=file]').attr('name');
            let accpetFiles = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
            formGroup.find('.add-pool-files').remove();
            let newInput = '<input type="file" name="' + inputName + '" class="add-pool-files" accept="' + accpetFiles + '">'
            formGroup.find('label').append(newInput);
            formGroup.find('label').removeClass('active');
        });

        //validation
        var formValid = document.getElementsByClassName('form-valid')[0];
        $('.send-form').click(function () {
            $(this).parents('form').submit(function (e) {
                e.preventDefault();
                var el = document.querySelectorAll('.form-valid [data-reqired]');
                var erroreArrayElemnts = [];
                for (var i = 0; i < el.length; i++) {
                    if (el[i].value === '' || el[i].value === ' ' || el[i].value === '-') {
                        erroreArrayElemnts.push(el[i]);
                        if($(el[i]).parents('.form-group').length > 0){
                            $(el[i]).parents('.form-group').addClass('has-error');
                            $(el[i]).focus(function(e){
                                $(this).parents('.form-group').removeClass('has-error');
                            });
                        }
                    }
                }
                if (erroreArrayElemnts.length == 0) {
                    formValid.submit();
                }
                if (erroreArrayElemnts.length > 0) {
                    console.log('Valid error');
                    console.log(erroreArrayElemnts);
                    var scroolTO = parseInt($(erroreArrayElemnts[0]).parents('.form-group').offset().top) - 240;
                    $("html, body").animate({ scrollTop: scroolTO }, 600);
                }
            });
        });
        
    });
});