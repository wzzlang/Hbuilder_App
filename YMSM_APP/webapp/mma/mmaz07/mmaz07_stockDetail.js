var localDataObj;
var habitSetDataObj;
var requestUrl = "mma/mmaz07/MMAZ07StockInfoService";
var colorArr;
var whId;
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
			
			setStockInfoData(returnData);
		});
		// Tap scroll to header
		scrollToHeader();
	}); 	
}(mui, document));

var prepareParameter = function () {
	
	var curWebview    = plus.webview.currentWebview();
	colorArr          = eval(JSON.stringify(curWebview.colorArr));
	whId              = eval(JSON.stringify(curWebview.whId));
	productModelRadio = eval(JSON.stringify(curWebview.productModelRadio));
	modelCdDisp       = habitSetDataObj.modelCdDisp;
	modelNmDisp       = habitSetDataObj.modelNmDisp;
	
	return para = {userId  			    : localDataObj.userId
			   	  ,modelCdDisp  	    : modelCdDisp
			   	  ,modelNmDisp  		: modelNmDisp
			   	  ,whId 			    : eval(JSON.stringify(curWebview.whId))
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

function setStockInfoData (returnData) {

	// Set header to screen
	setHeaderInfo(returnData);
	
	var stockDetails      = returnData.details;
	var stockDetailInfo = document.getElementById("stockDetailInfo");
	
	// Set Stock Info Data to Screen
	var stockHtmlGrid = stockDetailHtml(stockDetails);
	stockDetailInfo.innerHTML = stockHtmlGrid;
}

function setHeaderInfo (returnData) {
	document.getElementById("totalStockQty").innerHTML=formatNumber(returnData.totalStockQty);
}

var stockDetailHtml = function(stockDetails) {
	
	//auto open when warehouse have input 
	var autoOpenClass ='';
	if (stockDetails.length == 1) {
		autoOpenClass = 'mui-active';
	}
	
	var stockHtmlGrid = "";
	
	$.each(stockDetails, function (i, item) {
		stockHtmlGrid += '<ul class="common-table-view ">' +
							'<li class="mui-table-view-cell collapse-context mui-collapse '+autoOpenClass+'">' +
								'<a class="mui-navigate-right"><td>' + item.whAbbNm + '</td><span class="mui-badge mui-badge-red"><td>合计：'+ formatNumber(item.stockQty) + '</td></span></a>' +
								'<div class="mui-collapse-content">' +
									'<form class="mui-input-group">' +
										'<div class="mui-content-padded">' +
											'<table class="collapse-table">';
												var detailGrid = getStockDetailHtmlGrid(item);
												stockHtmlGrid += detailGrid +
											'</table>' +
										'</div>' +
									'</form>' +
								'</div>' +
							'</li>' +
						'</ul>';
			
	});
	return stockHtmlGrid;
}

var getStockDetailHtmlGrid = function(item) {
	
	var detailGrid = '';
	if (colorArr.length > 0){
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
							'<td style="width:*">' + operateModelShow(item) + '</td>' +
							'<td style="width:10%">' + item.colorNm + '</td>' +
							'<td style="width:17%">' + formatNumber(item.stockQty) + '</td>' +
					   	 '</tr>';
		});
		
		
	}else{
		
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
							'<td style="width:*">' + operateModelShow(item) + '</td>' +
							'<td style="width:17%">' + formatNumber(item.stockQty) + '</td>' +
					   	 '</tr>';
	});
		
	}
	return detailGrid;
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
