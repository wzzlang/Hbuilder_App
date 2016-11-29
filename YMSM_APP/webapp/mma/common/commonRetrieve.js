var conTitleObj				= document.getElementById("con_title");
var psiTypeProductRadioObj 	= document.getElementById("psiTypeProductRadio");
var psiTypeDealerRadioObj 	= document.getElementById("psiTypeDealerRadio");
var periodDateRadioObj 		= document.getElementById("periodDateRadio");
var periodMonthRadioObj 	= document.getElementById("periodMonthRadio");
var periodYearRadioObj 		= document.getElementById("periodYearRadio");
var showTypeTotalRadioObj 	= document.getElementById("showTypeTotalRadio");
var showTypeDetailRadioObj 	= document.getElementById("showTypeDetailRadio");
var areaAllRadioObj 		= document.getElementById("areaAllRadio");
var areaProvinceRadioObj 	= document.getElementById("areaProvinceRadio");
var areaOrgRadioObj 		= document.getElementById("areaOrgRadio");
var areaBranchRadioObj 		= document.getElementById("areaBranchRadio");
var areaDealerRadioObj 		= document.getElementById("areaDealerRadio");
var areaWhRadioObj 			= document.getElementById("areaWhRadio");
var areaOfficeRadioObj 		= document.getElementById("areaOfficeRadio");
var areaOwnShopRadioObj 	= document.getElementById("areaOwnShopRadio");
var productCategoryRadioObj	= document.getElementById("productCategoryRadio");
var productClassRadioObj 	= document.getElementById("productClassRadio");
var productModelRadioObj 	= document.getElementById("productModelRadio");
var dbPackingYearObj 		= document.getElementById("dbPackingYear");
var dayFromPickerObj 		= document.getElementById("dayFromPicker");
var dayToPickerObj 			= document.getElementById("dayToPicker");
var monthFromPickerObj 		= document.getElementById("monthFromPicker");
var monthToPickerObj 		= document.getElementById("monthToPicker");
var yearPickerObj 		    = document.getElementById("yearPicker");
var provincePickerObj 		= document.getElementById("provincePicker");
var whPickerObj 			= document.getElementById("whPicker");
var orgPickerObj 			= document.getElementById("orgPicker");
var branchPickerObj 		= document.getElementById("branchPicker");
var dealerPickerObj 		= document.getElementById("dealerPicker");
var modelCategoryPickerObj	= document.getElementById("modelCategoryPicker");
var modelClassPickerObj 	= document.getElementById("modelClassPicker");
var modelPickerObj 			= document.getElementById("modelPicker");
var dbDateFromObj 			= document.getElementById("dbDateFrom");
var dbDateToObj 			= document.getElementById("dbDateTo");
var dbMonthFromObj 			= document.getElementById("dbMonthFrom");
var dbMonthToObj 			= document.getElementById("dbMonthTo");
var dbYearObj 			    = document.getElementById("dbYear");
var whIdObj 				= document.getElementById("whId");
var orgIdObj 				= document.getElementById("orgId");
var branchIdObj 			= document.getElementById("branchId");
var dealerIdObj 			= document.getElementById("dealerId");
var dealerCdObj 			= document.getElementById("dealerCd");
var canalCityPickerObj		= document.getElementById("canalCityPicker");
var canalCityIdObj			= document.getElementById("canalCityId");
var subDealerPickerObj 		= document.getElementById("subDealerPicker");
var subDealerIdObj			= document.getElementById("subDealerId");
var provinceIdObj 			= document.getElementById("provinceId");
var modelCategoryIdObj 		= document.getElementById("modelCategoryId");
var modelClassIdObj 		= document.getElementById("modelClassId");
var modelIdObj 				= document.getElementById("modelId");
var modelCategoryNmObj 		= document.getElementById("modelCategoryNm");
var modelClassNmObj 		= document.getElementById("modelClassNm");
var modelNmObj 				= document.getElementById("modelNm");
var packingYearPickerObj 	= document.getElementById("packingYearPicker");
var retrieveRemarksObj	    = document.getElementById("retrieveRemarks");
var areaMustInputObj		= document.getElementById("areaMustInput");
var targetDealerObj		    = document.getElementById("targetDealer");
var showDlDataCbObj		    = document.getElementById("showDlDataCb");
var showSubDlDataCbObj		= document.getElementById("showSubDlDataCb");
var canalCityPicker         = null;
var subDealerPicker         = null;
var isDealerCdFocus			= false;
var functionId;
var localData;
var para;
var DISPLAY 	            = "";
var NONEDISPLAY             = "none";
var UNCHECK                 = "0";
var CHECKED                 = "1";

(function($, doc) {
	$.init();
	$.plusReady(function() {
		initializScreen();
		datePickEvent();
		datePickOptions();
		helperEvent();
		loseFocusEvent();
		radioButtonInitial();
		radioButtonEvent();
		checkBoxInitial();
		showMoreExhaust();
		showMoreColor();
		retrieveEvent();
	});
})(mui, document); 

function initializScreen() {
	
	functionId = eval(JSON.stringify(plus.webview.currentWebview().parentMenuId));
	localData  = eval('('+localStorage.getItem("localData")+')');
	
	showScreenByFunctionId(functionId);
}

function helperEvent(){
	
	whHelper("whPicker");
	orgHelper("orgPicker");
	branchHelper("branchPicker");
	thisMainDealerHelper("dealerPicker");
	provinceHelper("provincePicker");
	modelCategoryHelper("modelCategoryPicker", showExhaustAndColor);
	modelClassHelper("modelClassPicker", modelCategoryIdObj);
	modelHelper("modelPicker", modelClassIdObj, modelCategoryIdObj);
	canalCityHelper("canalCityPicker",dealerIdObj);
	subDealerHelper("subDealerPicker",dealerIdObj,canalCityIdObj);
}

function loseFocusEvent(){
	
	dealerCdObj.addEventListener("focus",function(){
		isDealerCdFocus = true;
	});
	
	dealerCdObj.addEventListener("blur", function(){
		isDealerCdFocus = false;
		if (dealerCdObj.value.trim() != "") {
			getDealerId();
		}
	});
	
}

