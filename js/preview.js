jQuery(function ($) {
    $(document).ready(function () {
        //function for autoresize textarea
        $.fn.autoResize = function(){
            let r = e => {
                e.style.height = '';
                e.style.height = e.scrollHeight + 'px'
            };
            return this.each((i,e) => {
                e.style.overflow = 'hidden';
                r(e);
                $(e).bind('input', e => {
                    r(e.target);
                })
            })
        };
        //local settings for datepicker
        $.datepicker.setDefaults({
            closeText: 'Закрыть',
            prevText: '',
            currentText: 'Сегодня',
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
                'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
                'Июл','Авг','Сен','Окт','Ноя','Дек'],
            dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
            dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
            dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            weekHeader: 'Не',
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        });
        //auto height for textarea
        $('.pool-wrap textarea').autoResize();

        //in free list answers add new textarea
        $('.pool-wrap').on('input', '.question-listfree textarea', function(e){
            let question = $(this).parents('.question-wrap');
            let text = $(this).val();
            let index = $(this).parents('.answer-wrap').index() + 1;
            let length = $(this).parents('.free-answers').children().length;
            if(text && index === length) {
                let indexNext = length + 1;
                let questionId = question.attr('data-id');
                let newTextareaHtml = 
                `<div class="answer-wrap">
                    <textarea rows="1" name="q-${questionId}-${indexNext}" placeholder="Введите ваш комментарий"></textarea>
                </div>`;
                $(newTextareaHtml).appendTo($(this).parents('.free-answers'));
            }
        });

        // free list remove textarea if empty
        $('.pool-wrap').on('blur', '.question-listfree textarea', function(e){
            let question = $(this).parents('.question-wrap');
            let text = $(this).val();
            let index = $(this).parents('.answer-wrap').index() + 1;
            let length = $(this).parents('.free-answers').children().lenght;
            if(!text && index !== length) {
                $(this).parents('.answer-wrap').remove();
                refreshFreeList(question);
            }
        });
        //refresh ids on free list
        function refreshFreeList(questin){
            let list = questin.find('.free-answers').children();
            for (let i = 0; i < list.length; i++) {
                let id = i + 1;
                let inputs = $(list[i]).find('textarea');
                changeNameInput(inputs, id, 2);
            }
        }
        //change id in inputs name
        function changeNameInput(inputs, id, position){
            for (let i = 0; i < inputs.length; i++) {
                if($(inputs[i]).attr('name')){
                    prevId = $(inputs[i]).attr('name').split("-");
                    if(prevId[position]){
                        prevId[position] = id;
                        newId = prevId.join('-');
                        $(inputs[i]).attr('name', newId);
                    }
                }
                if($(inputs[i]).attr('id')){
                    prevId = $(inputs[i]).attr('id').split("-");
                    if(prevId[position]){
                        prevId[position] = id;
                        newId = prevId.join('-');
                        $(inputs[i]).attr('id', newId);
                    }
                }
                if($(inputs[i]).attr('for')){
                    prevId = $(inputs[i]).attr('for').split("-");
                    if(prevId[position]){
                        prevId[position] = id;
                        newId = prevId.join('-');
                        $(inputs[i]).attr('for', newId);
                    }
                }
            }
            return true;
        }
    });
});