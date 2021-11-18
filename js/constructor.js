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
                    else if ( appendInde < 0 ) {
                        id = 1;
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
                case 'single':
                    el = 
                        `<div class="question-wrap question-single" data-id="${id}">
                            ${topEL}
                            <div class="radio-btns-wrapper">
                            </div>
                            <div class="input-new-item-wrap">
                                <input type="text" class="input-single-item" placeholder="Введите вариант ответа">
                            </div>
                            <div class="check-wrap">
                                <input type="checkbox" id="addOpt_${id}" class="show-answers-opt">
                                <label for="addOpt_${id}">
                                    <div class="check"></div>
                                    <div class="check-text">
                                        Добавить вариант ответа «Другое» или поле комментария
                                    </div>
                                </label>
                                <div class="hidden add-answers-options">
                                    <div class="btns-wrap">
                                        <div class="btn-wrap">
                                            <input type="checkbox" class="add-other" id="addOther_${id}"  name="addOther_${id}">
                                            <label for="addOther_${id}">Вариант ответа</label>
                                        </div>
                                        <div class="btn-wrap">
                                            <input type="checkbox" class="add-comment" id="addComment_${id}"  name="addComment_${id}">
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
                case 'free-answer':
                    el = 
                        `<div class="question-wrap question-free" data-id="${id}">
                            ${topEL}
                            <div class="free-answers">
                                <div class="answer-wrap">
                                    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                                </div>
                            </div>
                        </div>`
                    break;
                case 'listfree':
                    el = 
                        `<div class="question-wrap question-free" data-id="${id}">
                            ${topEL}
                            <div class="free-answers">
                                <div class="answer-wrap">
                                    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                                </div>
                                <div class="answer-wrap">
                                    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                                </div>
                                <div class="answer-wrap">
                                    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                                </div>
                            </div>
                        </div>`
                    break;
                case 'scale':
                    el = 
                        `<div class="question-wrap question-scale" data-id="${id}">
                            ${topEL}
                            <div class="scale-wrap scale-star scale-10">

                                <input type="radio" id="scale_${id}_10" name="scale_${id}" value="10" />
                                <label for="scale_${id}_10" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_9" name="scale_${id}" value="9" />
                                <label for="scale_${id}_9" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_8" name="scale_${id}" value="8" />
                                <label for="scale_${id}_8" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_7" name="scale_${id}" value="7" />
                                <label for="scale_${id}_7" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_6" name="scale_${id}" value="6" />
                                <label for="scale_${id}_6" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_5" name="scale_${id}" value="5" />
                                <label for="scale_${id}_5" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_4" name="scale_${id}" value="4" />
                                <label for="scale_${id}_4" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_3" name="scale_${id}" value="3" />
                                <label for="scale_${id}_3" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_2" name="scale_${id}" value="2" />
                                <label for="scale_${id}_2" title="text"></label>
                        
                                <input type="radio" id="scale_${id}_1" name="scale_${id}" value="1" />
                                <label for="scale_${id}_1" title="text"></label>
                            </div>
                            <div class="scale-options">
                                <div class="scale-row">
                                    <div class="options-item">
                                        <div class="option-label">
                                            Шкала
                                        </div>
                                        <div class="option-value">
                                            <select name="scaleAmount_${id}" class="customselect scale-amount">
                                                <option value="3">3</option>
                                                <option value="5">5</option>
                                                <option selected value="10">10</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="options-item">
                                        <div class="option-label">
                                            Фигура
                                        </div>
                                        <div class="option-value">
                                            <select name="scaleType_${id}" class="customselect scale-type">
                                                <option selected value="star">Звездочки</option>
                                                <option value="face">Смайлики</option>
                                                <option value="heart">Сердечки</option>
                                                <option value="hand">Руки</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="check-wrap">
                                    <input type="checkbox" class="add-rateLabels" name="rateLabels_${id}" id="rateLabels_${id}">
                                    <label for="rateLabels_${id}">
                                        <div class="check"></div>
                                        <div class="check-text">
                                            Метки рейтинга
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>`
                    break;
                case 'dropdown':
                    el = 
                        `<div class="question-wrap question-dropdown" data-id="${id}">
                            ${topEL}
                            <div class="dropdown-wrap">
                                <select class="customselect">
                                    <option value=""></option>
                                </select>
                            </div>
                            <div class="optins-list">
                                <div class="option-item">
                                    <div class="number">1.</div>
                                    <div class="value">
                                        <input type="text" name="inputpoint_${id}_1" value="">
                                    </div>
                                </div>
                            </div>
                            <div class="check-wrap">
                                <input type="checkbox" id="addOpt_${id}" class="show-answers-opt">
                                <label for="addOpt_${id}">
                                    <div class="check"></div>
                                    <div class="check-text">
                                        Добавить вариант ответа «Другое» или поле комментария
                                    </div>
                                </label>
                                <div class="add-answers-options hidden"> 
                                    <div class="btns-wrap">
                                        <div class="btn-wrap">
                                            <input type="checkbox" class="add-other" id="addOther_${id}" name="addOther_${id}">
                                            <label for="addOther_${id}">Вариант ответа</label>
                                        </div>
                                        <div class="btn-wrap">
                                            <input type="checkbox" class="add-comment" id="addComment_${id}" name="addComment_${id}">
                                            <label for="addComment_${id}">Поле комментария</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    break;
                case 'multiple':
                    el = 
                        `<div class="question-wrap question-multiple" data-id="${id}">
                            ${topEL}
                            <div class="radio-btns-wrapper">
                                <div class="input-item">
                                    <div class="input-new-item-wrap">
                                        <input type="text" class="input-multiple-item" placeholder="Введите вариант ответа">
                                    </div>
                                </div>
                            </div>
                            <div class="check-wrap">
                                <input type="checkbox" id="addOpt_${id}" class="show-answers-opt">
                                <label for="addOpt_${id}">
                                    <div class="check"></div>
                                    <div class="check-text">
                                        Добавить вариант ответа «Другое» или поле комментария
                                    </div>
                                </label>
                                <div class="add-answers-options hidden">
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
                            <div class="select-wrap">
                                <div class="select-input">
                                    <select name="requiredOpt_${id}" class="customselect">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>
                                <div class="select-label">
                                    Колличество необходимых выбраных ответов
                                </div>
                            </div>
                        </div>`
                    break;
                default: 
                    el =
                        `<div class="question-wrap question-single" data-id="${id}">
                            ${topEL}
                        </div>`
            }
            let scrollTo = 0;
            if( appendInde === 'last' ){
                $('.questions-box').find('.questions-list').append(el);
                scrollTo = $('.questions-box').find('.questions-list .question-wrap:last-child').offset().top;
            }
            else if ( appendInde < 0 ) {
                $('.questions-box').find('.questions-list').prepend(el);
            }
            else {
                $(children[appendInde]).after( el );
                scrollTo = $(children[appendInde]).offset().top;
            }
            $('.questions-box').removeClass('empty');
            $('.questions-box textarea').autoResize();    
            //scroll to element 
            let container = $('.questions-list');
            container.scrollTop(
                scrollTo - container.offset().top + container.scrollTop()
            );
            customSelectActive();
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
        });
        function removeQuestion(question){
            $(question).remove();
            if($('.questions-list').children('.question-wrap').length === 0){
                $('.questions-box').addClass('empty');
            } else {
                refreshQuestionsId();
            }
        }

        //events for files

        //upload img
        $('.constr-wrap').on('change', '.file-img input[type=file]', function(e){
            let input = this;
            let question = $(this).parents('.question-wrap');
            if (input.files && input.files[0]) {
                let fileWrap = question.find('.added-file-wrap');
                if(fileWrap.length === 0) {
                    let wrapHtml = '<div class="added-file-wrap"></div>';
                    $(wrapHtml).insertAfter(question.find('.question-name'));
                    fileWrap =  question.find('.added-file-wrap');
                } else {
                    fileWrap.html('');
                }
                let imgHtml = 
                    `<div class="img-wrap">
                        <img src="" alt="Img">
                        <div class="img-remove"></div>
                    </div>`;
                $(imgHtml).appendTo(fileWrap);
                let img = question.find('.added-file-wrap img');
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.attr('src', e.target.result);
                    setFileActive(input);
                };
                reader.readAsDataURL(input.files[0]);
            }
        });
        //upload audio
        $('.constr-wrap').on('change', '.file-audio input[type=file]', function(e){
            let question = $(this).parents('.question-wrap');
            let fileWrap = question.find('.added-file-wrap');
            let input = this;
            let inputFile = e.target;
            if (inputFile.files && inputFile.files[0]) {
                if(fileWrap.length === 0) {
                    let wrapHtml = '<div class="added-file-wrap"></div>';
                    $(wrapHtml).insertAfter(question.find('.question-name'));
                    fileWrap =  question.find('.added-file-wrap');
                } else {
                    fileWrap.html('');
                }
                let audioHtml = 
                    `<div class="audio-wrap">
                        <div class="audio-control"></div>
                        <div class="audiowave" data-audiopath=""></div>
                        <div class="audio-duration"></div>
                        <div class="audio-remove"></div>
                    </div>`;
                $(audioHtml).appendTo(fileWrap);
    
                let audio = question.find('.added-file-wrap .audiowave');
                audio.stop();
                var reader = new FileReader();
                reader.onload = function (e) {
                    audio.attr('data-audiopath', e.target.result);
                    setAudioWave(audio[0], e.target.result);
                    setFileActive(input);
                };
                reader.readAsDataURL(inputFile.files[0]);
            }
        });
        //upload video
        $('.constr-wrap').on('change', '.file-video input[type=file]', function(e){
            let question = $(this).parents('.question-wrap');
            let input = this;
            if(this.files && this.files[0]){
                fileWrap =  question.find('.added-file-wrap');
                if(fileWrap.length === 0) {
                    let wrapHtml = '<div class="added-file-wrap"></div>';
                    $(wrapHtml).insertAfter(question.find('.question-name'));
                    fileWrap =  question.find('.added-file-wrap');
                } else {
                    fileWrap.html('');
                }
                let videoHtml = 
                    `<div class="video-wrap">
                        <video-radio-star>
                            <video>
                                <source src="./files-for-test/video.mp4">
                                Your browser does not support HTML5 video.
                            </video>
                            <button type="button" class="video-play" data-play></button>
                        </video-radio-star>
                        <div class="video-remove"></div>
                    </div>`;
                $(videoHtml).appendTo(fileWrap);
                let source = fileWrap.find('source');
                source[0].src = URL.createObjectURL(this.files[0]);
                setFileActive(input);
            }
        });

        $('.constr-wrap').on('click', '.video-wrap video', function(e){
            e.preventDefault();
            let videoWrap = $(this).parent();
            let video = videoWrap.find('video').get(0);
            if(video.paused){
                $(video).prop('controls', true);
                video.play();
            } else {
                video.pause();
                $(video).prop('controls', false);
            }
        });

        //set active type of file
        function setFileActive(input){
            let question = $(input).parents('.question-wrap');
            if($(input).parents('.file-video').length === 0) {
                clear_form_elements(question.find('.file-video'));
                question.find('.file-video label').removeClass('active');
            }
            if($(input).parents('.file-audio').length === 0) {
                clear_form_elements(question.find('.file-audio'));
                question.find('.file-audio label').removeClass('active');
            }
            if($(input).parents('.file-img').length === 0) {
                clear_form_elements(question.find('.file-img'));
                question.find('.file-img label').removeClass('active');
            }
            $(input).parents('.file-item').find('label').addClass('active');
            $(input).parents('.attach-file').find('.attach-file-icon').addClass('active');
        }
        //remove img
        $('.constr-wrap').on('click', '.question-wrap .img-remove', function(e){
            removeFile(this);
        });
        //remove audio
        $('.constr-wrap').on('click', '.question-wrap .audio-remove', function(e){
            removeFile(this);
        });
        //remove video
        $('.constr-wrap').on('click', '.question-wrap .video-remove', function(e){
            removeFile(this);
        });

        //remove file
        function removeFile(el){
            let question = $(el).parents('.question-wrap');
            let fileWrap = question.find('.added-file-wrap');
            fileWrap.remove();
            clear_form_elements(question.find('.attach-files-wrap'));
            question.find('.attach-files-wrap label').removeClass('active')
            $(question).find('.attach-file-icon').removeClass('active');
        }
        //end events for files

        //settings for single question

        //single input point in focus
        $('.content-wrap').on('focus', '.question-single .radio-item textarea', function(e){
            $(this).parents('.radio-item').addClass('focus');
        });

        //single input point out of focus
        $('.content-wrap').on('blur', '.question-single .radio-item textarea', function(e){
            $(this).parents('.radio-item').removeClass('focus');
        });

        //add new single item
        $('.content-wrap').on('change', '.question-single .input-single-item', function(e){
            let text = $(this).val();
            if(text){
                let thisQuestion = $(this).parents('.question-wrap');
                let itemsList = thisQuestion.find('.radio-btns-wrapper');
                let questionId = thisQuestion.attr('data-id');
                let pointId = itemsList.children().length + 1;
                if(questionId && pointId && text && itemsList){
                    addSingleOption(questionId, pointId, text, itemsList);
                }
                clear_form_elements($(this).parents('.input-new-item-wrap'));
            }
        });
        //click out of input single option
        $(document).click(function(event) { 
            var $target = $(event.target);
            if(!$target.hasClass('input-single-item')){
                $('.input-single-item').change();
            }
        });
        //click enter
        $(document).on('keypress',function(e) {
            if(e.which == 13) {
                e.preventDefault();
                if($(e.target).hasClass('input-single-item')){
                    $(e.target).change();
                }
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
        $('.content-wrap').on('change', '.question-wrap .show-answers-opt', function(e){
            if($(this).is(':checked')){
                $(this).parents('.check-wrap').find('.add-answers-options').fadeIn(300);
            } else {
                $(this).parents('.check-wrap').find('.add-answers-options').fadeOut(300);
                clear_form_elements($(this).parents('.check-wrap').find('.add-answers-options'));
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
                '<div class="option-comment">'
                +'    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>'
                +'</div>';
                $(commnetHtml).insertBefore(thisQuestion.find('.input-new-item-wrap'));
            } else {
                thisQuestion.find('.option-comment').remove();
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

        //end settings for single question

        //settings for scale question

        //change type of scale
        $('.content-wrap').on('change', '.question-scale .scale-type', function(e){
            let question = $(this).parents('.question-wrap');
            setClassForScale(question);
        });

        //change amount of ratings
        $('.content-wrap').on('change', '.question-scale .scale-amount', function(e){
            let amount = $(this).val();
            let question = $(this).parents('.question-wrap');
            let scaleWrap = question.find('.scale-wrap');
            let questionId = question.attr('data-id');
            addScaleRate(scaleWrap, amount, questionId);
            setClassForScale(question);
            changeAmountLabel(question);
        });

        //add class to scale-wrap
        function setClassForScale(question){
            let type = question.find('.scale-type').val();
            let amount = question.find('.scale-amount').val();
            let scaleWrap = question.find('.scale-wrap');
            let labelWrap = question.find('.scale-labels-wrap');
            let classList = 'scale-wrap ' + 'scale-' + amount;
            let classListLabel = 'scale-labels-wrap ' + 'scale-' + amount;
            switch(type){
                case 'star':
                    classList += ' scale-star'
                    break;
                case 'face':
                    classList += ' scale-face'
                    break;
                case 'heart':
                    classList += ' scale-heart'
                    break;
                case 'hand':
                    classList += ' scale-hands'
                    break;
            }
            scaleWrap.attr('class', classList);
            labelWrap.attr('class', classListLabel);
        }

        //add scale list
        function addScaleRate(scaleWrap, amount, questionId) {
            let scaleHtml = '';
            for (let i = 1; i <= amount; i++) {
                scaleHtml +=
                `<input type="radio" id="scale_${questionId}_${i}" name="scale_${questionId}" value="${i}" />
                 <label for="scale_${questionId}_${i}" title="text"></label>`;
            }
            scaleWrap.html(scaleHtml);
        }
        //chnage amount of labels under rate
        function changeAmountLabel(question){
            let amount = parseInt(question.find('.scale-amount').val());
            let questionId = question.attr('data-id');
            let labelOptionsWrap = question.find('.labels-option');
            let labelsOption = labelOptionsWrap.children();
            let labelScaleWrap = question.find('.scale-labels-wrap');
            let labelsScale = labelScaleWrap.children();
            if(amount > labelsOption.length){
                for (let i = labelsOption.length+1; i < amount+1; i++) {
                    if(!labelsOption[i]) {
                        let labelHtml = 
                        `<div class="label-item">
                            <div class="number">${i}</div>
                            <div class="value">
                                <input type="text" name="inputpoint_${questionId}_${i}">
                            </div>
                        </div>`;
                        labelOptionsWrap.append(labelHtml);
                        let labelScaleHtml = `<div class="label-item"></div>`;
                        labelScaleWrap.append(labelScaleHtml);
                    }
                }
            } else {
                for (let i = amount; i < labelsOption.length ; i++) {
                    labelsOption[i].remove();
                    labelsScale[i].remove();
                }
            }
        }
        
        //add\remove labels under rate
        $('.content-wrap').on('change', '.question-scale .add-rateLabels', function(e){
            let question = $(this).parents('.question-wrap');
            if($(this).is(':checked')){
                let labelsScale = `<div class="scale-labels-wrap"></div>`;
                let labelsOption = `<div class="labels-option"></div>`;
                $(labelsScale).insertAfter(question.find('.scale-wrap'));
                $(labelsOption).insertAfter($(this).parents('.check-wrap'));
                changeAmountLabel(question);
                setClassForScale(question);
            } else {
                question.find('.scale-labels-wrap').remove();
                question.find('.labels-option').remove();
            }
        });
        //input scale label
        $('.content-wrap').on('input', '.question-scale .label-item input[type=text]', function(e){
            let question = $(this).parents('.question-wrap');
            let labelsWrap = question.find('.scale-labels-wrap');
            let questionId = question.attr('data-id');
            let text = $(this).val();
            let optionId = $(this).parents('.label-item').index() + 1;
            labelsWrap.find(`.label-item:nth-child(${optionId})`).html(text);
        });

        //end settings for scale question

        //settings for dropdown question

        //input option for dropdown
        $('.content-wrap').on('input', '.question-dropdown .option-item input[type=text]', function(e){
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let optionId = parseInt($(this).parents('.option-item').index()) + 1;
            if(newText && question && optionId){
                setNewText(question, newText, optionId);
            }
            if(newText && optionId===question.find('.optins-list').children().length){
                addNewOption(question);
            }
        });
        $('.content-wrap').on('change', '.question-dropdown .option-item input[type=text]', function(e){
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let optionId = parseInt($(this).parents('.option-item').index()) + 1;
            let newOptionId = parseInt($(this).parents('.option-item').index()) + 1;
            if(!newText && optionId !== $(this).parents('.optins-list').children().length){
                removeDropdownOption(question, newOptionId);
            }
        });
        //click out of input option select
        $(document).click(function(event) { 
            var $target = $(event.target);
            if($target.parents('option-item').length === 0){
                $('.option-item input').change();
            }
        })
        //set new text for option select
        function setNewText(question, text, index){
            let select = question.find('.dropdown-wrap select');
            let customSelect = question.find('.customselect-wrapper');
            if(select.find(`option:nth-child(${index})`).length === 0){
                let selectHtml = `<option value=""></option>`;
                $(selectHtml).insertAfter(select.find(`option:nth-child(${index - 1})`));
    
                let customSelectHtml = `<li rel=""></li>`;
                $(customSelectHtml).insertAfter(customSelect.find('.select-options').find(`li:nth-child(${index - 1})`));
            }

            select.find(`option:nth-child(${index})`).html(text);
            select.find(`option:nth-child(${index})`).prop('value', text);
            
            customSelect.find(`li:nth-child(${index})`).html(text);
            customSelect.find(`li:nth-child(${index})`).prop('rel', text);

            if(customSelect.find(`li:nth-child(${index})`).hasClass('active') || 
                (index === 1 && customSelect.find('li.active').length === 0)){
                customSelect.find('.select-styled').html(text);
            }
        }

        //add new option to select
        function addNewOption(question){
            let optionList = question.find('.optins-list');
            let questionId = question.attr('data-id');
            let optionId = parseInt(optionList.children().length) + 1;
            let select = question.find('.dropdown-wrap select');
            let customSelect = question.find('.customselect-wrapper');

            let optionHtml = 
                `<div class="option-item">
                    <div class="number">${optionId}.</div>
                    <div class="value">
                        <input type="text" name="inputpoint_${questionId}_${optionId}">
                    </div>
                </div>`;
            optionList.append(optionHtml);

            let selectHtml = `<option value=""></option>`;
            $(selectHtml).insertAfter(select.find(`option:nth-child(${optionId - 1})`));

            let customSelectHtml = `<li rel=""></li>`;
            $(customSelectHtml).insertAfter(customSelect.find('.select-options').find(`li:nth-child(${optionId - 1})`));
        }

        //remove option from select
        function removeDropdownOption(question, optionId){
            let optionList = question.find('.optins-list');
            let select = question.find('.dropdown-wrap select');
            let customSelect = question.find('.customselect-wrapper');
            if(select.find(`option:nth-child(${optionId})`).length != 0){
                select.find(`option:nth-child(${optionId})`).remove();
            }
            if(customSelect.find(`li:nth-child(${optionId})`).length != 0){
                customSelect.find(`li:nth-child(${optionId})`).remove();
            }
            if(optionList.find(`.option-item:nth-child(${optionId})`).length != 0){
                optionList.find(`.option-item:nth-child(${optionId})`).remove();
            }
            refreshDropdownInputs(question.find('.optins-list'));
        }

        //add other option to select
        $('.content-wrap').on('change', '.question-dropdown .add-other', function(e){
            let question = $(this).parents('.question-wrap');
            let index = parseInt(question.find('.select-options').children().length);
            let indexNew = index + 1;
            let text = 'Другое';
            if($(this).is(':checked')){
                setNewText(question, text, indexNew)
            } else {
                removeDropdownOption(question, index);
            }
        });

        //add to dropdown  comment
        $('.content-wrap').on('change', '.question-dropdown .add-comment', function(e){
            let question = $(this).parents('.question-wrap');
            if($(this).is(':checked')){
                let commentHtml = 
                    `<div class="option-comment">
                        <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                    </div>`
                $(commentHtml).insertAfter(question.find('.dropdown-wrap'));
            } else {
                question.find('.option-comment').remove();
            }
        });
        //refresh ids for input
        function refreshDropdownInputs(optionList){
            let options = optionList.children();
            for (let i = 0; i < options.length; i++) {
                let id = i + 1;
                $(options[i]).find('.number').html(`${id}.`);
                let inputs = $(options[i]).find('input');
                changeNameInput(inputs, id, 2);
            }
        }
        //end settings for dropdown question

        //settings for multiple question

        //multiple input point in focus
        $('.content-wrap').on('focus', '.question-multiple .radio-item textarea', function(e){
            $(this).parents('.radio-item').addClass('focus');
        });

        //multiple input point out of focus
        $('.content-wrap').on('blur', '.question-multiple .radio-item textarea', function(e){
            $(this).parents('.radio-item').removeClass('focus');
        });

        //add new multiple item
        $('.content-wrap').on('change', '.question-multiple .input-multiple-item', function(e){
            let text = $(this).val();
            if(text){
                let question = $(this).parents('.question-wrap');
                if(text && question){
                    addMultipleOption(question, text);
                }
                clear_form_elements($(this).parents('.input-new-item-wrap'));
            }
        });
        function addMultipleOption(question, text, addClas = ' '){
            let itemsList = question.find('.radio-btns-wrapper');
            let questionId = question.attr('data-id');
            let pointId = parseInt(itemsList.find('.radio-item').length) + 1;
            let itemsName = "inputpoint_" + questionId + "_" + pointId;
            let itemHtml = 
            '<div class="radio-item ' + addClas +'">'
            +'    <div class="remove-item"></div>'
            +'    <textarea name="'+ itemsName + '" rows="1" placeholder="Вариант ответа">'+ text +'</textarea>'
            +'</div>';
            $(itemHtml).insertBefore(question.find('.input-item'));
            $(itemsList).find('textarea').autoResize();
        }

        //click enter
        $(document).on('keypress',function(e) {
            if(e.which == 13) {
                e.preventDefault();
                if($(e.target).hasClass('input-multiple-item')){
                    $(e.target).change();
                }
            }
        });

        // click out of input multiple option
        $(document).click(function(event) { 
            var $target = $(event.target);
            if(!$target.hasClass('input-multiple-item')){
                $('.input-multiple-item').change();
            }
        });

        // remove multiple item
        $('.content-wrap').on('click', '.question-multiple .radio-item .remove-item', function(e){
            let itemEl = $(this).parents('.radio-item');
            removeMultipleOption(itemEl);
        });

        function removeMultipleOption(itemEl){
            let itemQuestion = itemEl.parents('.question-wrap');
            let itemsList = itemEl.parents('.radio-btns-wrapper');
            if($(itemEl).hasClass('neither')){
                itemQuestion.find('.add-neither').prop('checked', false);;
            }
            if($(itemEl).hasClass('other')){
                itemQuestion.find('.add-other').prop('checked', false);;
            }
            $(itemEl).remove();
            refreshMultipleOptionsId(itemsList);
        }

        //refresh id for multiple options
        function refreshMultipleOptionsId(itemsList){
            let options = itemsList.find('.radio-item');
            for (let i = 0; i < options.length; i++) {
                let id = i + 1;
                let textareas = $(options[i]).find('textarea');
                changeNameInput(textareas, id, 2);
            }
        }
        //add multiple option other
        $('.content-wrap').on('change', '.question-multiple .add-other', function(e){
            let question = $(this).parents('.question-wrap');
            let itemsList = question.find('.radio-btns-wrapper');
            let text = 'Другое';
            if($(this).is(':checked')){
                addMultipleOption(question, text, 'other');
            } else {
                let removeEl = itemsList.find('.other');
                removeMultipleOption(removeEl);
            }
        });
        //add multiple option comment
        $('.content-wrap').on('change', '.question-multiple .add-comment', function(e){
            let question = $(this).parents('.question-wrap');
            if($(this).is(':checked')){
                let commnetHtml = 
                '<div class="option-comment">'
                +'    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>'
                +'</div>';
                $(commnetHtml).insertAfter(question.find('.radio-btns-wrapper'));
            } else {
                question.find('.option-comment').remove();
            }
        });
        //add multiple option neither
        $('.content-wrap').on('change', '.question-multiple .add-neither', function(e){
            let question = $(this).parents('.question-wrap');
            let itemsList = question.find('.radio-btns-wrapper');
            let text = 'Ничего из вышеперечисленного';
            if($(this).is(':checked')){
                addMultipleOption(question, text, 'neither');
            } else {
                let removeEl = itemsList.find('.neither');
                removeSingleOption(removeEl);
            }
        });
        //end settings for multiple question

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
            let questions = $('.questions-box').find('.questions-list').children('.question-wrap');
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

        //make audiowave
        $('.audiowave').each(function(){
            var path = $(this).attr('data-audiopath');//path for audio
            setAudioWave(this, path);
        });

        // wavesurfer for audio elements
        function setAudioWave(el, path){
            //Initialize WaveSurfer
            var wavesurfer = WaveSurfer.create({
                container: el,
                scrollParent: false,
                backgroundColor: '#FFFFFF',
                height: 40,
                barMinHeight: 1,
                barWidth: 1.5,
                cursorWidth: 0,
                barGap: 1.5,
                waveColor: '#E5E5E5',
                hideScrollbar: true,
                progressColor: "#000000"
            });

            //Load audio file
            wavesurfer.load(path);

            // Show video duration
            wavesurfer.on('ready', function () {
                $(el).parents('.audio-wrap').find('.audio-duration').html(formatTime(wavesurfer.getDuration()));
            });

            wavesurfer.on('pause', function () {
                $(el).parents('.audio-wrap').find('.audio-control').removeClass('pause');
            });

            wavesurfer.on('play', function () {
                $(el).parents('.audio-wrap').find('.audio-control').addClass('pause');
            });
            //Add button event
            $(el).parents('.audio-wrap').find('.audio-control').click(function(){
                wavesurfer.playPause();
            });
        }

        //seconds to time
        function formatTime (time) {
            return [
                Math.floor((time % 3600) / 60), // minutes
                ('00' + Math.floor(time % 60)).slice(-2) // seconds
            ].join(':');
        };
    });
});