var scanBarcodeIconObj	= document.getElementById("scanBarcodeIcon");
var barcodeListObj	    = document.getElementById("barcodeList");
var submitBtnObj        = document.getElementById("submitBtn");
var cleanAllObj         = document.getElementById("cleanAll");
var footTotalObj        = document.getElementById("footTotal");
var frameInfoDetailObj	= document.getElementById("frameInfoDetail");
var submitURL           = "mmf/mmfa01/MMFA01ReceivementService/showFrameList";
var confirmURL          = "mmf/mmfa01/MMFA01ReceivementService";
var barcolist = [];
var productIdArr = [];
var habitSetDataObj;
var userId;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		initialSetting();
		getInitialData();
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
	var localDataObj = eval('('+localStorage.getItem("localData")+')');
	habitSetDataObj  = eval('('+localStorage.getItem("habitSetData")+')');
	userId 	  = localDataObj.userId;
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
	li.id = "barcode_" + i;
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

function confirmEvent(){
	
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
		
		//check the repeat of scaned result
		if(barcodeRepeatCheck(frameNoArr)) return;
		
		connectToServer(frameNoArr,scanTimeArr);
		
	}, false);
}

function cancelEvent(){
	
	document.getElementById("cancelBtn").addEventListener('tap', function(event) {
		
		mui('#frameInfoContain').popover('hide');
	}, false);
}

//获取前台barcode数组
var getBarcodeArr = function(){
	
	var frameNoArr = [];
	$(document).ready(function(){
		$(this).find(".frameNo").each(function(){
			frameNoArr.push($(this).text().trim())
		});
	});
	return frameNoArr;
}

//获取前台time数组
var getScanTimeArr = function(){
	
	var scanTimeArr = [];
	$(document).ready(function(){
		
		$(this).find(".scanedTime").each(function(){
			scanTimeArr.push($(this).text().trim())
		});
	});
	
	return scanTimeArr;
}

var connectToServer = function(frameNoArr,scanTimeArr){
	var para = {userId       : userId
			   ,frameNoArr   : frameNoArr
			   ,productIdArr : productIdArr};
	post_ajax(confirmURL, para, function(returnData){
		
		if (returnData.errList.length == 0 && returnData.showWarningFlg == "0" && returnData.successFlag == "1") {
			mui.toast('提交成功!');
			//check email send status
			sendMailEvent(returnData);
			
			//关闭弹窗
			mui('#frameInfoContain').popover('hide');
			$(barcodeListObj).empty();
			updateTotalQty();
		} 
		
		if (returnData.successFlag == "0") mui.toast('提交失败!');
		
		continueCheck(returnData,frameNoArr,scanTimeArr);
	});
}

var continueCheck = function(returnDt,frameNoArr,scanTimeArr){
	
	if(returnDt.errList.length > 0) {
		
		var btnArray = ['否', '是'];
		mui.confirm('入库信息已存在{' + returnDt.errList + '},是否继续？', '', btnArray, function(e) {
			if (e.index == 0) return;
			var repeatContinueFlg = '0';
			var continuePara = {frameNoArr   : frameNoArr
	   				           ,productIdArr : productIdArr
					           ,repeatContinueFlg : repeatContinueFlg
							   ,userId      : userId};
			post_ajax(confirmURL, continuePara, function(returnData){
				
				if(returnData.showWarningFlg == "1"){
					
					shipInfoExistCheck(frameNoArr,scanTimeArr);
				}else{
					
					if(returnData.successFlag == "1"){
						mui.toast('提交成功!');
						//check email send status
						sendMailEvent(returnData);
						//关闭弹窗
						mui('#frameInfoContain').popover('hide');
						$(barcodeListObj).empty();
						updateTotalQty();
					}else{
						mui.toast('提交失败!');
					}
				}
				
			});
		})
	}else{
		if(returnDt.showWarningFlg == "1"){
			shipInfoExistCheck(frameNoArr,scanTimeArr);
		}
	}
}

var shipInfoExistCheck = function(frameNoArr,scanTimeArr){
	
	var btnArray = ['否', '是'];
	mui.confirm('部分车架未检测到出库信息,是否继续？', '', btnArray, function(e) {
		if (e.index == 0) return;
		var noShipContinueFlg = '0';
		var repeatContinueFlg = '0';
		var continuePara = {frameNoArr   : frameNoArr
   				           ,productIdArr : productIdArr
				           ,noShipContinueFlg : noShipContinueFlg
				           ,repeatContinueFlg : repeatContinueFlg
						   ,userId      : userId};
		post_ajax(confirmURL, continuePara, function(returnData){
			
			if(returnData.successFlag == "1"){
				mui.toast('提交成功!');
				//check email send status
				sendMailEvent(returnData);
				
				//关闭弹窗
				mui('#frameInfoContain').popover('hide');
				$(barcodeListObj).empty();
				updateTotalQty();
			}else{
				mui.toast('提交失败!');
			}
		});
	})
}

//删除选中行
function deleteRow( barcodeRowObj ) {
	plus.nativeUI.confirm( "是否删除此车架号", function (i) {
		
		if ( i.index == 0 ) {
			barcodeRowObj.parentNode.removeChild(barcodeRowObj); 
			updateTotalQty();
		}
	}, "", ["确定","取消"] );
}
function updateTotalQty() {
	var lis=barcodeListObj.getElementsByTagName('li');
	document.getElementById("recordCount").innerHTML=lis.length;
	
	if(lis.length==0){
		footTotalObj.style.display		="none";
	}else{
		footTotalObj.style.display		="block";
	}
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
							+ '<span id="deleteRow_'+i+'" class="mui-icon mui-icon-minus" style="float: right;" onclick="deleteRow(barcode_'+i+')"></span>'
							+ '<span id="scanedTime_'+i+'" class="scanedTime" style="display:none">'+times+'</span>'
						+ '</div>'
	return barcodeListHTML;
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

var sendMailEvent = function(returnData){
	if (returnData.showErrFlg == "0") {
		mui.alert('入库完成,信息已发送至发货方邮箱！');
	}
	if (returnData.showErrFlg == "1") {
		mui.alert('由于发货方邮箱地址非法,邮件发送失败！');
	}
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