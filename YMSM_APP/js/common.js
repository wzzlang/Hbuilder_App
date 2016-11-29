var rootPath ="http://IP:8080/ymsm_mms/services/";
var returnData = [];
var post_ajax=function(requestURL,para, callBackFunc, errCallBackFunc, isShowWaiting) {
	if (typeof(isShowWaiting) == "undefined" || isShowWaiting) {
		plus.nativeUI.showWaiting("请稍等...");
	}
	mui.ajax(rootPath+requestURL, {
			data:para,
			traditional: true,
			type:'post',
			timeout:30000,	
			success : function(response){
				if (response) {
					if (typeof(response.dataExistFlg) == "undefined" || response.dataExistFlg == "1") {
						if (typeof(callBackFunc) != "undefined") {
							callBackFunc(response);
						}
					} else {
						mui.alert("您查询的数据不存在...");
					}
				}
				plus.nativeUI.closeWaiting();
			},
			error:function(XMLHttpRequest,type){
				if(XMLHttpRequest.readyState=='0'){
					mui.alert("当前网络不给力，请稍后再试...");
				} else if(XMLHttpRequest.status=='500'){
					mui.alert("系统出错请联系管理员")
				} else if(XMLHttpRequest.status=='408'){
					mui.alert("网络超时");
				}
				if (typeof(errCallBackFunc) != "undefined") {
					errCallBackFunc();
				} 
				plus.nativeUI.closeWaiting();
			}
		});
};

var get_ajax=function getAjax(requestURL,para, callBackFunc, errCallBackFunc) {
	mui.ajax(rootPath+requestURL, {
			data:para,
			traditional: true,
			type:'get',
			timeout:30000,	
			success : function(response){
				if (typeof(response)!='number') {
						if (response.dataExistFlg == "1") {
							callBackFunc(response);
						} else {
						mui.alert("您查询的数据不存在...");
						}
					}else{
						callBackFunc(response)
					}
			},
			error:function(XMLHttpRequest,type){
				if(XMLHttpRequest.readyState=='0'){
					mui.alert("当前网络不给力，请稍后再试...");
				} else if(XMLHttpRequest.status=='500'){
					mui.alert("系统出错请联系管理员")
				} else if(XMLHttpRequest.status=='408'){
					mui.alert("网络超时");
				}
				if (typeof(errCallBackFunc) != "undefined") {
					errCallBackFunc();
				} 
			}
		});
};

//Open Window
var openWindow = function(url, para){
	setTimeout(function(){
		mui.openWindow({
		url	   : url,
		preload: false,
		extras : para,
		id	   : url
		})
	}, 1000);
}

//点击radiobutton改变背景色并且可触发相应画面控制
var radioButtonClick = function(propertyName, callBackFunc) {
	var radioObjArr = document.getElementsByName(propertyName);
	for (var i=0; i<radioObjArr.length; i++) {
		radioObjArr[i].addEventListener('tap', function(event) {
			for (var j = 0; j < radioObjArr.length; j++) {
				radioObjArr[j].value = "0";
			}
			this.value = "1";
			if (typeof(callBackFunc) != undefined && callBackFunc != null) callBackFunc();
		}, false);
	}
}
//默认设置radiobutton第一个为选中项并且可触发相应画面控制
var setRadioButtonDefaultValue = function(propertyName, callBackFunc) {
	var radioObjArr = document.getElementsByName(propertyName);
	var firstFlg = false;
	for (var i=0; i<radioObjArr.length; i++) {
		if (firstFlg == false && radioObjArr[i].style.display != "none") {
			radioObjArr[i].value = "1"
			radioObjArr[i].classList.add("mui-active")
			firstFlg = true;
		} else {
			radioObjArr[i].value = "0"
			radioObjArr[i].classList.remove("mui-active")
		}
		if (typeof(callBackFunc) != undefined && callBackFunc != null) callBackFunc();
	}
}
var datePickEvent = function() {
	var btns = mui('.input');
	btns.each(function(i, btn) {
		btn.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id 	 = this.getAttribute('id');
			var name = this.getAttribute('name');
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				document.getElementById(id).innerText = rs.value;
				
				//设置确定后的字体颜色
				rs.valueDb == '' ? document.getElementById(id).classList.remove("common-font")
					  			 : document.getElementById(id).classList.add("common-font");
				/**
				 * 设置日期DB格式
				 */
				var dateObjArr     = document.getElementsByName(name);
				var dateValueObj   = dateObjArr[dateObjArr.length-1];
				dateValueObj.value = rs.valueDb;
				return;
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				picker.dispose();
			});
		}, false);
	})
}
var dateValidation = function(value){
	var strinvali = /^(\d{4})-(\d{2})-(\d{2})$/;
	if(strinvali.test(value)) {
		alert("请输入正确日期格式");
		return false;
	}
	else return true;
}

