var localData 			 = eval('('+localStorage.getItem("localData")+')');
var habitSetDataObj      = eval('('+localStorage.getItem("habitSetData")+')');
var waybillContainObj    = document.getElementById("waybillContain");
var sendToEmailBtnObj    = document.getElementById("sendToEmailBtn");
var deleteIconObj        = document.getElementById("deleteIcon");
var systemDate           = getDbSystemDate();
var detailRetrieveRqsURL = "mmf/mmfz01/MMFZ01ShipRecvDetailRetrieve";
var mailSendRqsURL       = "mmf/mmfz01/MMFZ01MailSend";
var shipRecvDeleteRqsURL = "mmf/mmfz01/MMFZ01ShipRecvDelete";
var para;
var processDate;
var userId;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		retrieveEvent();
		sendToEmail();
		deleteInOutInfos();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function retrieveEvent(){
	
	retrieveDataFromDb();
};

function retrieveDataFromDb(){
	
	processDate = eval(JSON.stringify(plus.webview.currentWebview().processDate));
	userId = localData.userId;
	
	var para= {
		userId       :  userId
	   ,processDate  :  processDate
	};
	
	//后台获取数据
	var returnData= post_ajax(detailRetrieveRqsURL,para,function(returnData){
		
		var fragment = document.createDocumentFragment();
		//循环填充数据
		$.each(returnData.details, function (i, item) {
			div = document.createElement('div');
			div.id = "inOutInfo_" +i;
			div.className = 'mui-card detail-list-margin';
			div.innerHTML = waybillContainHTML(item,i);
			fragment.appendChild(div);
		});
		waybillContainObj.appendChild(fragment);
	});
};

function deleteInOutInfos(){
	
	//点击删除按钮
	mui(waybillContainObj).on('tap','a',function(){
		
		var i = this.getAttribute('value');
		
		//获取对应的对象
		var inOutInfoObj = document.getElementById("inOutInfo_"+ i);
		var btnArray = ['取消', '删除'];
		mui.confirm('确认删除吗？删除后不可恢复', '删除进出库信息', btnArray, function(e) {
			if (e.index == 1) {
				
				var hdShipRecvFlg = document.getElementById("hdShipRecvFlg_" + i).innerText;
				var hdShipRecvId  = document.getElementById("hdShipRecvId_"  + i).innerText;
				para = {
					userId        : userId
				   ,hdShipRecvFlg : hdShipRecvFlg
				   ,hdShipRecvId  : hdShipRecvId
				};
				
				//点击确认后删除数据
				post_ajax(shipRecvDeleteRqsURL,para,function(returnData){
					if (returnData.canNotDelete == "1") mui.toast("存在已经入库的车架号，无法删除！");
					if (returnData.successFlag == "1") {
						//删除对应画面内容
						inOutInfoObj.parentNode.removeChild(inOutInfoObj);
						mui.toast("删除成功！");
					}
				});
			} else {
				return;
			}
		})
	});
}

function sendToEmail(){
	
	sendToEmailBtnObj.addEventListener('tap', function(event) {
		if (waybillContainObj.children.length == 0) return;
		
		var para= {
			 userId      : userId
			,processDate : processDate
		};
		post_ajax(mailSendRqsURL,para,function(returnData){
			if (returnData.showErrFlg == "2") {
				mui.toast('收件人邮箱地址为空！');
			}
			
			if (returnData.showErrFlg == "1") {
				mui.toast('非法的邮箱地址！');
			}
			
			if (returnData.successFlag == "1") {
				mui.toast('发送成功！');
			}
		});
	});
};

var waybillContainHTML = function(item,i){
	
	var shipRecvHeadTxt = '&nbsp;';
	var trashHtml       = '&nbsp;';
	
	item.hdShipRecvFlg == '1' ? shipRecvHeadTxt = '<span class="mui-icon iconfont icon-wh-in com-icon-left" style="color:#F14E41;"></span>'
												 +'<h5 class = "common-font common-font-bold" style="color:#F14E41;">'+item.hdShipRecv +'</h5>'
							  : shipRecvHeadTxt = '<span class="mui-icon iconfont icon-wh-out com-icon-left" style="color:#008000;"></span>'
												 +'<h5 class = "common-font common-font-bold" style="color:#008000;">'+item.hdShipRecv +'</h5>'
	
	if (processDate == systemDate) {
		trashHtml = '<span class="com-message-delete"></span>&nbsp;&nbsp;&nbsp;';
	}
 	
	var waybillContainHTML = '<ul class="mui-table-view">'
		                        +'<li class="mui-table-view-divider in-out-li-title">'
									+'<div class="mui-table">'
										+'<div class="mui-table-cell mui-col-xs-2">'
											+ shipRecvHeadTxt
										+'</div>'
										+'<span id="hdShipRecvFlg_'+i+'" class="hidden">'+item.hdShipRecvFlg+'</span>'
										+'<span id="hdShipRecvId_'+i+'" class="hidden">'+item.hdShipRecvId+'</span>'
										+'<div class="mui-table-cell mui-col-xs-4 mui-text-right">'
											+'<span class="common-font-h6">'+item.processTime+'&nbsp;&nbsp;</span>'
										+'</div>'
										+'<div class="mui-table-cell mui-col-xs-1 mui-text-right">'
											+'<a class="mui-tab-item" value ="'+i+'">'
											+ trashHtml
											+'</a>'
										+'</div>'
									+'</div>'
								+'</li>'
								+'<div id="detailContain">'
									//detailContain
									+ constructDetailHTML(item)
								+'</div>'
								+'<li class="mui-table-view-divider" style="background-color:#FFF">'
									+'<div class="mui-table-cell com-footer-total">'
										+'<span class="common-font-red">合计：'+item.totalQtyStr+'</span>'
									+'</div>'
								+'</li>'
							+'</ul>'
	return waybillContainHTML;
};

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
	
	var recvFlgNmColor = '';
	if (itemDetail.recvFlgNm.trim() != '') {
		itemDetail.recvFlg == 0 ? recvFlgNmColor = '<span class="txt-contain-pink">' + itemDetail.recvFlgNm + '</span>'
								: recvFlgNmColor = '<span class="txt-contain-grey">' + itemDetail.recvFlgNm + '</span>'
	}
	
	var detailContainHTML ='<li class="mui-table-view-cell common-font com-sub-sub-area cur-sub-area" style="padding-left:15%;">'
							+ '<span>' + itemDetail.frameNo + '</span>' 
						    + recvFlgNmColor 
						  + '</li>'
	
	return detailContainHTML;
};

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