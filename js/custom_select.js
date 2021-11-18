jQuery(function ($) {
    $(document).ready(function () {
       //customselect
        customSelectActive();
    });
});
function customSelectActive(){
    $('.customselect').each(function(){
        if(!$(this).hasClass('select-hidden')){
            if($(this).attr('multiple')){
                $(this).parent().addClass('customselect-wrapper');
                var $this = $(this),
                numberOfOptions = $(this).children('option').length;
                $this.addClass('select-hidden'); 
                $this.wrap('<div class="select"></div>');
                $this.after('<div class="select-styled"></div>');
                var $styledSelect = $this.next('div.select-styled');
                if($this.find('option:selected').length>0){
                    var SelectedOption = $this.find('option:selected');
                    console.log(SelectedOption);
                    SelectedOption.each(function (index, option) {
                        $styledSelect.append('<div class="selectvalue" data-value="' + $(option).text() + '">' + $(option).text() + '</div>');
                    });
                }
                else {
                    $styledSelect.html('<div class="default">Выберите ответ</div>');
                }
            
                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);
                for (var i = 0; i < numberOfOptions; i++) {
                    var lioption;
                    if($this.children('option').eq(i)[0].selected){
                        lioption = '<li rel="'+ $this.children('option').eq(i).val() + '"><div class="checked active"></div>'+ $this.children('option').eq(i).text() + '</li>';
                    }
                    else {
                        lioption = '<li rel="'+ $this.children('option').eq(i).val() + '"><div class="checked"></div>'+ $this.children('option').eq(i).text() + '</li>';
                    }
                    $(lioption).appendTo($list);
                }
            
                var $listItems = $list.children('li');
            
                $styledSelect.click(function(e) {
                    e.stopPropagation();
                    $('div.select-styled.active').not(this).each(function(){
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                });
            
                $listItems.click(function(e) {
                    e.stopPropagation();
                    if($(e.currentTarget).find('.checked').hasClass('active')) {
                        $(e.currentTarget).find('.checked').removeClass('active');
                        $styledSelect.find('.selectvalue[data-value="' + $(e.currentTarget).attr('rel') + '"]').remove();
                        if($styledSelect.find('.selectvalue').length == 0){
                            $styledSelect.html('<div class="default">Выберите ответ</div>');
                        }
                        $this.find('option[value="' + $(e.currentTarget).attr('rel') + '"]').prop("selected", false)
                    }
                    else {
                        $(e.currentTarget).find('.checked').addClass('active');
                        if($styledSelect.find('.default').length > 0){
                            $styledSelect.find('.default').remove();
                        }
                        $styledSelect.append('<div class="selectvalue" data-value="' + $(e.currentTarget).attr('rel') + '">' + $(e.currentTarget).attr('rel') + '</div>');
                        $this.find('option[value="' + $(e.currentTarget).attr('rel') + '"]').prop("selected", true)
                    }
                    $this.change();
                });
            
                $(document).click(function() {
                    $styledSelect.removeClass('active');
                    $list.hide();
                });
            }
            else {
                $(this).parent().addClass('customselect-wrapper');
                var $this = $(this),
                numberOfOptions = $(this).children('option').length;
                $this.addClass('select-hidden'); 
                $this.wrap('<div class="select"></div>');
                $this.after('<div class="select-styled"></div>');
                var $styledSelect = $this.next('div.select-styled');
                if($this.find('option:selected').length>0){
                    $styledSelect.text($this.find('option:selected').text());
                }
                else {
                    $styledSelect.text('Выберите ответ');
                }
            
                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);
            
                for (var i = 0; i < numberOfOptions; i++) {
                    if($this.children('option').eq(i).attr('disabled') !== 'disabled'){
                        let className = '';
                        if($this.children('option').eq(i).attr('selected')){
                            className = 'active';
                        }
                        $('<li />', {
                            text: $this.children('option').eq(i).text(),
                            rel: $this.children('option').eq(i).val(),
                            class: className
                        }).appendTo($list);
                    }
                }
            
                var $listItems = $list.children('li');
            
                $styledSelect.click(function(e) {
                    e.stopPropagation();
                    $('div.select-styled.active').not(this).each(function(){
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                });
            
                // $listItems.click(function(e) {
                $('body').on('click', '.customselect-wrapper li', function(e){
                    e.stopPropagation();
                    $styledSelect = $(this).parents('.customselect-wrapper').find('.select-styled');
                    $this =  $(this).parents('.customselect-wrapper').find('select');
                    $styledSelect.text($(this).text()).removeClass('active');
                    $this.val($(this).attr('rel'));
                    $(this).parents('ul').find('li').removeClass('active');
                    $(this).addClass('active');
                    $list.hide();
                    $this.change();
                });
            
                $(document).click(function() {
                    $styledSelect.removeClass('active');
                    $list.hide();
                });
            }
        }
    });   
}