function radioButtonInitial() {

	psiTypeRadioButtonInitial();
	periodRadioButtonInitial();
	showTypeRadioButtonInitial();
	areaRadioButtonInitial();
	productRadioButtonInitial();
}
function psiTypeRadioButtonInitial() {
	setRadioButtonDefaultValue("psiTypeRadio",psiTypeControl);
}
function periodRadioButtonInitial() {
	setRadioButtonDefaultValue("periodRadio",periodControl);
}

function showTypeRadioButtonInitial() {
	setRadioButtonDefaultValue("showTypeRadio",showTypeControl);
}

function areaRadioButtonInitial() {
	setRadioButtonDefaultValue("areaRadio",areaControl);
}

function productRadioButtonInitial() {
	setRadioButtonDefaultValue("productRadio",productControl);
}


function radioButtonEvent() {

	var radioButtonNameArr = ["psiTypeRadio"
							, "periodRadio"
							, "showTypeRadio"
							, "areaRadio"
							, "productRadio"];
								
	var callBackFuncArr = [psiTypeControl
						 , periodControl
						 , showTypeControl
						 , areaControl
						 , productControl];
	
	for (var i=0; i<radioButtonNameArr.length; i++) {
		radioButtonClick(radioButtonNameArr[i],callBackFuncArr[i]);
	}
}

function checkBoxInitial() {
	
	showDlDataCbObj.checked    = true;
	showSubDlDataCbObj.checked = true;
}

function retrieveEvent() {
	
	var retrieveBtnObj = document.getElementById("retrieveBtn");
	retrieveBtnObj.addEventListener('tap', function(event) {
		//if input area of dealerCd is focus, return
		if (isDealerCdFocus) return;
		onRetrieve();
	}, false);
}

/**
 * Screen Layout : Control By Function ID
 */
var showScreenByFunctionId = function(functionId){
	
	if (localData.orgClass == "1") {// Orgnization
		switch (functionId){
			case "MMAZ01":
				showPSI();
				break;
			case "MMAZ02":
				showOrder();
				break;
			case "MMAZ03":
				showTrade();
				break;
			case "MMAZ04":
				showInOut();
				break;
			case "MMAZ05":
				showUserAnalysis();
				break;
			case "MMAZ06":
				showTop();
				break;
			case "MMAZ07":
				showStock();
				break;
			case "MMAZ09":
				showRetail();
				break;
			default:
				break;
		}
	}
	
	if (localData.orgClass == "2") {// Dealer
		switch (functionId){
		case "MMAZ01":
			showPSIForDealer();
			break;
		case "MMAZ05":
			showUserAnalysisForDealer();
			break;
		case "MMAZ06":
			showTopForDealer();
			break;
		case "MMAZ07":
			showStockForDealer();
			break;
		case "MMAZ09":
			showRetailForDealer();
			break;
		default:
			break;
		}
	}
}

var showPSI = function(){
	conTitleObj.innerHTML = "进销存日报";
	document.getElementById("psiType").style.display=DISPLAY;
	document.getElementById("period").style.display	=DISPLAY;
	document.getElementById("area").style.display	=DISPLAY;
	document.getElementById("product").style.display=DISPLAY;
	retrieveRemarksObj.innerText         = "最新数据截止于昨日";
	periodDateRadioObj.style.display	 =DISPLAY;
	periodMonthRadioObj.style.display	 =DISPLAY;
	psiTypeProductRadioObj.style.display =DISPLAY;
	psiTypeDealerRadioObj.style.display	 =DISPLAY;
	areaAllRadioObj.style.display		 =DISPLAY;
	areaOrgRadioObj.style.display		 =DISPLAY;
	areaDealerRadioObj.style.display	 =DISPLAY;
	productCategoryRadioObj.style.display=DISPLAY;
	productClassRadioObj.style.display	 =DISPLAY;
	targetDealerObj.style.display	     =DISPLAY;//代理/直销  分销商 checkBox
	//setting default value for datePicker
	pickerPreDay("dayFromPicker");
	pickerPreDay("dayToPicker");
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
}
var showPSIForDealer = function(){
	conTitleObj.innerHTML = "进销存日报";
	document.getElementById("period").style.display=DISPLAY;
	document.getElementById("product").style.display=DISPLAY;
	retrieveRemarksObj.innerText            = "最新数据截止于昨日";
	periodDateRadioObj.style.display		=DISPLAY;
	periodMonthRadioObj.style.display		=DISPLAY;
	productCategoryRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display		=DISPLAY;
	if (localData.dealerType == "1"){
		targetDealerObj.style.display	        =DISPLAY;//代理/直销  分销商 checkBox
	}
	
	//setting default value for datePicker
	pickerPreDay("dayFromPicker");
	pickerPreDay("dayToPicker");
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
}

var showOrder = function(){
	conTitleObj.innerHTML = "订单详情";
	document.getElementById("period").style.display		=DISPLAY;
	document.getElementById("area").style.display		=DISPLAY;
	document.getElementById("product").style.display	=DISPLAY;
	document.getElementById("exhaustDiv").style.display	=DISPLAY;
	document.getElementById("colorDiv").style.display	=DISPLAY;
	retrieveRemarksObj.innerText            = "实时数据,最多延迟一小时";
	periodDateRadioObj.style.display		=DISPLAY;
	periodMonthRadioObj.style.display		=DISPLAY;
	areaAllRadioObj.style.display			=DISPLAY;
	areaBranchRadioObj.style.display		=DISPLAY;
	areaProvinceRadioObj.style.display		=DISPLAY;
	productCategoryRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display		=DISPLAY;
	productModelRadioObj.style.display		=DISPLAY;
	showExhaustAndColor();
	//setting default value for datePicker
	pickerCurrentDay("dayFromPicker");
	pickerCurrentDay("dayToPicker");
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
}

var showTrade = function() {
	conTitleObj.innerHTML = "网点查询";
	document.getElementById("period").style.display		=DISPLAY;
	document.getElementById("showType").style.display	=DISPLAY
	document.getElementById("area").style.display		=DISPLAY;
	document.getElementById("product").style.display	=DISPLAY;
	retrieveRemarksObj.innerText            = "最新数据截止于昨日";
	showTypeTotalRadioObj.style.display		=DISPLAY;
	showTypeDetailRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display		=DISPLAY;
	areaProvinceRadioObj.style.display		=DISPLAY;
	productClassRadioObj.style.display		=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
}

