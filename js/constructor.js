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
        $('.questions-box textarea').autoResize();
        //activation filter
        $('.content-wrap').on('change', '.filter-item select', function(e){
            $(this).parents('.filter-item').addClass('picked');
        });
        //change mode view
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

        //set height for question-box
        setHeightBox();
        function setHeightBox(){
            let box = $('.questions-box');
            let viewHeight = window.innerHeight;
            let panelHeight = $('.top-panel').outerHeight(true);
            let wrapPad =  40;
            let navHeight = $('.top-nav').outerHeight(true);
            let filterHeiht = $('.filter-wrap').outerHeight(true);
            let boxHeight = parseInt(viewHeight - panelHeight - wrapPad - navHeight - filterHeiht);
            box.height(boxHeight + 'px');
        }
        $( window ).resize(function() {
            $('.questions-box textarea').autoResize();
            setHeightBox();
        });
        //actions with question
        //sortable questions
        if($( window ).width() > 700) {
            $('.questions-box .questions-list').sortable({
                cancel: "input, a, button, textarea, .edit-block",
                containment: "parent",
                distance: 5,
                items: ".question-wrap",
                deactivate: function (event, ui) {
                    refreshQuestionsId();
                }
            });
        }
        //drag question
        $('.listbox .list-item' ).draggable({
            helper: 'clone',
            cursor: 'move',
            connectToSortable: '.questions-box',
            containment: '.constr-wrap',
        });

        //dropped question
        $('.questions-box').droppable({
            drop: function(event, ui) {
                if($(ui.draggable).hasClass('list-item')){
                    var eventTop = event.pageY;
                    var offsetY = event.offsetY;
                    var children = $('.questions-box').find('.questions-list').children();
                    var appendInde = getAppendIndex(children, eventTop, offsetY);
                    var type = $(ui.draggable).attr('data-type');
                    let id = 1;
                    if( appendInde === 'last' ){
                        id = children.length + 1;
                    }
                    else {
                        id = appendInde + 1 
                    }
                    if(type && id){
                        addQuestion(type, appendInde, id);
                    }
                }
            }
        });

        //get index of dropable question
        function getAppendIndex(arr, top, offsetY) {
            if( arr.length === 0 ) {
                return 'last';
            }
            else {
                for( var i = 0; i < arr.length; i++ ) {
                    var elTop = $(arr[i]).offset().top,
                        elBottom = $(arr[i]).offset().top + $(arr[i]).outerHeight(true),
                        height = $(arr[i]).outerHeight(true);
                    console.log();
                    if( top > elTop + height/2 && top < elBottom + offsetY ) {
                        return i;
                    }
                    else if(top > elTop && top < elBottom) {
                        return ( i - 1 );
                    }
                }
                return  arr.length - 1;
            }
        }

        //add question by click
        $('.constr-wrap').on('click', '.listbox .list-item', function(e){
            let type = $(this).attr('data-type');
            let appendInde = "last";
            let id = $('.questions-box').find('.questions-list').children().length + 1;
            addQuestion(type, appendInde, id);
        });

        //add question to list
        function addQuestion(type, appendInde, id){
            let children = $('.questions-box').find('.questions-list').children();
            let attchFiles = 
                `<div class="attach-file">
                    <div class="attach-file-icon"></div>
                    <div class="attach-files-wrap">
                        <div class="files-list">
                            <div class="file-item file-video">
                                <input type="file" accept="video/mp4,video/x-m4v,video/*" name="uploadvideo_${id}"
                                    id="uploadvideo_${id}">
                                <label for="uploadvideo_${id}"></label>
                            </div>
                            <div class="file-item file-img">
                                <input type="file" accept="image/png, image/gif, image/jpeg" name="uploadimage_${id}"
                                    id="uploadimage_${id}">
                                <label for="uploadimage_${id}"></label>
                            </div>
                            <div class="file-item file-audio">
                                <input type="file" accept=".mp3,audio/*" name="uploadaudio_${id}" id="uploadaudio_${id}">
                                <label for="uploadaudio_${id}"></label>
                            </div>
                        </div>
                    </div>
                </div>`;
            let nameHtml = 
                `<div class="question-name">
                    <textarea name="question_${id}"  rows="1" placeholder="Введите ваш вопрос"></textarea>
                </div>`;
            let topEL = 
                `<div class="edit-block">
                    ${attchFiles}
                    <div class="remove-question"></div>
                </div>
                ${nameHtml}`;
            let el;
            switch(type) {
                case "single":
                    el = 
                        `<div class="question-wrap question-single" data-id="${id}">
                            ${topEL}
                            <div class="radio-btns-wrapper">
                                <div class="radio-item">
                                    <div class="remove-item"></div>
                                    <textarea name="inputpoint_${id}_1" rows="1" placeholder="Вариант ответа"></textarea>
                                </div>
                                <div class="radio-item">
                                    <div class="remove-item"></div>
                                    <textarea name="inputpoint_${id}_2" rows="1" placeholder="Вариант ответа"></textarea>
                                </div>
                            </div>
                            <div class="input-new-item-wrap">
                                <input type="text" class="input-single-item" placeholder="Введите вариант ответа">
                                <div class="add-new-item"></div>
                            </div>
                            <div class="check-wrap">
                                <input type="checkbox" id="addOpt_${id}" class="show-single-opt">
                                <label for="addOpt_${id}">
                                    <div class="check"></div>
                                    <div class="check-text">
                                        Добавить вариант ответа «Другое» или поле комментария
                                    </div>
                                </label>
                                <div class="hidden add-single-options">
                                    <div class="btns-wrap">
                                        <div class="btn-wrap">
                                            <input type="checkbox" class="add-other" id="addOther_${id}">
                                            <label for="addOther_${id}">Вариант ответа</label>
                                        </div>
                                        <div class="btn-wrap">
                                            <input type="checkbox" class="add-comment" id="addComment_${id}">
                                            <label for="addComment_${id}">Поле комментария</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="check-wrap">
                                <input type="checkbox" class="add-neither" name="addNeither_${id}" id="addNeither_${id}">
                                <label for="addNeither_${id}">
                                    <div class="check"></div>
                                    <div class="check-text">
                                        Добавить вариант ответа «Ничего из вышеперечисленного»
                                    </div>
                                </label>
                            </div>
                        </div>`
                    break;
                default: 
                    el =
                        `<div class="question-wrap question-single" data-id="${id}">
                            ${topEL}
                        </div>`
            }
            if( appendInde === 'last' ){
                $('.questions-box').find('.questions-list').append(el);
            }
            else if ( appendInde < 0 ) {
                $('.questions-box').find('.questions-list').prepend(el);
            }
            else {
                $(children[appendInde]).after( el );
            }
            $('.questions-box').find('.questions-list').removeClass('empty');
            $('.questions-box textarea').autoResize();
            refreshQuestionsId();
        }

        
        // question in focus
        $('.constr-wrap').on('click', '.question-wrap', function(e){
            if(!$(e.target).hasClass('remove-question')){
                if(!$(this).hasClass('focus')){
                    $('.constr-wrap .question-wrap').removeClass('focus');
                    $(this).addClass('focus');
                }
            }
        });

        //remove question
        $('.constr-wrap').on('click', '.question-wrap .remove-question', function(e){
            let question = $(this).parents('.question-wrap');
            removeQuestion(question);
            refreshQuestionsId();
        });
        function removeQuestion(question){
            $(question).remove();
            if($('.questions-list').children().length === 0){
                $('.questions-list').addClass('empty');
            } else {
                refreshQuestionsId();
            }
        }

        //settings for single question

        //single input point in focus
        $('.content-wrap').on('focus', '.question-single .radio-item textarea', function(e){
            $(this).parents('.radio-item').addClass('focus');
        });

        //single input point out of focus
        $('.content-wrap').on('blur', '.question-single .radio-item textarea', function(e){
            $(this).parents('.radio-item').removeClass('focus');
        });

        //input new single item
        $('.content-wrap').on('input', '.question-single .input-single-item', function(e){
            let btn_send = $(this).parents('.input-new-item-wrap').find('.add-new-item');
            if($(this).val()){
                $(btn_send).addClass('visible');
            } else {
                $(btn_send).removeClass('visible');
            }
        });

        //add new single item
        $('.content-wrap').on('click', '.question-single .add-new-item', function(e){
            let text = $(this).parents('.input-new-item-wrap').find('.input-single-item').val();
            clear_form_elements($(this).parents('.input-new-item-wrap'));
            $(this).removeClass('visible');
            let thisQuestion = $(this).parents('.question-wrap');
            let itemsList = thisQuestion.find('.radio-btns-wrapper');
            let questionId = thisQuestion.attr('data-id');
            let pointId = itemsList.children().length + 1;
            if(questionId && pointId && text && itemsList){
                addSingleOption(questionId, pointId, text, itemsList);
            }
        });

        function addSingleOption(questionId, pointId, text, itemsList, addClas = ' '){
            let itemsName = "inputpoint_" + questionId + "_" + pointId;
            let itemHtml = 
            '<div class="radio-item ' + addClas +'">'
            +'    <div class="remove-item"></div>'
            +'    <textarea name="'+ itemsName + '" rows="1" placeholder="Вариант ответа">'+ text +'</textarea>'
            +'</div>';
            $(itemsList).append(itemHtml);
            $(itemsList).find('textarea').autoResize();
        }

        // remove single item
        $('.content-wrap').on('click', '.question-single .radio-item .remove-item', function(e){
            let itemEl = $(this).parents('.radio-item');
            removeSingleOption(itemEl);
        });

        function removeSingleOption(itemEl){
            let itemQuestion = itemEl.parents('.question-wrap');
            let itemsList = itemEl.parents('.radio-btns-wrapper');
            if($(itemEl).hasClass('neither')){
                itemQuestion.find('.add-neither').prop('checked', false);;
            }
            if($(itemEl).hasClass('other')){
                itemQuestion.find('.add-other').prop('checked', false);;
            }
            $(itemEl).remove();
            refreshSingleOptionsId(itemsList);
        }

        //refresh id for single options
        function refreshSingleOptionsId(itemsList){
            let options = itemsList.children();
            for (let i = 0; i < options.length; i++) {
                let id = i + 1;
                let textareas = $(options[i]).find('textarea');
                changeNameInput(textareas, id, 2);
            }
        }

        //show single options add other or comment
        $('.content-wrap').on('change', '.question-single .show-single-opt', function(e){
            if($(this).is(':checked')){
                $(this).parents('.check-wrap').find('.add-single-options').fadeIn(300);
            } else {
                $(this).parents('.check-wrap').find('.add-single-options').fadeOut(300);
                clear_form_elements($(this).parents('.check-wrap').find('.add-single-options'));
            }
        });

        //add single option other
        $('.content-wrap').on('change', '.question-single .add-other', function(e){
            let thisQuestion = $(this).parents('.question-wrap');
            let itemsList = thisQuestion.find('.radio-btns-wrapper');
            let questionId = thisQuestion.attr('data-id');
            let pointId = itemsList.children().length + 1;
            let text = 'Другое';
            if($(this).is(':checked')){
                addSingleOption(questionId, pointId, text, itemsList, 'other');
            } else {
                let removeEl = itemsList.find('.other');
                removeSingleOption(removeEl);
            }
        });
        //add single option comment
        $('.content-wrap').on('change', '.question-single .add-comment', function(e){
            let thisQuestion = $(this).parents('.question-wrap');
            if($(this).is(':checked')){
                let commnetHtml = 
                '<div class="single-comment">'
                +'    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>'
                +'</div>';
                $(commnetHtml).insertBefore(thisQuestion.find('.input-new-item-wrap'));
            } else {
                thisQuestion.find('.single-comment').remove();
            }
        });
        //add single option neither
        $('.content-wrap').on('change', '.question-single .add-neither', function(e){
            let thisQuestion = $(this).parents('.question-wrap');
            let itemsList = thisQuestion.find('.radio-btns-wrapper');
            let questionId = thisQuestion.attr('data-id');
            let pointId = itemsList.children().length + 1;
            let text = 'Ничего из вышеперечисленного';
            if($(this).is(':checked')){
                addSingleOption(questionId, pointId, text, itemsList, 'neither');
            } else {
                let removeEl = itemsList.find('.neither');
                removeSingleOption(removeEl);
            }
        });
        //function for clear inputs in block
        function clear_form_elements(block) {
            jQuery(block).find(':input').each(function() {
              switch(this.type) {
                    case 'password':
                    case 'text':
                    case 'textarea':
                    case 'file':
                    case 'select-one':
                    case 'select-multiple':
                    case 'date':
                    case 'number':
                    case 'tel':
                    case 'email':
                        jQuery(this).val('');
                        break;
                    case 'checkbox':
                    case 'radio':
                        this.checked = false;
                        break;
                }
                $(this).change();
            });
        }

        //refresh questions id
        function refreshQuestionsId(){
            let questions = $('.questions-box').find('.questions-list').children();
            if(questions.length > 0){
                for (let i = 0; i < questions.length; i++) {
                    let id = i + 1;
                    $(questions[i]).attr('data-id', id);
                    let textareas = $(questions[i]).find('textarea');
                    changeNameInput(textareas, id, 1);
                    let inputs = $(questions[i]).find('input');
                    changeNameInput(inputs, id, 1);
                    let labels = $(questions[i]).find('label');
                    changeNameInput(labels, id, 1);
                }
            }
        }

        //change id in inputs name
        function changeNameInput(inputs, id, position){
            for (let i = 0; i < inputs.length; i++) {
                if($(inputs[i]).attr('name')){
                    prevId = $(inputs[i]).attr('name').split("_");
                    prevId[position] = id;
                    newId = prevId.join('_');
                    $(inputs[i]).attr('name', newId);
                }
                if($(inputs[i]).attr('id')){
                    prevId = $(inputs[i]).attr('id').split("_");
                    prevId[position] = id;
                    newId = prevId.join('_');
                    $(inputs[i]).attr('id', newId);
                }
                if($(inputs[i]).attr('for')){
                    prevId = $(inputs[i]).attr('for').split("_");
                    prevId[position] = id;
                    newId = prevId.join('_');
                    $(inputs[i]).attr('for', newId);
                }
            }
        }
    });
});