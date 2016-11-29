var scanBarcodeIconObj	  = document.getElementById("scanBarcodeIcon");
var barcodeListObj	      = document.getElementById("barcodeList");
var submitBtnObj          = document.getElementById("submitBtn");
var segmentedControlObj	  = document.getElementById("segmentedControl");
var adjustmentTabObj	  = document.getElementById("adjustmentTab");
var mainDealerPickerObj	  = document.getElementById("mainDealerPicker");
var mainDealerIdObj	      = document.getElementById("mainDealerId");
var subDealerPickerObj	  = document.getElementById("subDealerPicker");
var subDealerIdObj	      = document.getElementById("subDealerId");
var subSubDealerPickerObj = document.getElementById("subSubDealerPicker");
var subSubDealerIdObj	  = document.getElementById("subSubDealerId");
var consigneePickerObj	  = document.getElementById("consigneePicker");
var consigneeIdObj	      = document.getElementById("consigneeId");
var whPickerObj	          = document.getElementById("whPicker");
var whIdObj   	          = document.getElementById("whId");
var footTotalObj          = document.getElementById("footTotal");
var cleanAllObj	          = document.getElementById("cleanAll");
var frameInfoDetailObj	  = document.getElementById("frameInfoDetail");
var dealerIdObj           = document.createElement("input");
var admOrgIdObj           = document.createElement("input");
var admDealerIdObj        = document.createElement("input");
var admSubDealerIdObj     = document.createElement("input");
var submitURL             = "mmf/mmfa02/MMFA02ShipmentService/showFrameList";
var confirmURL            = "mmf/mmfa02/MMFA02ShipmentService";
var barcolist = [];
var userId;
var para;
var dealerType;
var habitSetDataObj;
var localDataObj;
var productIdArr = [];
var isNoDataSecurityMainDealerObj   = new Object();
var isNoDataSecuritySubDealerObj    = new Object();
var isNoDataSecuritySubSubDealerObj = new Object();
var indexClickBefore = 0;
var subjectWholeSales = "01";
var subjectRetail 	  = "02";
var subjectAllot 	  = "03";
var subjectReturn 	  = "04";
var subjectOther 	  = "05";

var DISPLAY 	= "";
var NONEDISPLAY = "none";