var showStock = function(){
	conTitleObj.innerHTML = "库存";
	document.getElementById("area").style.display		=DISPLAY;
	document.getElementById("product").style.display	=DISPLAY;
	document.getElementById("packingYear").style.display=DISPLAY;
	document.getElementById("exhaustDiv").style.display	=DISPLAY;
	document.getElementById("colorDiv").style.display	=DISPLAY;
	retrieveRemarksObj.innerText            = "实时数据,最多延迟一小时";
	areaWhRadioObj.style.display			=DISPLAY;
	productCategoryRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display		=DISPLAY;
	productModelRadioObj.style.display		=DISPLAY;
	packingYearPickerObj.style.display		=DISPLAY;
	showExhaustAndColor();
}
var showStockForDealer = function(){
	conTitleObj.innerHTML = "库存";
	if(localData.dealerType == "1") {
		document.getElementById("area").style.display	 =DISPLAY;
		areaOfficeRadioObj.style.display				 =DISPLAY;
	}
	document.getElementById("product").style.display	=DISPLAY;
	document.getElementById("packingYear").style.display=DISPLAY;
	document.getElementById("exhaustDiv").style.display	=DISPLAY;
	document.getElementById("colorDiv").style.display	=DISPLAY;
	retrieveRemarksObj.innerText            = "实时数据,最多延迟一小时";
	areaOwnShopRadioObj.style.display		=DISPLAY;
	productCategoryRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display		=DISPLAY;
	productModelRadioObj.style.display		=DISPLAY;
	packingYearPickerObj.style.display		=DISPLAY;
	showExhaustAndColor();
}

var showInOut = function() {
	conTitleObj.innerHTML = "进出库";
	document.getElementById("period").style.display		=DISPLAY;
	document.getElementById("area").style.display		=DISPLAY;
	document.getElementById("product").style.display	=DISPLAY;
	document.getElementById("exhaustDiv").style.display	=DISPLAY;
	document.getElementById("colorDiv").style.display	=DISPLAY;
	retrieveRemarksObj.innerText            = "实时数据,最多延迟一小时";
	periodDateRadioObj.style.display		=DISPLAY;
	periodMonthRadioObj.style.display		=DISPLAY;
	areaWhRadioObj.style.display			=DISPLAY;
	productCategoryRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display		=DISPLAY;
	productModelRadioObj.style.display		=DISPLAY;
	showExhaustAndColor();
	//setting default value for datePicker
	pickerCurrentDay("dayFromPicker");
	pickerCurrentDay("dayToPicker");
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
}

var showUserAnalysis = function(){
	conTitleObj.innerHTML = "购车用户分析";
	document.getElementById("period").style.display	=DISPLAY;
	document.getElementById("area").style.display	=DISPLAY;
	retrieveRemarksObj.innerText        = "实时数据";
	periodYearRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display	=DISPLAY;
	areaAllRadioObj.style.display		=DISPLAY;
	areaProvinceRadioObj.style.display	=DISPLAY;
	areaOwnShopRadioObj.style.display	=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
	pickerCurrentYear("yearPicker");
}

var showUserAnalysisForDealer = function(){
	conTitleObj.innerHTML = "购车用户分析";
	document.getElementById("period").style.display=DISPLAY;
	retrieveRemarksObj.innerText        = "实时数据";
	periodYearRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display	=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
	pickerCurrentYear("yearPicker");
}

var showTop = function(){
	conTitleObj.innerHTML = "畅销车";
	document.getElementById("period").style.display	=DISPLAY;
	document.getElementById("area").style.display	=DISPLAY;
	document.getElementById("product").style.display=DISPLAY;
	retrieveRemarksObj.innerText        = "实时数据";
	periodYearRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display	=DISPLAY;
	areaAllRadioObj.style.display		=DISPLAY;
	areaProvinceRadioObj.style.display	=DISPLAY;
	areaOwnShopRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display	=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
	pickerCurrentYear("yearPicker");
}

var showTopForDealer = function(){
	conTitleObj.innerHTML = "畅销车";
	document.getElementById("period").style.display =DISPLAY;
	document.getElementById("product").style.display=DISPLAY;
	retrieveRemarksObj.innerText        = "实时数据";
	periodYearRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display	=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
	pickerCurrentYear("yearPicker");
}

var showRetail = function(){
	conTitleObj.innerHTML = "车型零售分析";
	document.getElementById("period").style.display	 =DISPLAY;
	document.getElementById("product").style.display =DISPLAY;
	retrieveRemarksObj.innerText        = "实时数据";
	periodYearRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display	=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
	pickerCurrentYear("yearPicker");
}

var showRetailForDealer = function(){
	conTitleObj.innerHTML = "车型零售分析";
	document.getElementById("period").style.display=DISPLAY;
	document.getElementById("product").style.display =DISPLAY;
	retrieveRemarksObj.innerText        = "实时数据";
	periodYearRadioObj.style.display	=DISPLAY;
	periodMonthRadioObj.style.display	=DISPLAY;
	productClassRadioObj.style.display	=DISPLAY;
	//setting default value for datePicker
	pickerCurrentMonth("monthFromPicker");
	pickerCurrentMonth("monthToPicker");
	pickerCurrentYear("yearPicker");
}
	
/**
 * Search
 */
