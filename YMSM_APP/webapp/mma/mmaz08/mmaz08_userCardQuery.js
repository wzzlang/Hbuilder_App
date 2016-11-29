var dayFromPickerObj 	 = document.getElementById("dayFromPicker");
var dayToPickerObj 	     = document.getElementById("dayToPicker");
var provinceIdObj 		 = document.getElementById("provinceId");
var cityIdObj 			 = document.getElementById("cityId");
var dbDateFromObj 		 = document.getElementById("dbDateFrom");
var dbDateToObj 		 = document.getElementById("dbDateTo");
var retrieveRemarksObj 	 = document.getElementById("retrieveRemarks");
var resultDetailModelObj = document.getElementById("resultDetailModel");
var showWcDataCbObj      = document.getElementById("showWcDataCb");
var showAppDataCbObj     = document.getElementById("showAppDataCb");
var requestUrl           = "mma/mmaz08/MMAZ08UserCardQuery"; 
var localDataObj;
var showWcDataFlag  = "'2'";
var showAppDataFlag = "'3'";

(function($, doc) {
	$.init();
	$.plusReady(function() {
		initCondition();
		datePickEvent();
		helperEvent();
		retrieveEvent();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function initCondition(){
	
	// Get Parameter
	localDataObj   = eval('('+localStorage.getItem("localData")+')');
	pickerCurrentDay("dayFromPicker");
	pickerCurrentDay("dayToPicker");
}

function helperEvent(){
	
	allProvinceHelper("provincePicker");
	allCityHelper("cityPicker", provinceIdObj);
}

function retrieveEvent(){
	
	retrieveRemarksObj.innerText = "实时数据,最多延迟一小时";
	var retrieveBtnObj = document.getElementById("retrieveBtn");
	retrieveBtnObj.addEventListener('tap', function(event) {
		onRetrieve();
	}, false);
}

function onRetrieve() {
	
	initialGrid();
	
	// Must Input Check
	if (!areaMustInputCheck() || !dateMustInputCheck()) return;
	// Date Range Check
	if (!dateRangeCheck()) return;
	
	var cardFromFlagStr = '';
	
	if (showWcDataCbObj.checked)  {cardFromFlagStr = showWcDataFlag};
	if (showAppDataCbObj.checked) {
		cardFromFlagStr.trim() != '' ? cardFromFlagStr = cardFromFlagStr + ','+ showAppDataFlag
									 : cardFromFlagStr = showAppDataFlag
	};
	
	// Get parameter
	var para = {provinceId	    : provinceIdObj.value
			   ,cityId		    : cityIdObj.value
			   ,dbStartDate     : dbDateFromObj.value
			   ,dbEndDate	    : dbDateToObj.value
			   ,userId		    : localDataObj.userId
			   ,cardFromFlagStr : cardFromFlagStr};
	
	post_ajax(requestUrl,para,function(returnData) {
		// Show User Card Data
		setUserCardData(returnData);
	});
}

function initialGrid() {
	
	resultDetailModelObj.innerHTML = "";
	setHeaderLabel(resultDetailModelObj);
	resetButtomLable(resultDetailModelObj,0);
}

function setUserCardData(returnData) {
	
	var detailData 			 = returnData.details;
	var countNo = 1;
	
	resultDetailModelObj.innerHTML = "";

   	setHeaderLabel(resultDetailModelObj);
			   
	// Set User Card Data to Screen
	$.each(detailData, function (i, item) {
		
		var tr = document.createElement('tr');
		tr.innerHTML = 	'<td>' + countNo++ 			+ '</td>' +
				       	'<td>' + item.dealerCd 		+ '</td>' +
   				    	'<td>' + item.dealerNm 		+ '</td>' +
   				    	'<td>' + formatNumber(item.userCardQty) 	+ '</td>';
   		resultDetailModelObj.appendChild(tr);
	});
	
	// Set buttom lable
	resetButtomLable(resultDetailModelObj, returnData.totalQty);
}

function setHeaderLabel(resultDetailModelObj) {
	
	var tr 		 = document.createElement('tr');
	tr.innerHTML = 	'<td style="width: 35px;">No.</td>' + 
			   		'<td colspan="2">经销商</td>' 		+ 
			   		'<td style="width: 90px;">三包卡数量</td>'
   	resultDetailModelObj.appendChild(tr);
}

function resetButtomLable(resultDetailModelObj,totalQty) {
	
	var tr         = document.createElement('tr');
	tr.innerHTML   = '<td colspan="3">合计</td>' +
				     '<td>' + formatNumber(totalQty) + '</td>';
	resultDetailModelObj.appendChild(tr);
}

var areaMustInputCheck = function() {
	return mustInputCheck(provinceIdObj.value, "省份");
}

var dateMustInputCheck = function() {
	return mustInputCheck(dbDateFromObj.value, "期间") && mustInputCheck(dbDateToObj.value, "期间");
}

var dateRangeCheck = function(){
	// Start Date <= End Date Check
	// Start Date ~ End Date, not exceed 1 Month Check
	return dateCompareLeCheck(dbDateFromObj.value, dbDateToObj.value, "开始日", "结束日")
		&& monthsIntevalCheck(dayFromPickerObj.innerHTML, dayToPickerObj.innerHTML, 1, "日期");
}

var allProvinceHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(provincePicker) == "undefined" || provincePicker == null){
			provincePicker = new mui.PopPicker();
			var pickerData   	   = [];
			for (var i=0; i<province.length; i++) {
				pickerData.push(province[i]);
			}
			provincePicker.setData(pickerData);
		}
		return showPicker(provincePicker, pickerId);
	}, false);
}

var allCityHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		var cityPicker    = new mui.PopPicker();
		var pickerData    = [];
		parentIdValue=="" ? pickerData = [{"id":"","name":"请选择市"}]
						  : pickerData = filterDataByParentId(parentIdValue, city)
		cityPicker.setData(pickerData);
		return showPicker(cityPicker, pickerId);
	}, false);
}