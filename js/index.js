"use strict";
class PRESTimeline {
    constructor(target, color) {
        // this.__process_stylesheet(document.styleSheets[0]);
        this.base = target;
        this.color = color;
        // console.log(this.color)
        this.periodContainer = $(this.base).find('.periods-container');
        this.cardContainer = $(this.base).find('.cards-container');
        this.timelineNodeContainer = $(this.base).find('.timeline-container .timeline');
        // this.activePeriod = $(this.base).find('.periods-container section.active')
        this._parseData();
        this._initialColor();
        this._generateTimeline();
        this._setStateClasses();
        this._assignBtn();
        this._adjustPeriodContainer();
        this._adjustCardContainer();
        // console.log(this.cardData)
    }
    _parseData() {
        let base = this.base;
        let periods = $(base).find('.periods-container section');
        for (let section of periods) {
            section.period = $(section).attr('period');
            section.index = $(section).index();
        }
        // console.log(periods)
        this.periodData = periods;
        let data = $(base).find('.cards-container section');
        // console.log(data)
        for (let section of data) {
            section.period = $(section).attr('period');
            section.index = $(section).index();
        }
        // console.log(data)
        this.cardData = data;
        // #assign initial entry point (active items)
        this.activePeriod = this.periodData[0];
        this.activePeriodIndex = 0;
        this.activeCard = this.cardData[0];
        this.activeCardIndex = 0;
    }
    _setStateClasses() {
        // # periods
        $(this.base).find('.periods-container section.active').removeClass('active');
        $(this.base).find('.periods-container section.prev').removeClass('prev');
        $(this.base).find('.periods-container section.next').removeClass('next');
        // console.log("setclass: " + this.activePeriod.index)
        $(this.activePeriod).addClass('active');
        // console.log(this.activePeriod.index)
        // this.activePeriodIndex = this.activePeriod.index
        if ($(this.activePeriod).prev().length != 0) {
            $(this.activePeriod).prev().addClass('prev');
            $(this.base).find('.periods-container .btn-back').removeClass('hide');
        }
        else {
            $(this.base).find('.periods-container .btn-back').addClass('hide');
        }
        if ($(this.activePeriod).next().length != 0) {
            $(this.activePeriod).next().addClass('next');
            $(this.base).find('.periods-container .btn-next').removeClass('hide');
        }
        else {
            $(this.base).find('.periods-container .btn-next').addClass('hide');
        }
        // ## cards
        $(this.base).find('.cards-container section.active').removeClass('active');
        $(this.base).find('.cards-container section.prev').removeClass('prev');
        $(this.base).find('.cards-container section.next').removeClass('next');
        $(this.activeCard).addClass('active');
        // this.activeCardIndex - this.activeCard.index
        if ($(this.activeCard).prev().length != 0) {
            $(this.activeCard).prev().addClass('prev');
        }
        if ($(this.activeCard).next().length != 0) {
            $(this.activeCard).next().addClass('next');
        }
        // ## timeline 
        $(this.base).find('.timeline li.active').removeClass('active');
        // let findNode = $(this.base).find('.timeline ol li')[this.activeCard.index]
        $(this.timelineData[this.activeCard.index]).addClass('active');
        let timelineB = $(this.base).find('.timeline-container .btn-back');
        let timelineN = $(this.base).find('.timeline-container .btn-next');
        // console.log($(timelineN))
        if (this.activeCardIndex === 0) {
            timelineB.addClass('hide');
        }
        else {
            timelineB.removeClass('hide');
        }
        if (this.activeCardIndex >= this.cardData.length - 1) {
            timelineN.addClass('hide');
        }
        else {
            timelineN.removeClass('hide');
        }
    }
    // ## timeline generater
    _generateTimeline() {
        // ## create node list
        let htmlWrap = '<ol></ol>';
        $(this.timelineNodeContainer).append(htmlWrap);
        let wrap = $(this.timelineNodeContainer).find('ol');
        let numNode = this.cardData.length;
        for (let i = 0; i < numNode; i++) {
            let c = this.cardData[i].color;
            let el = wrap.append('<li class="' + this.cardData[i].period + '" style="border-color: ' + c + '"></li>');
        }
        // ## width of timeline
        let nodeW = 200;
        wrap.css('width', nodeW * numNode - 16);
        let nodeList = $(this.base).find('.timeline ol li');
        this.timelineData = nodeList;
    }
    // ## assign button actions
    _assignBtn() {
        let periodPrev = $(this.base).find('.periods-container .btn-back');
        let periodNext = $(this.base).find('.periods-container .btn-next');
        periodPrev.click(() => {
            if (this.activePeriodIndex > 0) {
                // console.log('prev')
                this.activePeriodIndex -= 1;
                this.activePeriod = this.periodData[this.activePeriodIndex];
                this._chainActions('period');
                this._setStateClasses();
            }
            this._adjustPeriodContainer();
        });
        periodNext.click(() => {
            if (this.activePeriodIndex < this.periodData.length - 1) {
                // console.log('next' + this.activePeriodIndex)
                this.activePeriodIndex += 1;
                this.activePeriod = this.periodData[this.activePeriodIndex];
                this._chainActions('period');
                this._setStateClasses();
            }
            this._adjustPeriodContainer();
        });
        let timelinePrev = $(this.base).find('.timeline-container .btn-back');
        let timelineNext = $(this.base).find('.timeline-container .btn-next');
        timelinePrev.click(() => {
            if (this.activeCardIndex > 0) {
                this.activeCardIndex -= 1;
                this.activeCard = this.cardData[this.activeCardIndex];
                this._chainActions('timeline');
                this._setStateClasses();
            }
            this._adjustCardContainer();
            this._adjustPeriodContainer();
        });
        timelineNext.click(() => {
            if (this.activeCardIndex < this.cardData.length - 1) {
                this.activeCardIndex += 1;
                this.activeCard = this.cardData[this.activeCardIndex];
                this._chainActions('timeline');
                this._setStateClasses();
            }
            this._adjustCardContainer();
            this._adjustPeriodContainer();
        });
        // ## assign each timeline li
        for (let i = 0; i < this.timelineData.length; i++) {
            $(this.timelineData[i]).click(() => {
                this.activeCardIndex = this.cardData[i].index;
                this.activeCard = this.cardData[this.activeCardIndex];
                this._chainActions('timeline');
                this._setStateClasses();
                this._adjustCardContainer();
                this._shiftTimeline();
            });
        }
    }
    // ## color ##
    _initialColor() {
        for (let i = 0; i < this.periodData.length; i++) {
            let p = this.periodData[i].period;
            this.periodData[i].color = this.color[p];
            let temp = this.periodData[i];
            $(temp).css('border-color', temp.color);
            $(temp).find('.year').css('color', temp.color);
            // ## color for timeline items, this part utilize the period name as class which will be add to the li later
            // ### cross browser bug fix
            let sbstyle = document.createElement("style");
            document.head.appendChild(sbstyle);
            // let sheet = document.styleSheets[0]
            sbstyle.sheet.insertRule('li.' + p + '.active { background-color: ' + this.color[p] + ' !important } ', 0);
            sbstyle.sheet.insertRule('li.' + p + '::before { background-color: ' + this.color[p] + ' } ', 0);
            sbstyle.sheet.insertRule('li.' + p + '::after { background-color: ' + this.color[p] + ' } ', 0);
        }
        for (let i = 0; i < this.cardData.length; i++) {
            let p = this.cardData[i].period;
            this.cardData[i].color = this.color[p];
            let temp = this.cardData[i];
            $(temp).css('border-color', temp.color);
            $(temp).find('.year').css('color', temp.color);
        }
    }
    _adjustPeriodContainer() {
        let activeH = $(this.activePeriod).outerHeight();
        $(this.periodContainer).height(activeH);
        console.log('top adjusted');
    }
    _adjustCardContainer() {
        let activeH = $(this.activeCard).outerHeight() + 24;
        $(this.cardContainer).height(activeH);
        console.log('bot adjusted');
    }
    _shiftTimeline() {
        // #### We need to fix this part if using this component in different sizes ####
        let timelineW = $(this.base).find('.timeline-container').outerWidth();
        let timelinePadding = 210;
        let timelineCenter = 300;
        let liWidth = 16;
        let activeNodeX = $(this.timelineData[this.activeCardIndex]).position().left;
        let finalPos = -activeNodeX + timelinePadding;
        $(this.timelineNodeContainer).css('left', finalPos);
        console.log(activeNodeX);
    }
    _chainActions(state) {
        switch (state) {
            case 'period':
                console.log('period');
                if (this.activePeriod.period != this.activeCard.period) {
                    // ## find the closest li with the active period
                    let ta = [];
                    for (let i = 0; i < this.cardData.length; i++) {
                        let temp = this.cardData[i];
                        if (this.activePeriod.period === temp.period)
                            ta.push(temp);
                    }
                    this.activeCard = ta[0];
                    this.activeCardIndex = ta[0].index;
                }
                break;
            case 'timeline':
                console.log('timeline');
                if (this.activeCard.period != this.activePeriod.period) {
                    let ta;
                    for (let i = 0; i < this.periodData.length; i++) {
                        let temp = this.periodData[i];
                        if (this.activeCard.period === temp.period)
                            ta = temp;
                    }
                    this.activePeriod = ta;
                    this.activePeriodIndex = ta.index;
                }
                break;
        }
        this._shiftTimeline();
        this._adjustCardContainer();
    }
}
// ## document load ##
$(document).ready(function () {
    let colorcode = {
        'period1': '#fec541',
        'period2': '#36d484',
        'period3': '#32ccf4'
    };
    let timeline = new PRESTimeline($('#this-timeline'), colorcode);
    tt()
});