var onRetrieve = function(){
	
	para = prepareSearchData();
	if (localData.orgClass == "1") { //Orgnization
		
		switch (functionId){
			case "MMAZ01":
				//Date range check
				if (periodDateRadioObj.value == "1") {
					if(!dayRangeCheck()) return;
				}
				if (periodMonthRadioObj.value == "1") {
					if(!monthRangeCheck()) return;
				}
				if(!dateMustInputCheck() || !areaMustInputCheck()) return;
				if(!dealerTypeMustInputCheck()) return;
				url = "../mmaz01/mmaz01_orgPSIDetail.html"
				openWindow(url, para);
				break;
			case "MMAZ02":
				//Date range check
				if (periodDateRadioObj.value == "1") {
					if(!dayRangeCheck()) return;
				}
				if (periodMonthRadioObj.value == "1") {
					if(!monthRangeCheck()) return;
				}
				if(!dateMustInputCheck()) return;
				url = "../mmaz02/mmaz02_orderDetail.html"
				openWindow(url, para);
				break;
			case "MMAZ03":
				if(!dateMustInputCheck() || !monthRangeCheck()) return;
				url = "../mmaz03/mmaz03_tradeDetail.html"
				openWindow(url, para);
				break;
			case "MMAZ04":
				//Date range check
				if (periodDateRadioObj.value == "1") {
					if(!dayRangeCheck()) return;
				}
				if (periodMonthRadioObj.value == "1") {
					if(!monthRangeCheck()) return;
				}
				if(!dateMustInputCheck()) return;
				url = "../mmaz04/mmaz04_whInOutDetail.html"
				openWindow(url, para);
				break;
			case "MMAZ05":
				if(!dateMustInputCheck() || !areaMustInputCheck() || !monthRangeCheck()) return;
				url = "../mmaz05/mmaz05_analys.html"
				openWindow(url, para);
				break;
			case "MMAZ06":
				if(!dateMustInputCheck() || !areaMustInputCheck() || !monthRangeCheck()) return;
				url = "../mmaz06/mmaz06_selling.html"
				openWindow(url, para);
				break;
			case "MMAZ07":
				url = "../mmaz07/mmaz07_stockDetail.html"
				openWindow(url, para);
				break;
			case "MMAZ09":
				if(!dateMustInputCheck() || !monthRangeCheck()) return;
				url = "../mmaz09/mmaz09_retailAnalys.html"
				openWindow(url, para);
				break;
			default:
				break;
		}
	}
	
	if (localData.orgClass == "2") { //Dealer
		
		switch (functionId){
		case "MMAZ01":
			//Date range check
			if (periodDateRadioObj.value == "1") {
				if(!dayRangeCheck()) return;
			}
			if (periodMonthRadioObj.value == "1") {
				if(!monthRangeCheck()) return;
			}
			if(!dateMustInputCheck()) return;
			if(!dealerTypeMustInputCheck()) return;
			url = "../mmaz01/mmaz01_dealerPSIDetail.html"
			openWindow(url, para);
			break;
		case "MMAZ05":
			if(!dateMustInputCheck() || !monthRangeCheck()) return;
			url = "../mmaz05/mmaz05_analys.html"
			openWindow(url, para);
			break;
		case "MMAZ06":
			if(!dateMustInputCheck() || !monthRangeCheck()) return;
			url = "../mmaz06/mmaz06_selling.html"
			openWindow(url, para);
			break;
		case "MMAZ07":
			url = "../mmaz07/mmaz07_dealerStockDetail.html"
			openWindow(url, para);
			break;
		default:
			break;
		}
	}
}