//系统格式日期转为yyyy-MM-dd格式的日期
var getFormatDate = function (sysFormatDate)
{
   var year = 0;
   var month = 0;
   var day = 0;
   var formatDate = "";
   //初始化日期
   year       = sysFormatDate.getFullYear();//ie火狐下都可以
   month      = sysFormatDate.getMonth()+1;
   day        = sysFormatDate.getDate();
   formatDate += year + "-";
   if (month >= 10 ){

    formatDate += month + "-";
   }else{

    formatDate += "0" + month + "-";
   }
   if (day >= 10 ){

    formatDate += day ;
   }else{

    formatDate += "0" + day ;
   }

   return formatDate;
}

//系统格式日期转为yyyy-MM格式的日期
var getFormatMonth = function (sysFormatDate)
{
   var year = 0;
   var month = 0;
   var formatMonth = "";
   //初始化日期
   year       = sysFormatDate.getFullYear();//ie火狐下都可以
   month      = sysFormatDate.getMonth()+1;
   formatMonth += year + "-";
   if (month >= 10 ){

    formatMonth += month;
   }else{

    formatMonth += "0" + month;
   }

   return formatMonth;
}

/**
 * 时间转格式
 * yyyy-MM-dd格式转为yyyyMMdd
 * yyyy-MM格式转为yyyyMM
 */
function getDbDateFormat(formatDate) {
	
	return formatDate.replace(/-/g,"");
}

/**
 * 单值必入力验证
 */
var mustInputCheck = function(data, label) {
	if (data != "") return true;
	showErrorMsg(label+'不能为空');
	return false;
}
/**
 * 多值必入力验证
 */
var arrMustInputCheck = function(dataArr, label) {
	for (var i=0; i<dataArr.length; i++) {
		if (dataArr[i] != "") return true;
	}
	
	showErrorMsg(label+'不能为空');
	return false;
}
/**
 * fromDate<=toDate的验证
 */
var dateCompareLeCheck = function(fromDate, toDate, fromLabel, toLabel) {
	if (fromDate=="" || toDate == "") return true;
	if (fromDate <= toDate) return true; 
	showErrorMsg(fromLabel+"不得晚于"+toLabel+",请重新输入");
	return false;
}
/**
 * @param fromFormatDate：yyyy-MM-dd格式的日期
 * @param toFormatDate  ：yyyy-MM-dd格式的日期
 * @param intevalDays	：加(+)减(-)天数
 */
var daysIntevalCheck = function(fromFormatDate, toFormatDate, intevalDays, label) {
	var daysAddedDate = this.addDays(fromFormatDate, intevalDays);
	var toDate	  	   = new Date(toFormatDate);
	if (daysAddedDate < toDate) {
		showErrorMsg(label+"不得超过"+intevalMonths+"天"+",请重新输入");
		return false;
	}
	return true;
}
/**
 * @param fromFormatDate：yyyy-MM-dd格式的日期
 * @param toFormatDate  ：yyyy-MM-dd格式的日期
 * @param intevalMonths ：加(+)减(-)月数
 */
var monthsIntevalCheck = function(fromFormatDate, toFormatDate, intevalMonths, label) {
	var monthsAddedDate = this.addMonths(fromFormatDate, intevalMonths);
	var toDate	  	    = new Date(toFormatDate);
	if (monthsAddedDate < toDate) {
		showErrorMsg(label+"不得超过"+intevalMonths+"个月"+",请重新输入");
		return false;
	}
	return true;
}
/**
 * @param fromFormatDate：yyyy-MM-dd格式的日期
 * @param toFormatDate  ：yyyy-MM-dd格式的日期
 * @param intevalYears  ：加(+)减(-)年数
 */
var yearsIntevalCheck = function(fromFormatDate, toFormatDate, intevalYears, label) {
	var yearsAddedDate = this.addYears(fromFormatDate, intevalYears);
	var toDate	  	   = new Date(toFormatDate);
	if (yearsAddedDate < toDate) {
		showErrorMsg(label+"不得超过"+intevalYears+"年"+",请重新输入");
		return false;
	}
	return true;
}
/**
 * 日期加减
 * @param formatDate：yyyy-MM-dd格式的日期
 * @param addDays   ：加(+)减(-)天数
 * Return Date with Format
 */
var addDays = function(formatDate, addDays) {
	var dateObj = new Date(formatDate);
	dateObj.setDate(dateObj.getDate() + addDays);
	return eval(dateObj);
}
/**
 * 月份加减
 * @param formatDate：yyyy-MM-dd格式的日期
 * @param addMonths ：加(+)减(-)月数
 * Return Date with Format
 */
var addMonths = function(formatDate, addMonths) {
	var dateObj = new Date(formatDate);
	dateObj.setMonth(dateObj.getMonth() + addMonths);
	return eval(dateObj);
}
/**
 * 年份加减
 * @param formatDate：yyyy-MM-dd格式的日期
 * @param addYears ：加(+)减(-)年数
 * Return Date with Format
 */