(function($, doc) {
	$.init();
	$.plusReady(function() {
		initialSetting();
		getInitialData();
		helperEvent();
		showHelperByTab();
		scanBarcode();
		cleanAllRecode();
		submitEvent();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function initialSetting(){
	//设置弹窗可滑动
	mui('.mui-scroll-wrapper').scroll();
}

function getInitialData() {
	habitSetDataObj = eval('('+localStorage.getItem("habitSetData")+')');
	localDataObj    = eval('('+localStorage.getItem("localData")+')');
	
	userId 	        = localDataObj.userId;
	admOrgId        = localDataObj.admOrgId;
	admDealerId     = localDataObj.admDealerId;
	admSubDealerId  = localDataObj.admSubDealerId;
	dealerType      = localDataObj.dealerType;
	subDlAgentType  = localDataObj.subDlAgentType;
	
	admOrgIdObj.value 		  = admOrgId;
	admDealerIdObj.value 	  = admDealerId;
	admSubDealerIdObj.value   = admSubDealerId;
	segmentedControlObj.value = subjectRetail;
	
	//初始化界面
	initializScreen();
}

function helperEvent() {
	
	var isNoDataSecurity;
	
	mainDealerHelper("mainDealerPicker", 	admOrgIdObj, 		isNoDataSecurityMainDealerObj);
	subDealerHelper("subDealerPicker",		admDealerIdObj, 	isNoDataSecuritySubDealerObj);
	subSubDealerHelper("subSubDealerPicker",admSubDealerIdObj, 	isNoDataSecuritySubSubDealerObj);
	consigneeHelperReWrite("consigneePicker");
	allWhHelper("whPicker");
}

function showHelperByTab() {
	var list = segmentedControlObj.getElementsByTagName('a');
	for(var i = 0;i<list.length;i++){
		list[i].index = i;
		list[i].addEventListener("tap", function(){
			
			if (indexClickBefore == this.index) return;

			switch (this.index){
				case 0:
					segmentedControlObj.value 				= subjectRetail;
					mainDealerPickerObj.style.display		=NONEDISPLAY;
					subDealerPickerObj.style.display		=NONEDISPLAY;
					subSubDealerPickerObj.style.display 	=NONEDISPLAY;
					consigneePickerObj.style.display		=NONEDISPLAY;
					whPickerObj.style.display	        	=NONEDISPLAY;
				break;
				case 1:
					segmentedControlObj.value 				= subjectWholeSales;
					consigneePickerObj.style.display		=DISPLAY;
					whPickerObj.style.display	        	=NONEDISPLAY;
					if(dealerType == "1") { // Main Dealer
						if(subDlAgentType == "1"){ //Direct Dealer
							subDealerPickerObj.style.display	  =NONEDISPLAY;
							mainDealerPickerObj.style.display	  =NONEDISPLAY;
							subSubDealerPickerObj.style.display   =DISPLAY;
							isNoDataSecuritySubSubDealerObj.value = false;
						}else{
							mainDealerPickerObj.style.display	=NONEDISPLAY;
							subDealerPickerObj.style.display	=DISPLAY;
							subSubDealerPickerObj.style.display =NONEDISPLAY;
							isNoDataSecuritySubDealerObj.value	= false;
						}		
					}
					if(dealerType == "2") { // Sub Dealer
						mainDealerPickerObj.style.display	  =NONEDISPLAY;
						subDealerPickerObj.style.display	  =NONEDISPLAY;
						subSubDealerPickerObj.style.display   =DISPLAY;
						isNoDataSecuritySubSubDealerObj.value = false;
					}
					if(dealerType == "6") { // Sub Sub Dealer
						mainDealerPickerObj.style.display	=NONEDISPLAY;
						subDealerPickerObj.style.display	=NONEDISPLAY;
						subSubDealerPickerObj.style.display =NONEDISPLAY;
					}
					cleanConsignee();
				break;
				case 2:
					segmentedControlObj.value 				= subjectAllot;
					consigneePickerObj.style.display		=DISPLAY;
					whPickerObj.style.display	        	=NONEDISPLAY;
					if(dealerType == "1") { // Main Dealer
						if (subDlAgentType == "1"){ //Direct Dealer
							mainDealerPickerObj.style.display	=NONEDISPLAY;
							subDealerPickerObj.style.display	=DISPLAY;
							subSubDealerPickerObj.style.display =NONEDISPLAY;
							isNoDataSecuritySubDealerObj.value	= true;
						}else{
							mainDealerPickerObj.style.display	=DISPLAY;
							subDealerPickerObj.style.display	=NONEDISPLAY;
							subSubDealerPickerObj.style.display =NONEDISPLAY;
							isNoDataSecurityMainDealerObj.value	= true;
						}
					}
					if(dealerType == "2") { // Sub Dealer
						mainDealerPickerObj.style.display	=NONEDISPLAY;
						subDealerPickerObj.style.display	=DISPLAY;
						subSubDealerPickerObj.style.display =NONEDISPLAY;
						isNoDataSecuritySubDealerObj.value	= true;
					}
					if(dealerType == "6") { // Sub Sub Dealer
						mainDealerPickerObj.style.display	 =NONEDISPLAY;
						subDealerPickerObj.style.display	 =NONEDISPLAY;
						subSubDealerPickerObj.style.display  =DISPLAY;
						isNoDataSecuritySubSubDealerObj.value= true;
					}
					cleanConsignee();
				break;
				case 3:
					segmentedControlObj.value 				= subjectReturn;
					mainDealerPickerObj.style.display		=NONEDISPLAY;
					subDealerPickerObj.style.display		=NONEDISPLAY;
					subSubDealerPickerObj.style.display 	=NONEDISPLAY;
					consigneePickerObj.style.display		=NONEDISPLAY;
					whPickerObj.style.display	        	=DISPLAY;
				break;
				case 4:
					segmentedControlObj.value 			= subjectOther;
					mainDealerPickerObj.style.display	=NONEDISPLAY;
					subDealerPickerObj.style.display	=NONEDISPLAY;
					subSubDealerPickerObj.style.display =NONEDISPLAY;
					consigneePickerObj.style.display	=NONEDISPLAY;
					whPickerObj.style.display	        =NONEDISPLAY;
				break;
			}
			
			indexClickBefore = this.index;
		});	
	}
}

function scanBarcode(){
	scanBarcodeIconObj.addEventListener('tap', function(event) {
		
		clicked('../common/commonScan.html',true,true);
	}, false);
}

//扫描后的处理
function scaned( type, result, file ) {
	
	var i = barcolist.length;
	var times = scanedTime();
	var fragment = document.createDocumentFragment();
	li = document.createElement("li");
	li.id = i;
	li.className = "barcodeItem";
	li.innerHTML = barcodeListHTML(result,times,i);
	fragment.appendChild(li);
	barcodeListObj.insertBefore(fragment,barcodeListObj.childNodes[0]);
	barcolist[barcolist.length] = {type:type,result:result,file:file};
	updateTotalQty();
}

function cleanAllRecode(){
	cleanAllObj.addEventListener('tap', function(event) {
		plus.nativeUI.confirm( "是否清空全部", function (i) {
			var barcoLi=barcodeListObj.getElementsByTagName('li');
			if ( i.index == 0 & barcoLi.length > 0 ) {
				$(barcodeListObj).empty(); 
				updateTotalQty();
			}
		}, "", ["确定","取消"] );
	}, false);
}

function submitEvent() {
	submitBtnObj.addEventListener('tap', function(event) {
		// Prepare Parameter
		frameInfoDetailObj.innerHTML = '';
		productIdArr = [];
		var frameNoArr  = getBarcodeArr();
		var para = {frameNoArr : frameNoArr};
		post_ajax(submitURL, para, function(returnData){
			
			var dataExistFlg = false;
			//循环填充数据
			$.each(returnData.frameList, function (i, item) {
				var ul = document.createElement('ul');
				ul.className = 'mui-table-view';
				ul.innerHTML = frameInfoHTML(item)
				frameInfoDetailObj.appendChild(ul);
				
				dataExistFlg = true;
			});
			
			var confirmBtn = document.createElement('button');
			confirmBtn.className = 'mui-btn common-btn-block common-btn-retrieve com-btn-position com-btn-comf-right';
			confirmBtn.innerHTML = '确认提交';
			confirmBtn.style.display = (dataExistFlg ? "block" : "none");
			confirmBtn.id = 'confirmBtn';
			frameInfoDetailObj.appendChild(confirmBtn);
			
			var cancelBtn = document.createElement('button');
			cancelBtn.className = 'mui-btn common-btn-block common-btn-retrieve com-btn-position com-btn-canc-left';
			cancelBtn.innerHTML = '取消';
			cancelBtn.style.display = (dataExistFlg ? "block" : "none");
			cancelBtn.id = 'cancelBtn';
			frameInfoDetailObj.appendChild(cancelBtn);
			
			
			//关闭弹窗
			if (!dataExistFlg) {
				mui.alert("请扫描车架号!", function(){
					mui('#frameInfoContain').popover('hide');
				});
			}
			
			confirmEvent();
			cancelEvent();
		});
	}, false);
}

function confirmEvent () {
	
	document.getElementById("confirmBtn").addEventListener('tap', function(event) {

		var lis=barcodeListObj.getElementsByTagName('li');
		// No Barcode Exist, show error & return
		if(lis.length == 0){
			mui.toast('请扫描后再提交');
			return;
		}
		
		// Prepare Parameter
		var frameNoArr  = getBarcodeArr();
		var scanTimeArr = getScanTimeArr();
		prepareSubmitData(frameNoArr, scanTimeArr);
		if(!customerMustInputCheck()) return;
		// check the repeat of scaned result
		if(barcodeRepeatCheck(frameNoArr)) return;
		
		post_ajax(confirmURL, para, function(returnData){
			
			if (returnData.showWarningFlg == "1") {
				mui.toast("调拨车架将要退货!")
			}
			
			if(returnData.errList.length > 0){
				
				var btnArray = ['否', '是'];
				mui.confirm('出库信息已存在{' + returnData.errList + '},是否继续？', '', btnArray, function(e) {
					if (e.index == 0) return;
					var continueFlg = '0';
					
					var continuePara = {userId   		: para.userId
						               ,shippingSubject : para.shippingSubject
						               ,customerId  	: para.customerId
						               ,consigneeId 	: para.consigneeId
						               ,whId        	: para.whId
						               ,frameNoArr  	: para.frameNoArr
						               ,productIdArr 	: para.productIdArr
						               ,continueFlg     : continueFlg};
		   
					post_ajax(confirmURL, continuePara, function(returnData){
							
						if(returnData.successFlag == "1"){
							mui.toast('提交成功!');
							//关闭弹窗
							mui('#frameInfoContain').popover('hide');
							$(barcodeListObj).empty();
							updateTotalQty();
						}else{
							mui.toast('提交失败!');
						}
					});
				})
			}else{
				if(returnData.successFlag == "1"){
					mui.toast('提交成功!');
					//关闭弹窗
					mui('#frameInfoContain').popover('hide');
					$(barcodeListObj).empty();
					updateTotalQty();
				}else{
					mui.toast('提交失败!');
				}
			}
		});
	}, false);
}

function cancelEvent(){
	
	document.getElementById("cancelBtn").addEventListener('tap', function(event) {
		
		mui('#frameInfoContain').popover('hide');
	}, false);
}

var prepareSubmitData = function(frameNoArr, scanTimeArr){
	
	var mainDealerId  	= mainDealerIdObj.value;
	var subDealerId  	= subDealerIdObj.value;
	var subSubDealerId  = subSubDealerIdObj.value;
	var customerId		= "";
	var consigneeId 	= "";
	var whId        	= "";
	
	if (mainDealerPickerObj.style.display 	== DISPLAY) {customerId  = mainDealerId;}
	if (subDealerPickerObj.style.display 	== DISPLAY) {customerId  = subDealerId;}
	if (subSubDealerPickerObj.style.display == DISPLAY) {customerId  = subSubDealerId;}
	if (consigneePickerObj.style.display 	== DISPLAY) {consigneeId = consigneeIdObj.value;}
	if (whPickerObj.style.display 			== DISPLAY) {whId 		 = whIdObj.value;}
	
	para = {userId   		: userId
		   ,shippingSubject : segmentedControlObj.value
		   ,customerId  	: customerId
		   ,consigneeId 	: consigneeId
		   ,whId        	: whId
		   ,frameNoArr  	: frameNoArr
		   ,productIdArr    : productIdArr}
}

//删除选中行
function deleteRow( Id ) {
	
	plus.nativeUI.confirm( "是否删除此车架号", function (i) {
		
		if ( i.index == 0 ) {
				var barcodeRowObj = document.getElementById(Id);
				barcodeRowObj.parentNode.removeChild(barcodeRowObj); 
				updateTotalQty();
		}
	}, "", ["确定","取消"] );
}

var scanedTime = function(){
	
	var sysDate = new Date();
	var h =sysDate.getHours()
	   ,m =sysDate.getMinutes()
	if ( h < 10 ) { h='0'+h; }
	if ( m < 10 ) { m='0'+m; }
	var time = h +''+ m;
	return time;
}

function updateTotalQty() {
	var lis=barcodeListObj.getElementsByTagName('li');
	document.getElementById("recordCount").innerHTML=lis.length;
	
	if(lis.length==0){
		footTotalObj.style.display		=NONEDISPLAY;
	}else{
		footTotalObj.style.display		=DISPLAY;
	}
}


var customerMustInputCheck = function() {
	
	if(mainDealerPickerObj.style.display == DISPLAY) 	return mustInputCheck(para.customerId, "客户");
	if(subDealerPickerObj.style.display == DISPLAY) 	return mustInputCheck(para.customerId, "客户");
	if(subSubDealerPickerObj.style.display == DISPLAY) 	return mustInputCheck(para.customerId, "客户");
	if(whPickerObj.style.display == DISPLAY) 			return mustInputCheck(para.whId, "仓库");
	return true;
}

var barcodeRepeatCheck = function(arr) {
	
	var temp = arr.join(",")+",";

	for(var i=0;i<arr.length;i++) {
	
		if(temp.replace(arr[i]+",","").indexOf(arr[i]+",")>-1) {
		
			mui.toast("您已重复扫描,请确认(" + arr[i] + ")!")
			return true;
		}
	} 
	return false;
}

var barcodeListHTML = function(result,times,i){
	
	var barcodeListHTML = '<div>'
							+ '<span id="frameNo_'+i+'" class="frameNo">'+ result +'</span>'
							+ '<span id="deleteRow_'+i+'" class="mui-icon mui-icon-minus" style="float: right;" onclick="deleteRow('+i+')"></span>'
							+ '<span id="scanedTime_'+i+'" class="scanedTime" style="display:none">'+times+'</span>'
						+ '</div>'
	return barcodeListHTML;
}

//获取前台barcode数组
var getBarcodeArr = function(){
	
	var frameNoArr = [];
	$(document).ready(function(){
		$(this).find(".frameNo").each(function(){
			frameNoArr.push($(this).text().trim());
		});
	});
	return frameNoArr;
}

//获取前台time数组
var getScanTimeArr = function(){
	
	var scanTimeArr = [];
	$(document).ready(function(){
		$(this).find(".scanedTime").each(function(){
			scanTimeArr.push($(this).text().trim());
		});
	});
	return scanTimeArr;
}

var consigneeHelperReWrite = function(pickerId){
	
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = "";
		if (mainDealerPickerObj.style.display 	== DISPLAY)  parentIdValue = mainDealerIdObj.value;
		if (subDealerPickerObj.style.display 	== DISPLAY)  parentIdValue = subDealerIdObj.value;
		if (subSubDealerPickerObj.style.display == DISPLAY)  parentIdValue = subSubDealerIdObj.value;
		consigneePicker = new mui.PopPicker();
		if (parentIdValue == "") {
			var pickerData = [];
			pickerData.push(consignee[0]);
			consigneePicker.setData(pickerData);
			return showPicker(consigneePicker, pickerId);
		}
		consigneePicker.setData(filterDataByParentId(parentIdValue, consignee));
		return showPicker(consigneePicker, pickerId);
	 }, false);
}

var cleanConsignee = function() {
	consigneePickerObj.innerHTML = "请选择收货人";
	consigneeIdObj.value = "";
}

var frameInfoHTML = function(item){
	
	
	var frameInfoHTMLs = '<div class="mui-card" style="margin:5px 5px;">'
							+ '<ul class="mui-table-view">'
								+ '<li class="mui-table-view-divider com-card-header">'
			                        +'<div class="mui-table">'
										+'<div class="mui-table-cell mui-col-xs-6">'
											+ '<h5 class = "common-font common-font-bold" style="line-height:1.2;">' 
											+ operateModelShow(item)
											+ '</h5>'
										+'</div>'
										+'<div class="mui-table-cell mui-col-xs-1 mui-text-right com-vertical-middle">'
											+ '<h5 class="common-font common-font-bold">'
											+ item.qty
											+ '&nbsp&nbsp&nbsp&nbsp&nbsp</h5>'
										+'</div>'
									+'</div>'
								+'</li>'
								+ constructDetailHTML(item)
							+ '</ul>'
						+ '</div>'
	return frameInfoHTMLs;
}

function constructDetailHTML(item){
	
	var detailContainHTMLs = '<li></li>';
	
	//循环构造detail数据
	$.each(item.frameList, function (i, itemDetail) {
		productIdArr.push(itemDetail.productId)
		
		detailContainHTMLs = detailContainHTMLs
						   + '<li class="mui-table-view-divider" style="background-color:#FFF">'
						   + 	'<div class="mui-table-cell mui-col-xs-2">'
						   + 		'<span class="common-font">'+ itemDetail.frameNo + '</span>'
						   + 	'</div>'
						   +	'<input id="productId_'+i+'" style="display:none" value="'+itemDetail.productId +'"></input>'
						   + '</li>';
	});
	
	return detailContainHTMLs;
}

/**
 * 处理机型显示类型：机型代码/机型名称
 */
var operateModelShow = function (item) {
	var modelNmDisp = habitSetDataObj.modelNmDisp;
	var modelCdDisp = habitSetDataObj.modelCdDisp;
	var modelShowUp  = item.modelNm;
	 
	if (modelNmDisp == "1") {
		
		modelShowUp = item.modelNm + '</br>' + item.colorNm;
	}
	if (modelCdDisp == "1") {
	
		modelShowUp = item.productCd;
	}
	if (modelNmDisp == "1" && modelCdDisp == "1") {
		
		modelShowUp = item.productCd + "</br>" + item.modelNm + '</br>' + item.colorNm;
	}
    return modelShowUp;
}

//显示所有仓库
var allWhHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(whPicker) == "undefined" || whPicker == null){
			var whPicker   = new mui.PopPicker();
			pickerData = [];
			for(var i=0; i<wh.length; i++) {
				pickerData.push(wh[i]);
			}
			whPicker.setData(pickerData);
		}
		return showPicker(whPicker, pickerId);
	}, false);
}

//初始化界面
function initializScreen(){
	
	if(dealerType == "2") { // Sub Dealer
		adjustmentTabObj.style.display = "none";
	}
	if(dealerType == "6") { // Sub Sub Dealer
		adjustmentTabObj.style.display = "none";
	}
}