var prepareSearchData = function() {
	
	dealerCdObj.value			= dealerCdObj.value.toUpperCase();
	
	var psiTypeProductRadio 	= psiTypeProductRadioObj.value;
	var psiTypeDealerRadio 		= psiTypeDealerRadioObj.value;
	var showTypeTotalRadio 		= showTypeTotalRadioObj.value;
	var showTypeDetailRadio 	= showTypeDetailRadioObj.value;
	var areaAllRadio 			= areaAllRadioObj.value;
	var areaProvinceRadio 		= areaProvinceRadioObj.value;
	var areaOrgRadio 			= areaOrgRadioObj.value;
	var areaBranchRadio 		= areaBranchRadioObj.value;
	var areaDealerRadio 		= areaDealerRadioObj.value;
	var areaWhRadio 			= areaWhRadioObj.value;
	var areaOfficeRadio 		= areaOfficeRadioObj.value;
	var areaOwnShopRadio 		= areaOwnShopRadioObj.value;
	var productCategoryRadio 	= productCategoryRadioObj.value;
	var productClassRadio 		= productClassRadioObj.value;
	var productModelRadio 		= productModelRadioObj.value;
	var dbDateFrom 				= dbDateFromObj.value;
	var dbDateTo 				= dbDateToObj.value;
	var dbMonthFrom 			= dbMonthFromObj.value;
	var dbMonthTo 				= dbMonthToObj.value;
	var dbYear  			    = dbYearObj.value;
	var whId 					= whIdObj.value;
	var provinceId 				= provinceIdObj.value;
	var orgId 					= orgIdObj.value;
	var branchId 				= branchIdObj.value;
	var dealerId 				= dealerIdObj.value;
	var dealerCd 				= dealerCdObj.value;
	var cityId 					= canalCityIdObj.value;
	var subDealerId 			= subDealerIdObj.value;
	var modelCategoryId 		= modelCategoryIdObj.value;
	var modelCategoryNm 		= modelCategoryNmObj.value;
	var modelClassId 			= modelClassIdObj.value;
	var modelClassNm 			= modelClassNmObj.value;
	var modelId 				= modelIdObj.value;
	var modelNm 				= modelNmObj.value;
	var packingYear				= dbPackingYearObj.value;
	var exhaustArr				= getExhaust();
	var colorArr				= getColor();
	var showDlData				= CHECKED;
	var showSubDlData			= CHECKED;
	
	if (localData.orgClass == "2") {// Dealer
		switch (functionId){
		case "MMAZ05":
			areaOwnShopRadio = "1";
			break;
		case "MMAZ06":
			areaOwnShopRadio = "1";
			break;
		default:
			break;
		}
	}
	
	if (dayFromPickerObj.style.display == NONEDISPLAY) {dbDateFrom = "";}
	if (dayToPickerObj.style.display == NONEDISPLAY) {dbDateTo = "";}
	if (monthFromPickerObj.style.display == NONEDISPLAY) {dbMonthFrom = "";}
	if (monthToPickerObj.style.display == NONEDISPLAY) {dbMonthTo = "";}
	if (yearPickerObj.style.display == NONEDISPLAY) {dbYear = "";}
	if (provincePickerObj.style.display == NONEDISPLAY) {provinceId = "";}
	if (whPickerObj.style.display == NONEDISPLAY) {whId = "";}
	if (orgPickerObj.style.display == NONEDISPLAY) {orgId = "";}
	if (orgPickerObj.style.display == NONEDISPLAY) {orgId = "";}
	if (branchPickerObj.style.display == NONEDISPLAY) {branchId = "";}
	if (dealerPickerObj.style.display == NONEDISPLAY) {dealerId = "";}
	if (canalCityPickerObj.style.display == NONEDISPLAY) {cityId = "";}
	if (subDealerPickerObj.style.display == NONEDISPLAY) {subDealerId = "";}
	if (modelCategoryPickerObj.style.display == NONEDISPLAY) {modelCategoryId = "";}
	if (modelClassPickerObj.style.display == NONEDISPLAY) {modelClassId = "";}
	if (modelPickerObj.style.display == NONEDISPLAY) {modelId = "";}
	if (dealerCdObj.style.display == NONEDISPLAY) {dealerCd = "";}
	if (modelCategoryNmObj.style.display == NONEDISPLAY) {modelCategoryNm = "";}
	if (modelClassNmObj.style.display == NONEDISPLAY) {modelClassNm = "";}
	if (modelNmObj.style.display == NONEDISPLAY) {modelNm = "";}
	if (packingYearPickerObj.style.display == NONEDISPLAY) {packingYear = "";}
	
	showDlDataCbObj.checked	   ? showDlData    = CHECKED : showDlData    = UNCHECK
	//特殊处理，当选择经销商和渠道时，设置为CHECKED
	if (psiTypeDealerRadioObj.value == "1" && areaDealerRadioObj.value == 1) {
		showDlData    = CHECKED
	}
	
	showSubDlDataCbObj.checked ? showSubDlData = CHECKED : showSubDlData = UNCHECK
	
	var para = { psiTypeProductRadio	:psiTypeProductRadio
				,psiTypeDealerRadio		:psiTypeDealerRadio
				,showTypeTotalRadio		:showTypeTotalRadio
				,showTypeDetailRadio	:showTypeDetailRadio
				,areaAllRadio			:areaAllRadio
				,areaProvinceRadio		:areaProvinceRadio
				,areaOrgRadio			:areaOrgRadio
				,areaBranchRadio		:areaBranchRadio
				,areaDealerRadio		:areaDealerRadio
				,areaWhRadio			:areaWhRadio
				,areaOfficeRadio		:areaOfficeRadio
				,areaOwnShopRadio		:areaOwnShopRadio
				,productCategoryRadio	:productCategoryRadio
				,productClassRadio		:productClassRadio
				,productModelRadio		:productModelRadio
				,dbDateFrom				:dbDateFrom
				,dbDateTo				:dbDateTo
				,dbMonthFrom			:dbMonthFrom
				,dbMonthTo				:dbMonthTo
				,dbYear				    :dbYear
				,provinceId				:provinceId
				,whId					:whId
				,orgId					:orgId
				,branchId				:branchId
				,dealerId				:subDealerId.trim() == "" ? dealerId : subDealerId 
				,dealerCd				:dealerCd
				,cityId					:cityId
				,modelCategoryId		:modelCategoryId
				,modelCategoryNm		:modelCategoryNm
				,modelClassId			:modelClassId
				,modelClassNm			:modelClassNm
				,modelId				:modelId
				,modelNm				:modelNm
				,packingYear			:packingYear
				,showDlData				:showDlData
				,showSubDlData			:showSubDlData
				,exhaustArr				:exhaustArr
				,colorArr				:colorArr
				,userId					:localData.userId};
	return para;
}

var dateMustInputCheck = function() {
	var dataArr = [];
	
	if (para.dbDateFrom == "" || para.dbDateTo == "") {
		dataArr.push("");
	} else {
		dataArr.push(para.dbDateFrom);
	}
	if (para.dbMonthFrom == "" || para.dbMonthTo == ""){
		dataArr.push("");
	} else {
		dataArr.push(para.dbMonthFrom);
	}
	dataArr.push(para.dbYear);

	return arrMustInputCheck(dataArr, "日期");
}

var areaMustInputCheck= function() {
	var dataArr = [];
	
	if (areaAllRadioObj.value == "1" || areaOfficeRadioObj.value == "1" || areaOwnShopRadioObj.value == "1") return true;
	
	dataArr.push(para.provinceId);
	dataArr.push(para.whId);
	dataArr.push(para.orgId);
	dataArr.push(para.branchId);
	dataArr.push(para.dealerId);
	dataArr.push(para.dealerCd);
	return arrMustInputCheck(dataArr, "区域");
}

var dealerTypeMustInputCheck= function() {
	
	if (showSubDlDataCbObj.checked || showDlDataCbObj.checked) return true;
	mui.toast('请选择查询的经销商类型!');
	return false;
}

/**
 * Click Event
 */
function psiTypeControl() {
	
	// If Select "Product", show areaDealer
	if (psiTypeProductRadioObj.value == "1") {
		areaDealerRadioObj.style.display=DISPLAY;
		areaRadioButtonInitial();
	}
	
	// If Select "Dealer", hidden & clear areaDealer
	if (psiTypeDealerRadioObj.value == "1") {
		areaDealerRadioObj.style.display=DISPLAY;
		areaRadioButtonInitial();
	}
}

function periodControl() {
	
	// If Select "Date", show Date Helper & hidden Month Helper
	if (periodDateRadioObj.value == "1") {
		dayFromPickerObj.style.display	= DISPLAY;
		dayToPickerObj.style.display	= DISPLAY;
	} else {
		dayFromPickerObj.style.display	= NONEDISPLAY;
		dayToPickerObj.style.display	= NONEDISPLAY;
	}
	
	// If Select "Month", show Month Helper & hidden Date Helper
	if (periodMonthRadioObj.value == "1") {
		monthFromPickerObj.style.display = DISPLAY;
		monthToPickerObj.style.display	 = DISPLAY;
	} else {
		monthFromPickerObj.style.display = NONEDISPLAY;
		monthToPickerObj.style.display	 = NONEDISPLAY;
	}
	
	// If Select "Year", show Year Helper & hidden Date Helper
	if (periodYearRadioObj.value == "1") {
		yearPickerObj.style.display	= DISPLAY;
	} else {
		yearPickerObj.style.display	= NONEDISPLAY;
	}
}