function tt(){
	function $(param){
		if(arguments[1] == true){
			return document.querySelectorAll(param);
		}else{
			return document.querySelector(param);
		}
	}
	var $box = $(".box");
	var $box1 = $(".box-1 ul li",true);
	var $box2 = $(".box-2 ul");
	var $box3 = $(".box-3");
	var $length = $box1.length;
	
	var str = "";
	for(var i =0;i<$length;i++){
		if(i==0){
			str +="<li class='on'>"+(i+1)+"</li>";
		}else{
			str += "<li>"+(i+1)+"</li>";
		}
	}
	$box2.innerHTML = str;
	
	var current = 0;
	
	var timer;
	timer = setInterval(go,1500);
	function go(){
		for(var j =0;j<$length;j++){
			$box1[j].style.display = "none";
			$box2.children[j].className = "";
		}
		if($length == current){
			current = 0;
		}
		$box1[current].style.display = "block";
		$box2.children[current].className = "on";
		current++;
	}
	
	for(var k=0;k<$length;k++){
		$box1[k].onmouseover = function(){
			clearInterval(timer);
		}
		$box1[k].onmouseout = function(){
			timer = setInterval(go,1000);
		}
	}
	for(var p=0;p<$box3.children.length;p++){
		$box3.children[p].onmouseover = function(){
			clearInterval(timer);
		};
		$box3.children[p].onmouseout = function(){
			timer = setInterval(go,1000);
		}
	}
	
	for(var u =0;u<$length;u++){
		$box2.children[u].index  = u;
		$box2.children[u].onmouseover = function(){
			clearInterval(timer);
			for(var j=0;j<$length;j++){
				$box1[j].style.display = "none";
				$box2.children[j].className = "";
			}
			this.className = "on";
			$box1[this.index].style.display = "block";
			current = this.index +1;
		}
		$box2.children[u].onmouseout = function(){
			timer = setInterval(go,1000);
		}
	}
	
	$box3.children[0].onclick = function(){
		back();
	}
	$box3.children[1].onclick = function(){
		go();
	}
	function back(){
		for(var j =0;j<$length;j++){
			$box1[j].style.display = "none";
			$box2.children[j].className = "";
		}
		if(current == 0){
			current = $length;
		}
		$box1[current-1].style.display = "block";
		$box2.children[current-1].className = "on";
		current--;
	}
}
