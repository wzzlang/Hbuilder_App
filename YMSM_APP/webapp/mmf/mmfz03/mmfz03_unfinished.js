var tabObj			   = document.getElementById("inOutUnfinishied");
var shipmentTabObj	   = document.getElementById("shipmentTab");
var receivementTabObj  = document.getElementById("receiveTab");
var shipListContainObj = document.getElementById("shipListContain");
var recvListContainObj = document.getElementById("recvListContain");
var submitBtnObj 	   = document.getElementById("submitBtn");
var footInfoAreaObj    = document.getElementById("footInfoArea");
var totalWbQtyObj 	   = document.getElementById("totalWbQty");
var localData          = eval('('+localStorage.getItem("localData")+')');
var habitSetDataObj    = eval('('+localStorage.getItem("habitSetData")+')');
var requestUrl         = "mmf/mmfz03/MMFZ03Backlog";
var confirmUrl		   = "mmf/mmfz03/MMFZ03AllShipReceive";
var recvRetrieveFlg    = false;
var chooseWbQty        = 0 ;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		
		// Move in from Msg Info scrren
		var currWebview = plus.webview.currentWebview();
		if (typeof(currWebview.shipmentId) != "undefined") {
			tabObj.style.display = "none";	
			retrieveDataFromDb(eval(JSON.stringify(currWebview.shipRecvFlg))
							  ,eval(JSON.stringify(currWebview.shipmentId)));			  
		// Move in from Menu
		} else {
			retrieveShipment();
			retrieveRecvment();
		}
		confirmEvent();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function retrieveShipment(){
	var shipRecvFlg = "1"
	retrieveDataFromDb(shipRecvFlg, "");
	recvListContainObj.className = 'hidden';
	shipmentTabObj.addEventListener('tap', function(event) {
		recvListContainObj.style.display="none";
		shipListContainObj.style.display="block";
		footInfoAreaObj.style.display = "none"
	}, false);
}

function retrieveRecvment(){
	receivementTabObj.addEventListener('tap', function(event) {
		
		if(!recvRetrieveFlg){
			
			recvRetrieveFlg = true;
			var shipRecvFlg = "2"
			retrieveDataFromDb(shipRecvFlg, "");
		}
		recvListContainObj.style.display="block";
		shipListContainObj.style.display="none";
		
		//"2":subDealer;判断为分销商用户时，显示底部内容
		localData.dealerType == "2" ? footInfoAreaObj.style.display = "block"
									: footInfoAreaObj.style.display = "none"
	}, false);
}

function retrieveDataFromDb(shipRecvFlg, shipmentId){
	
	var para= {
		userId      : localData.userId,
		shipRecvFlg : shipRecvFlg,
		shipmentId  : shipmentId
	};
	var returnData= post_ajax(requestUrl,para,function(returnData){
		var fragment = document.createDocumentFragment();
		//循环填充数据
		$.each(returnData.details, function (i, item) {
			div = document.createElement('div');
			div.className = 'cur-list-margin';
			div.innerHTML = waybillContainHTML(shipRecvFlg,item,i);
			fragment.appendChild(div);
		});
		
		if(shipRecvFlg == "1"){
			
			shipListContainObj.appendChild(fragment);
		}
		if(shipRecvFlg == "2"){
			
			if (localData.dealerType == "2") {//subDealer
				//底部空白行，防止底部信息被遮挡
				var lastDiv = document.createElement('div');
				lastDiv.style.marginTop = "60px";
				fragment.appendChild(lastDiv);
			} 
			//检索结果显示在画面上
			recvListContainObj.appendChild(fragment);
			//点击checkBox改变选定运单数量
			changeQtyEvent();
		}
		
		if (shipmentId != "" && returnData.details.length == 0) {
			mui.alert("无未完成运单!", function(){mui.back();});
		}
	});
}

var waybillContainHTML = function(shipRecvFlg,item,i){
	
	var checkBoxShow   = "";
	var waybillClass   = "";
	if (localData.dealerType == "2" & shipRecvFlg == 2) {
		checkBoxShow = 'style = "display:block;"';
		waybillClass = "cur-padding-left";
	}
	
	var waybillContainHTML = '<div class="mui-input-row mui-checkbox cur-check-box hidden" '+checkBoxShow+'>'
								+'<label style="height: 60px;">&nbsp;</label>'
								+'<input id="checkWb_'+i+'" style="top: 22px;" name="checkWb" type="checkbox">'
								+'<input id="waybillNo_'+i+'" value="'+item.waybillNo+'" class="hidden"/>'
							+'</div>'
	 						+'<ul class="common-table-view">'
		                        +'<li class="mui-table-view-cell collapse-context mui-collapse">'
		                        	+'<a class="mui-navigate-right" style="margin: -22px -15px;">'
		                        		+'<span class="'+waybillClass+'">运单号：'+item.waybillNo +'</span>'
		                        		+'<span class="cur-date-pad '+waybillClass+'">'+item.processDate+'</span>'
		                        		+'<span class="cur-date-pad '+waybillClass+'">'+ dealerNmShowState(shipRecvFlg , item) +'</span>'
		                        		+'<span class="mui-badge mui-badge-red f12" style="-webkit-transform:translateY(-110%);transform:translateY(-110%);">总合计：'+formatNumber(item.totalQty)+'</span>'
		                        		+'<span class="mui-badge mui-badge-red f12" style="-webkit-transform:translateY(6%);transform:translateY(6%);">未完成：'+formatNumber(item.unReceivedQty)+'</span>'
		                        	+'</a>'
		                        	+'<div class="mui-collapse-content">'
		                        		+'<form class="mui-input-group">'
		                        			+'<div class="mui-content-padded">'
												+'<div id="detailContain">'
													//detailContain
													+ constructDetailHTML(item)
												+'</div>'
											+'</div>'
										+'</form>'
									+'</div>'
								+'</li>'
							+'</ul>'
	return waybillContainHTML;
}