function showTypeControl() {
	
	// If Select "Total", hidden & clear area & product
	if (showTypeTotalRadioObj.value == "1") {
		document.getElementById("area").style.display	=DISPLAY;
		document.getElementById("product").style.display=NONEDISPLAY;
		areaProvinceRadioObj.style.display				=NONEDISPLAY;
		areaBranchRadioObj.style.display                =DISPLAY;
		productClassRadioObj.style.display				=NONEDISPLAY;
		areaRadioButtonInitial();
		productRadioButtonInitial();
	}
	
	// If Select "Detail", show area & product
	if (showTypeDetailRadioObj.value == "1") {
		document.getElementById("area").style.display	=DISPLAY;
		document.getElementById("product").style.display=DISPLAY;
		areaProvinceRadioObj.style.display				=DISPLAY;
		areaBranchRadioObj.style.display                =DISPLAY;
		productClassRadioObj.style.display				=DISPLAY;
		areaRadioButtonInitial();
		productRadioButtonInitial();
	}
}

function areaControl() {
	
	areaMustInputObj.innerHTML 	    = "";

	// Province
	if (areaProvinceRadioObj.value == 1) {
		provincePickerObj.style.display = DISPLAY;
		
		if (functionId == "MMAZ01" || functionId == "MMAZ05" || functionId == "MMAZ06") {
			areaMustInputObj.innerHTML ="*省份必须输入";
		}
	} else {
		provincePickerObj.style.display = NONEDISPLAY;
	}
	
	// Branch
	if (areaBranchRadioObj.value == 1) {
		branchPickerObj.style.display = DISPLAY;
	} else {
		branchPickerObj.style.display = NONEDISPLAY;
	}
	
	// Organization
	if (areaOrgRadioObj.value == 1) {
		orgPickerObj.style.display = DISPLAY;
		if (functionId == "MMAZ01") {
			areaMustInputObj.innerHTML ="*办事处必须输入";
		}
	} else {
		orgPickerObj.style.display = NONEDISPLAY;
	}
	
	// Dealer
	if (areaDealerRadioObj.value == 1) {
		dealerPickerObj.style.display    = DISPLAY;
		dealerCdObj.style.display 	     = DISPLAY;
		canalCityPickerObj.style.display = DISPLAY;
		subDealerPickerObj.style.display = DISPLAY;
		// If Select "Dealer", hidden & clear subAreaDealer
		if (psiTypeDealerRadioObj.value == "1") {
			subDealerPickerObj.style.display = NONEDISPLAY;
		}
		//If canalCity is not blank,disable checkbox
		resetCheckBox();
		
		if (functionId == "MMAZ01") {
			areaMustInputObj.innerHTML ="*渠道必须输入";
		}
	} else {
		dealerPickerObj.style.display      = NONEDISPLAY;
		dealerCdObj.style.display 	       = NONEDISPLAY;
		canalCityPickerObj.style.display   = NONEDISPLAY;
		subDealerPickerObj.style.display   = NONEDISPLAY;
		showDlDataCbObj.disabled    	   = false;
		showSubDlDataCbObj.disabled 	   = false;
	}
	
	// Warehouse
	if (areaWhRadioObj.value == 1) {
		whPickerObj.style.display = DISPLAY;
	} else {
		whPickerObj.style.display = NONEDISPLAY;
	}
}

function productControl() {
	
	if (productCategoryRadioObj.value == "1") {
		modelCategoryPickerObj.style.display 	= DISPLAY;
		modelCategoryNmObj.style.display		= DISPLAY;
		modelClassPickerObj.style.display		= NONEDISPLAY;
		modelClassNmObj.style.display			= NONEDISPLAY;
		modelPickerObj.style.display			= NONEDISPLAY;
		modelNmObj.style.display				= NONEDISPLAY;
	} else if (productClassRadioObj.value == "1") {
		modelCategoryPickerObj.style.display 	= DISPLAY;
		modelCategoryNmObj.style.display		= DISPLAY;
		modelClassPickerObj.style.display		= DISPLAY;
		modelClassNmObj.style.display			= DISPLAY;
		modelPickerObj.style.display			= NONEDISPLAY;
		modelNmObj.style.display				= NONEDISPLAY;
		
		if (functionId == "MMAZ09"){
			
			modelCategoryPickerObj.style.display 	= NONEDISPLAY;
			modelCategoryNmObj.style.display		= NONEDISPLAY;
			modelClassPickerObj.style.display		= DISPLAY;
			modelClassNmObj.style.display			= NONEDISPLAY;
			modelPickerObj.style.display			= NONEDISPLAY;
			modelNmObj.style.display				= NONEDISPLAY;
		}
		
		if (functionId == "MMAZ06"){
			
			modelCategoryPickerObj.style.display 	= DISPLAY;
			modelCategoryNmObj.style.display		= NONEDISPLAY;
			modelClassPickerObj.style.display		= DISPLAY;
			modelClassNmObj.style.display			= NONEDISPLAY;
			modelPickerObj.style.display			= NONEDISPLAY;
			modelNmObj.style.display				= NONEDISPLAY;
		}
		
	} else if (productModelRadioObj.value == "1") {
		modelCategoryPickerObj.style.display 	= DISPLAY;
		modelCategoryNmObj.style.display		= DISPLAY;
		modelClassPickerObj.style.display		= DISPLAY;
		modelClassNmObj.style.display			= DISPLAY;
		modelPickerObj.style.display			= DISPLAY;
		modelNmObj.style.display				= DISPLAY;
	} else {
		modelCategoryPickerObj.style.display 	= NONEDISPLAY;
		modelCategoryNmObj.style.display		= NONEDISPLAY;
		modelClassPickerObj.style.display		= NONEDISPLAY;
		modelClassNmObj.style.display			= NONEDISPLAY;
		modelPickerObj.style.display			= NONEDISPLAY;
		modelNmObj.style.display				= NONEDISPLAY;
	}
}

/**
 * Exhaust & Color
 */