var addYears = function(formatDate, addYears) {
	var dateObj = new Date(formatDate);
	dateObj.setFullYear(dateObj.getFullYear() + addYears);
	return eval(dateObj);
}

var showErrorMsg = function(msgContent) {
	mui.toast(msgContent);
}

var showMsg = function(msgContent) {
	mui.toast(msgContent);
}

//获取验证码倒计时
var wait=60;  
function countdown(obj) {
    if (wait == 0) {  
        obj.removeAttribute("disabled");            
        obj.value="获取验证码";  
        wait = 60;  
    } else {  
        obj.setAttribute("disabled", true);  
        obj.value="重新发送(" + wait + ")";  
        wait--;  
        setTimeout(function() {  
            countdown(obj)  
        },  
        1000)  
    }
}

function runLogoutFunc() {
	
	if(mui.os.ios || mui.os.ipad || mui.os.iphone){
		
		var allView  = plus.webview.all();
		var currView = plus.webview.currentWebview();
		for (var i=0; i<allView.length; i++) {
			if (allView[i].getURL() == currView.getURL()) continue;
			plus.webview.close(allView[i]);
		}
		plus.webview.open("../login/login.html");
		currView.close();
	}else{
		
		plus.runtime.restart();
	}
}

function scrollToHeader() {
	
	document.querySelector('header').addEventListener('tap',function () {
		window.scroll(0, 0);
	});
}

function pickerCurrentDay(datePickerName) {
	
	var datePickerObjArr = document.getElementsByName(datePickerName);
	var day              = new Date();
	var currentFormatDay = getFormatDate(day);
	
	datePickerObjArr[0].innerHTML = currentFormatDay;
	datePickerObjArr[1].value     = getDbDateFormat(currentFormatDay);
}

function pickerPreDay(datePickerName) {
	var datePickerObjArr = document.getElementsByName(datePickerName);
	var day              = new Date();
	var preDay           = addDays(day,-1);
	var preFormatDay     = getFormatDate(preDay);
	
	datePickerObjArr[0].innerHTML = preFormatDay;
	datePickerObjArr[1].value     = getDbDateFormat(preFormatDay);
}

function pickerCurrentMonth(monthPickerName) {
	var datePickerObjArr   = document.getElementsByName(monthPickerName);
	var day                = new Date();
	var currentFormatMonth = getFormatMonth(day);
	
	datePickerObjArr[0].innerHTML = currentFormatMonth;
	datePickerObjArr[1].value     = getDbDateFormat(currentFormatMonth);
}

function pickerPreMonth(monthPickerName) {
	
	var datePickerObjArr = document.getElementsByName(monthPickerName);
	var day              = new Date();
	var preMonth         = addMonths(day,-1);
	var preFormatMonth   = getFormatMonth(preMonth);
	
	datePickerObjArr[0].innerHTML = preFormatMonth;
	datePickerObjArr[1].value     = getDbDateFormat(preFormatMonth);
}

function pickerCurrentYear(yearPickerName) {
	var datePickerObjArr = document.getElementsByName(yearPickerName);
	var day              = new Date();
	var currentYear      = day.getFullYear();
	
	datePickerObjArr[0].innerHTML = currentYear;
	datePickerObjArr[1].value     = currentYear;
}

/**
 * 千位分隔符显示
 * @param num：需要转换的数字
 */
function formatNumber(num) {
    
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 获取系统当前日： yyyyMMdd
 */
var getDbSystemDate = function ()
{
   return getDbDateFormat(getFormatDate(new Date()));
}

//open window by preload
var openPreloadWindow = function(url, para, id){
	setTimeout(function(){
		mui.openWindow({
		url	   : url,
		preload: true,
		extras : para,
		id	   : id
		})
	}, 1000);
}

var datePickOptions = function() {
	var btns = mui('.input-year');
	btns.each(function(i, btn) {
		btn.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options     = JSON.parse(optionsJson);
			var yPickArr    = options.contents;
			var id 	        = this.getAttribute('id');
			var name        = this.getAttribute('name');
			
			//获取当前时间，并把pick显示的年份为前后五年
			var now = new Date();
			var yBegin = (now.getFullYear() - 5);
			var yEnd   = (now.getFullYear() + 5);
			for (var y = yBegin; y <= yEnd; y++) {
				yPickArr.push({
					name: y + '',
					value: y
				});
			}
			
			var yPickData = {y:yPickArr};
			options = {type:"year", customData:yPickData};
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				var thisId = document.getElementById(id);
				
				//设置确定后显示名称
				thisId.innerText = rs.name;
				//设置确定后的字体颜色
				rs.valueDb == '' ? thisId.classList.remove("common-font")
					  			 : thisId.classList.add("common-font");
				/**
				 * 设置日期DB格式
				 */
				var dateObjArr     = document.getElementsByName(name);
				var dateValueObj   = dateObjArr[dateObjArr.length-1];
				dateValueObj.value = rs.valueDb;
				return;
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				picker.dispose();
			});
		}, false);
	})
}