function constructDetailHTML(item){
	
	var detailContainHTMLs = '<li></li>';
	
	//循环构造detail数据
	$.each(item.productDetails, function (i, productDetail) {
		
		detailContainHTMLs = detailContainHTMLs + constructProductDetail(productDetail);
	});
	return detailContainHTMLs;
}

function constructProductDetail(productDetail){
	
	var	productDetailsHTMLs = '<li class="com-sub-title-area">'
								+ '<div class="mui-table">'
									+ '<div class="mui-table-cell mui-col-xs-6">'
										+ '<h5 class="common-font common-font-bold" style="line-height:1.2;">'+ operateModelShow(productDetail) + '</h5>'
									+ '</div>'
									+ '<div class="mui-table-cell mui-col-xs-1 mui-text-right com-vertical-middle">'
										+ '<h5 class="common-font common-font-bold">'+productDetail.qty+'&nbsp;&nbsp;</h5>'
									+ '</div>'
								+ '</div>'
							+ '</li>'
							+ constructFrameDetail(productDetail);
	return productDetailsHTMLs;
}

function constructFrameDetail(item){
	var frameDetailsHTMLs = '<li></li>';
	$.each(item.frameDetails, function (i, frameDetail) {
		
		frameDetailsHTMLs = frameDetailsHTMLs + detailContainHTML(frameDetail);
	});
	return frameDetailsHTMLs;
}

var detailContainHTML = function(itemDetail){
	
	var recvFlgNmColor;
	itemDetail.recvFlg == 0 ? recvFlgNmColor = '<span class="txt-contain-pink">' + itemDetail.recvFlgNm + '</span>'
							: recvFlgNmColor = '<span class="txt-contain-grey">' + itemDetail.recvFlgNm + '</span>'
							
	var detailContainHTML ='<li class="mui-table-view-cell common-font com-sub-sub-area cur-sub-area" style="padding-left:12%;">'
							+ '<span>' + itemDetail.frameNo + '</span>' 
						    + recvFlgNmColor 
						  +'</li>'
	return detailContainHTML;
}

var dealerNmShowState = function(shipRecvFlg , item){
	
	var dealerNmHTML;
	if (shipRecvFlg == 1){
		dealerNmHTML = '<h5 class = "common-font cur-txt-grey f12" style="padding-bottom:3px">&nbsp&nbsp&nbsp&nbsp客户:&nbsp'+item.dealerAbbNm+'</h5>'
		             + '<h5 class = "common-font cur-txt-grey f12">收货人:&nbsp'+item.consigneeAbbNm+'</h5>'
	}else{
		dealerNmHTML = '<h5 class = "common-font cur-txt-grey f12">发货人:&nbsp'+item.shipperName+'</h5>'
	}
	return dealerNmHTML;
}

/**
 * 处理机型显示类型：机型代码/机型名称
 */
var operateModelShow = function (item) {
	var modelNmDisp = habitSetDataObj.modelNmDisp;
	var modelCdDisp = habitSetDataObj.modelCdDisp;
	var modelShowUp  = item.modelNm;
	 
	if (modelNmDisp == "1") {
		
		modelShowUp = item.modelNm + '&nbsp&nbsp' + item.colorNm;
	}
	if (modelCdDisp == "1") {
	
		modelShowUp = item.productCd + '&nbsp&nbsp';
	}
	if (modelNmDisp == "1" && modelCdDisp == "1") {
		
		item.productCd.trim() == '' ? modelShowUp = item.modelNm + '&nbsp&nbsp' + item.colorNm
							 		: modelShowUp = item.productCd + '</br>' + item.modelNm + '&nbsp&nbsp' + item.colorNm
	}
    return modelShowUp;
}

function changeQtyEvent(){
	
	mui('.mui-checkbox').on('change', 'input', function() {
		if (this.checked) {
			//展车数量+1
			chooseWbQty = chooseWbQty + 1;
			//set current show type value
			this.value = "1";//展车
		} else {
			chooseWbQty = chooseWbQty - 1;
			//set current show type value
			this.value = "0";//非展车
		}
		totalWbQtyObj.innerText = chooseWbQty;
	});
}

function confirmEvent(){
	
	submitBtnObj.addEventListener('tap',function(event){
		
		var waybillNoArr = [];
		var recvListObj  = recvListContainObj.getElementsByTagName('ul');
		for (var i=0; i<recvListObj.length; i++) {
			
			var wbChecked   =  document.getElementById("checkWb_"+i+"").value;
			if (wbChecked == "1") {
				var waybillNo   =  document.getElementById("waybillNo_"+i+"").value;
				waybillNoArr.push(waybillNo);
			}
		}
		if (waybillNoArr.length == 0){
			mui.toast("请选择运单")
			return;
		};
		var para = {userId       	   : localData.userId
				   ,waybillNoArr 	   : waybillNoArr};
		//后台获取数据
		var returnData= post_ajax(confirmUrl,para,function(returnData){
			
			if (returnData.successFlag == "1") {
				//还原内容及选择的数量
				recvListContainObj.innerHTML = "";
				chooseWbQty = 0 ;
				totalWbQtyObj.innerText = chooseWbQty;
				//重新检索
				var shipRecvFlg = "2";//入库
				retrieveDataFromDb(shipRecvFlg, "");
				mui.toast('提交成功');
			} else {
				mui.toast("提交失败！请重试");
			}
		});
	},false);
}