function showExhaustAndColor() {
	
	showExhaustBoxBtn();
	showColorBoxBtn();
}
function showExhaustBoxBtn() {

	var modelCategoryId 			= modelCategoryIdObj.value;
	var exhaustListObj 				= document.getElementById("exhaustDivList");
	var collapseExhaustDivListObj 	= document.getElementById("collapseExhaustDivList");
	var exhaustArr		= "";
	
	exhaustListObj.innerHTML = "";
	collapseExhaustDivListObj.innerHTML = "";
	
	for (var i=0; i<modelCategory.length; i++) {
		if (modelCategoryId == modelCategory[i].id) {
			exhaustArr = modelCategory[i].exhaust;
		}
	}
	
	for (var i=0; i<exhaustArr.length; i++) {
		if (i==5) break;
		createExhaustCheckBoxNode(exhaustListObj
						 		, "exhaust"+i
						 		, exhaustArr[i].code
						 		, exhaustArr[i].name);
	}
	
	
	for (var i=5; i<exhaustArr.length; i++) {
		createExhaustCheckBoxNode(collapseExhaustDivListObj
						 		, "exhaust"+i
						 		, exhaustArr[i].code
						 		, exhaustArr[i].name);
	}
}
function showColorBoxBtn(){
	
	var modelCategoryId 		= modelCategoryIdObj.value;
	var colorListObj 			= document.getElementById("colorDivList");
	var collapseColorDivListObj	= document.getElementById("collapseColorDivList");
	var colorArr		= "";
	
	colorListObj.innerHTML = "";
	collapseColorDivListObj.innerHTML = "";
	
	for (var i=0; i<modelCategory.length; i++) {
		if (modelCategoryId == modelCategory[i].id) {
			colorArr = modelCategory[i].color;
		}
	}
	
	for (var i=0; i<colorArr.length; i++) {
		if (i==5) break;
		createColorCheckBoxNode(colorListObj
						 	  , "color"+i
						 	  , colorArr[i].code
						 	  , colorArr[i].name);
	}
	
	for (var i=5; i<colorArr.length; i++) {
		createColorCheckBoxNode(collapseColorDivListObj
						 	  , "color"+i
						 	  , colorArr[i].code
						 	  , colorArr[i].name);
	}
}

function createExhaustCheckBoxNode(inputListObj, inputId, inputValue, inputShowValue) {
	var span        = document.createElement("span");
	span.setAttribute("for",inputId);
	span.value= inputValue;
	inputListObj.appendChild(span).innerHTML='<input type="checkbox" name='+inputId+'"id="'+inputId+'"value="'+inputValue+'"/><label for="'+inputId+'">'+inputShowValue+'</label>';
}

function createColorCheckBoxNode(inputListObj, inputId, inputValue, inputShowValue) {
	var span         = document.createElement("span");
	var colorClassNm = getColorByColorNm(inputShowValue);
	span.setAttribute("class",colorClassNm);
	span.setAttribute("for",  inputId);
	span.value= inputValue;
	inputListObj.appendChild(span).innerHTML='<input type="checkbox" name='+inputId+'"id="'+inputId+'"value="'+inputValue+'"/><label for="'+inputId+'">'+inputShowValue+'</label>';
}
var getExhaust = function(){
	var exhaustArray 			= new Array();
	var exhaustObject 		  	= document.getElementById('exhaustDivList');
	var collapseExhaustObject 	= document.getElementById('collapseExhaustDivList');
	var inputObject    	   		= exhaustObject.getElementsByTagName("input");
	var collapseInputObject 	= collapseExhaustObject.getElementsByTagName("input");
	for (var i=0;i<inputObject.length;i++){
		if(inputObject[i].checked){
			exhaustArray.push(inputObject[i].parentNode.value);
		}
	}
	for (var i=0;i<collapseInputObject.length;i++){
		if(collapseInputObject[i].checked){
			exhaustArray.push(collapseInputObject[i].parentNode.value);
		}
	}
	return exhaustArray;
}
var getColor = function(){
	var spanArray		 	= new Array();
	var colorArray 			= new Array();
	var colorObject 		= document.getElementById('colorDivList');
	var collapseColorObject = document.getElementById('collapseColorDivList');
	var inputObject  		= colorObject.getElementsByTagName("input");
	var collapseInputObject = collapseColorObject.getElementsByTagName("input");
	for (var i=0;i<inputObject.length;i++){
		if(inputObject[i].checked){
			colorArray.push(inputObject[i].parentNode.value);
		}
	}
	for (var i=0;i<collapseInputObject.length;i++){
		if(collapseInputObject[i].checked){
			colorArray.push(collapseInputObject[i].parentNode.value);
		}
	}
	return colorArray;
}

var getColorByColorNm = function(colorNm){
	
	var colorClassName = '';
	if(colorNm.indexOf("白") >= 0)   colorClassName = 'white';
	if(colorNm.indexOf("橙") >= 0)   colorClassName = 'orange';
	if(colorNm.indexOf("粉") >= 0)   colorClassName = 'pink';
	if(colorNm.indexOf("褐") >= 0)   colorClassName = 'brown';
	if(colorNm.indexOf("黑") >= 0)   colorClassName = 'black';
	if(colorNm.indexOf("红") >= 0)   colorClassName = 'red';
	if(colorNm.indexOf("黄") >= 0)   colorClassName = 'yellow';
	if(colorNm.indexOf("灰") >= 0)   colorClassName = 'grey';
	if(colorNm.indexOf("蓝") >= 0)   colorClassName = 'blue';
	if(colorNm.indexOf("青") >= 0)   colorClassName = 'cyan';
	if(colorNm.indexOf("银") >= 0)   colorClassName = 'silver';
	if(colorNm.indexOf("紫") >= 0)   colorClassName = 'purple';
	if(colorNm.indexOf("绿") >= 0)   colorClassName = 'green';
	if(colorNm.indexOf("金") >= 0)   colorClassName = 'gold';
	
	return colorClassName
}

var dayRangeCheck = function(){
	// Start Date <= End Date Check
	// Start Date ~ End Date, not exceed 1 Month Check
	return dateCompareLeCheck(dbDateFromObj.value, dbDateToObj.value, "开始日", "结束日")
		&& monthsIntevalCheck(dayFromPickerObj.innerHTML, dayToPickerObj.innerHTML, 1, "日期");
}

