var localDataObj;
var habitSetDataObj;
var requestUrl = "mma/mmaz07/MMAZ07StockInfoService";
var colorArr;
var productModelRadio;
var modelCdDisp;
var modelNmDisp;

(function($, doc) {
	$.init();
	$.plusReady(function() {

    	// Get Parameter
		localDataObj    = eval('('+localStorage.getItem("localData")+')');
		habitSetDataObj = eval('('+localStorage.getItem("habitSetData")+')');
		// Run Stock Info Service
		var para = prepareParameter();
		post_ajax(requestUrl,para,function(returnData) {
			if (para.areaOfficeRadio == "1") {
				// Show Dealer Stock Data For area Office
				setDlStockDataForOffice(returnData);
			}
			if (para.areaOwnShopRadio == "1") {
				// Show Dealer Stock Data For area OwnShop
				setDlStockDataForOwnShop(returnData);
			}
		});
		// Tap scroll to header
		scrollToHeader();
	}); 	
}(mui, document));

function setDlStockDataForOwnShop (returnData) {

	var dealerDetail = returnData.details;
	var stockOwnShopInfo = document.getElementById("stockOwnShopInfo");
	var detailInfo;

	// Set header to screen
	document.getElementById("totalStockQty").innerHTML=formatNumber(returnData.totalStockQty);
	
	// Get dealer html grid
	var dealerHtmlGrid = getDealerHtmlGrid(dealerDetail);
	
	stockOwnShopInfo.innerHTML = dealerHtmlGrid;
}

var getDealerHtmlGrid = function(dealerDetail) {
	
	//auto open when warehouse have input 
	var autoOpenClass ='';
	if (dealerDetail.length == 1) {
		autoOpenClass = 'mui-active';
	}
	
	var dealerHtmlGrid = "";
	
	$.each(dealerDetail, function (i, item) {
		dealerHtmlGrid += '<ul class="common-table-view ">' +
							'<li class="mui-table-view-cell collapse-context mui-collapse '+autoOpenClass+'">' +
								'<a class="mui-navigate-right"><td>' + item.dealerAbbNm + '</td><span class="mui-badge mui-badge-red"><td>合计：'+ formatNumber(item.stockQty) + '</td></span></a>' +
								'<div class="mui-collapse-content">' +
									'<form class="mui-input-group">' +
										'<div class="mui-content-padded">' +
											'<table class="collapse-table">';
												var detailGrid = getDealerDetailHtmlGrid(item);
												dealerHtmlGrid += detailGrid +
											'</table>' +
										'</div>' +
									'</form>' +
								'</div>' +
							'</li>' +
						'</ul>';
			
	});
	return dealerHtmlGrid;
}

var getDealerDetailHtmlGrid = function(item) {
	
	var detailGrid = '';
	if (colorArr.length > 0){
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
							'<td style="width:*">' + operateModelShow(item) + '</td>' +
							'<td style="width:10%">' + item.colorNm + '</td>' +
							'<td style="width:20%">' + formatNumber(item.stockQty) + '</td>' +
					   	 '</tr>';
		});
		
		
	}else{
		
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
							'<td style="width:*">' + operateModelShow(item) + '</td>' +
							'<td style="width:20%">' + formatNumber(item.stockQty) + '</td>' +
					   	 '</tr>';
	});
		
	}
	return detailGrid;
}

function setDlStockDataForOffice (returnData) {

	// Set header to screen
	setOfficeHeaderInfo(returnData);
	
	var detailData      = returnData.details;
	var stockOfficeInfo = document.getElementById("stockOfficeInfo");
	var fragment        = document.createDocumentFragment();

	// Set Stock Info Data to Screen
	$.each(detailData, function (i, item) {
		
		var stockDetail = document.createElement('tr');
		stockDetail.innerHTML = stockOfficeHtml(item);
	   	fragment.appendChild(stockDetail);
	});
	stockOfficeInfo.appendChild(fragment);
}

function setOfficeHeaderInfo (returnData) {
	document.getElementById("areaNm").innerHTML="区域：" + returnData.areaNm;
	document.getElementById("totalStockQty").innerHTML=returnData.totalStockQtyStr;
}

var prepareParameter = function () {
	
	var curWebview    = plus.webview.currentWebview();
	colorArr          = eval(JSON.stringify(curWebview.colorArr));
	productModelRadio = eval(JSON.stringify(curWebview.productModelRadio));
	modelCdDisp      = habitSetDataObj.modelCdDisp;
	modelNmDisp      = habitSetDataObj.modelNmDisp;
	
	return para = {userId  			    : localDataObj.userId
			   	  ,modelCdDisp  	    : modelCdDisp
			   	  ,modelNmDisp   		: modelNmDisp
			   	  ,whId 			    : eval(JSON.stringify(curWebview.whId))
			   	  ,areaOfficeRadio 		: eval(JSON.stringify(curWebview.areaOfficeRadio))
			   	  ,areaOwnShopRadio 	: eval(JSON.stringify(curWebview.areaOwnShopRadio))
			   	  ,productCategoryRadio : eval(JSON.stringify(curWebview.productCategoryRadio))
			      ,productClassRadio    : eval(JSON.stringify(curWebview.productClassRadio))
			      ,productModelRadio    : productModelRadio
			      ,modelCategoryId      : eval(JSON.stringify(curWebview.modelCategoryId))
			      ,modelCategoryNm    	: eval(JSON.stringify(curWebview.modelCategoryNm))
			      ,modelClassId        	: eval(JSON.stringify(curWebview.modelClassId))
			      ,modelClassNm    	    : eval(JSON.stringify(curWebview.modelClassNm))
			      ,modelId    	    	: eval(JSON.stringify(curWebview.modelId))
			      ,modelNm    	    	: eval(JSON.stringify(curWebview.modelNm))
			      ,exhaustArr    		: eval(JSON.stringify(curWebview.exhaustArr))
			      ,colorArr    	    	: colorArr
			      ,packingYear    		: eval(JSON.stringify(curWebview.packingYear))
				  }
}

var stockOfficeHtml = function(item){
	var stockOfficeHt;
	if (colorArr.length > 0) {
		stockOfficeHt = '<td style="width:*;text-align:left">' + operateModelShow(item) + '</td>'
		              + '<td style="width:10%;text-align:left">' + item.colorNm + '</td>'
                      + '<td style="width:20%;text-align:right">' + item.stockQtyStr + '</td>'
	}else{
		stockOfficeHt = '<td style="width:*;text-align:left">' + operateModelShow(item) + '</td>'
                      + '<td style="width:20%;text-align:right">' + item.stockQtyStr + '</td>'
	}
	return stockOfficeHt;
}

/**
 * 处理机型显示类型：机型代码/机型名称
 */
var operateModelShow = function (item) {
	
	var modelShowUp  = item.modelNm;
	
	if (productModelRadio == "1") {
		
		if (modelCdDisp == "1") {
		
			modelShowUp = item.modelCd;
		}
		if (modelNmDisp == "1") {
			
			modelShowUp = item.modelNm;
		}
		if (modelCdDisp == "1" && modelNmDisp == "1") {
			
			modelShowUp = item.modelCd + "</br>" + item.modelNm;
		}
	}
	
    return modelShowUp;
}