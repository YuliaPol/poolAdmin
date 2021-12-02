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
        // Restricts input for the set of matched elements to the given inputFilter function.
        $.fn.inputFilter = function(inputFilter) {
            return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
            });
        };
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
        //dragable and sortable for ranging items
        function setSortbaleRanging(){
            $('.question-ranging .ranging-list').sortable({
                cancel: 'a,button, textarea, .empty-item',
                containment: '.ranging-list',
                cursor: 'grab',
            });
        }
        setSortbaleRanging();
        //settings for date question
        $('.date-input').datepicker({
            gotoCurrent: true,
            showOtherMonths: false,
            altFormat: "mm.dd.yyyy",
            dateFormat: "mm.dd.yyyy",
        });
        //settings for phone question
        $('.question-phone input.code').intlTelInput({
            initialCountry: "ru",
        });
        //only number for phone
        $('.phone').inputFilter(function(value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 99999999999);
        });
        //add icons and names of uploaded files 
        $('.pool-wrap').on('change', '.question-file input[type=file]', function(e){
            let files = this.files;
            let question = $(this).parents('.question-wrap');
            if(question.find('.uploaded-list').length === 0){
                let listHtml = `<div class="uploaded-list"></div>`
                $(listHtml).insertAfter($(this).parents('.file-answer'));
            }
            let filesWrap = question.find('.uploaded-list');
            let fileList = '';
            for (let i = 0; i < files.length; i++) {
                let fileName = files[i].name;
                let lastDot = fileName.lastIndexOf('.');
                let ext = fileName.substring(lastDot + 1);
                let iconClass = '';
                if(ext === 'doc' || ext === 'docx' || ext === 'dot' || ext === 'docm' || ext === 'dotx' || ext === 'dotm'){
                    iconClass = 'file-icon-word';
                } else if(ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'jpg'
                    || ext === 'jpeg' || ext === 'webp' || ext === 'svg'){
                        iconClass = 'file-icon-img';
                } else if(ext === 'avi' || ext === 'mp4' || ext === 'webm' || ext === '3gp' || ext === '3gpp'
                    || ext === 'flv' || ext === 'm4v' || ext === 'mkv' || ext === 'mov' || ext === 'mpeg'
                    || ext === 'mpeg4' || ext === 'ogg' || ext === 'ogv' || ext === 'wmv'){
                        iconClass = 'file-icon-video';
                } else if(ext === 'wav' || ext === 'mp3' || ext === 'm4a' || ext === 'wma' || ext === 'flac' || ext === 'aiff'){
                    iconClass = 'file-icon-audio';
                } else if(ext === 'xlsx' || ext === 'xlsm' || ext === 'xltx' || ext === 'xls' || ext === 'xml'){
                    iconClass = 'file-icon-exel';
                } else if(ext === 'pdf'){
                    iconClass = 'file-icon-pdf';
                } else if(ext === 'pptx' || ext === 'pptm' || ext === 'pptm' || ext === 'ppt'){
                    iconClass = 'file-icon-pp';
                }
                let itemHtml = 
                    `<div class="file-item">
                        <div class="file-icon ${iconClass}"></div>
                        <div class="file-name">
                            ${fileName}
                        </div>
                    </div>`;
                fileList += itemHtml;
            }
            filesWrap.html(fileList);
        });
        //input diapason value
        $('.content-wrap').on('input', '.question-diapason .input-range', function(e){
            setDiapasonValue(this);
        });
        //set new diapsson value
        function setDiapasonValue(input){
            var value = $(input).val();
            var max = $(input).attr('max');
            var min = $(input).attr('min');
            var range = max - min;
            var relvalue = value - min;
            var percent = (100/range)*relvalue;
            var parents = $(input).parents('.diapason');
            var paddleft = (30*percent)/100;
            parents.find('.label').css('left', 'calc(' + percent + '% - ' + paddleft + 'px)');
            parents.find('.label .value').html(value);
            parents.find('.input-box .bar-filled').css('width', percent + '%');
            parents.find('.label').css('background-position', percent + '%');
        };
    });
});