var monthRangeCheck = function(){
	// Start Date <= End Date Check
	// Start Date ~ End Date, not exceed 1 Month Check
	return dateCompareLeCheck(dbMonthFromObj.value, dbMonthToObj.value, "开始月", "结束月")
		&& yearsIntevalCheck(monthFromPickerObj.innerHTML, monthToPickerObj.innerHTML, 1, "月份");
}

var showMoreExhaust = function(){
	var showMoreExhaustObj = document.getElementById("showMoreExhaust");
	showMoreExhaustObj.addEventListener('tap',function(){
		$("#collapseExhaustDivList").slideToggle("fast");
	});
}
var showMoreColor = function(){
	var showMoreColorObj = document.getElementById("showMoreColor");
	showMoreColorObj.addEventListener('tap',function(){
		$("#collapseColorDivList").slideToggle("fast");
	});
}

var thisMainDealerHelper = function(pickerId, parentIdObj, isNoDataSecurityObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		mainDealerPicker  = new mui.PopPicker();
		pickerData   	  = [];
		if (typeof(isNoDataSecurityObj) != "undefined" && isNoDataSecurityObj.value) {
			pickerData = mainDealer;
		} else {
			for (var i=0; i<mainDealer.length; i++) {
				if (mainDealer[i].id == "" || $.inArray(mainDealer[i].grandParentId, localOrgList) 			!= -1 
				 						   || $.inArray(mainDealer[i].parentId, 	 localOrgList) 			!= -1
				 						   || $.inArray(mainDealer[i].id, 	    	 localMainDealerList) 	!= -1) {
					pickerData.push(mainDealer[i]);
				}
			}
		}
		mainDealerPicker.setData(filterDataByParentId(parentIdValue, pickerData));
		return showPicker(mainDealerPicker, pickerId,function(){
			dealerCdObj.value = "";
			//initial city & subDealer data
			cleanCityAndSubDl();
		});
	}, false);
}

var canalCityHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		//if input area of dealerCd is focus, return
		if (isDealerCdFocus) return;
		
		var pickerData = [];
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		
		if(typeof(canalCityPicker) == "undefined" || canalCityPicker == null){
			canalCityPicker = new mui.PopPicker();
		}
		parentIdValue=="" ? pickerData = [{"id":"","name":"请选择地区"}]
						  : pickerData = filterDataByParentId(parentIdValue, canalCity);
		canalCityPicker.setData(pickerData);
		return showPicker(canalCityPicker, pickerId,function(){
			subDealerIdObj.value 		 = "";
			subDealerPickerObj.innerHTML = "请选择分销渠道";
			subDealerPickerObj.classList.remove("common-font");
			//If canalCity is not blank,disable checkbox
			resetCheckBox();
		});
	}, false);
}

var subDealerHelper = function(pickerId, parentIdObj, canalCityIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var pickerData = [];
		var parentIdValue 	   = ((typeof(parentIdObj) 	  == "undefined" || parentIdObj    == null) ? "":parentIdObj.value);
		var canalCityIdValue   = ((typeof(canalCityIdObj) == "undefined" || canalCityIdObj == null) ? "":canalCityIdObj.value);
		if(typeof(subDealerPicker) == "undefined" || subDealerPicker == null){
			subDealerPicker = new mui.PopPicker();
		}
		
		var combineSubDealer = combineSubDealerData(subDealer,subSubDealer);
		
		canalCityIdValue == "" ? pickerData = [{"id":"","name":"请选择分销渠道"}]
							   : pickerData = filterSubDlByCityId(canalCityIdValue, combineSubDealer)
		
		subDealerPicker.setData(pickerData);
		return showPicker(subDealerPicker, pickerId);
	}, false);
}

var filterSubDlByCityId = function(canalCityIdValue, subDealerArr){
	
	var pickerData = [];
	for(var i=0;i<subDealerArr.length;i++){
		if (subDealerArr[i].id=="" || canalCityIdValue==subDealerArr[i].cityId){
			pickerData.push(subDealerArr[i]);
		}
	}
	return pickerData;
}

var combineSubDealerData = function(sourceDataArr1,sourceDataArr2){
	
	for(var i=0;i<sourceDataArr2.length;i++){
		if (sourceDataArr2[i].id==""){
			//删除id为空的项
			sourceDataArr2.splice(i,1);
		}
	}
	sourceDataArr1 = sourceDataArr1.concat(sourceDataArr2);
	return sourceDataArr1;
}

var getDealerId = function() {
	var dealerCd = dealerCdObj.value.trim().toUpperCase();
	var loseFocusData = filterMainDlByDealerCd(dealerCd,mainDealer)
	
	if ( typeof(loseFocusData[0]) == "undefined" || typeof(loseFocusData[0].id) == "undefined" || loseFocusData[0].id == "") {
		mui.toast("渠道代码无效，请重新输入")
	} else {
		dealerIdObj.value 			= loseFocusData[0].id;
		dealerPickerObj.innerHTML   = loseFocusData[0].name;
 		dealerPickerObj.classList.add("common-font");
 		//initial city & subDealer data
		cleanCityAndSubDl();
	}
}

var filterMainDlByDealerCd = function(targetCdValue, sourceDataArr){
	
	var returnData = [];
	for(var i=0;i<sourceDataArr.length;i++){
		if (targetCdValue==sourceDataArr[i].code){
			returnData.push(sourceDataArr[i]);
		}
	}
	return returnData;
}

function resetCheckBox(){
	
	if (psiTypeDealerRadioObj.value == "1" || canalCityIdObj.value != "") {
		
		showDlDataCbObj.checked     = false;
		showSubDlDataCbObj.checked  = true;
		showDlDataCbObj.disabled    = true;
		showSubDlDataCbObj.disabled = true;
	}else{
		showDlDataCbObj.disabled    = false;
		showSubDlDataCbObj.disabled = false;
	}
}

function cleanCityAndSubDl(){
	
	canalCityIdObj.value 		 = "";
	canalCityPickerObj.innerHTML = "请选择地区";
	canalCityPickerObj.classList.remove("common-font");
	
	subDealerIdObj.value 		 = "";
	subDealerPickerObj.innerHTML = "请选择分销渠道";
	subDealerPickerObj.classList.remove("common-font");
}
