var localDataObj;
var habitSetDataObj;
var productModelRadio;
var requestUrl = "mma/mmaz02/MMAZ02SalesOrderService";
var colorArr;
var modelCdDisp;
var modelNmDisp;

(function($, doc) {
	$.init();
	$.plusReady(function() {

    	// Get Parameter
		localDataObj    = eval('('+localStorage.getItem("localData")+')');
		habitSetDataObj = eval('('+localStorage.getItem("habitSetData")+')');
		// Run Sales Order Service
		var para = prepareParameter();
		post_ajax(requestUrl,para,function(returnData) {
			// Show Sales Order Data
			setSalesOrderData(returnData);
		});
		// Tap scroll to header
		scrollToHeader();
	}); 	
}(mui, document));

var prepareParameter = function() {
	
	var curWebview    = plus.webview.currentWebview();
	colorArr          = eval(JSON.stringify(curWebview.colorArr));
	productModelRadio = eval(JSON.stringify(curWebview.productModelRadio));
	modelCdDisp       = habitSetDataObj.modelCdDisp;
    modelNmDisp       = habitSetDataObj.modelNmDisp;
    
	return para = {userId  			    : localDataObj.userId
			   	  ,modelCdDisp  	    : modelCdDisp
			   	  ,modelNmDisp  		: modelNmDisp
			   	  ,dbDateFrom  			: eval(JSON.stringify(curWebview.dbDateFrom))
			   	  ,dbDateTo  			: eval(JSON.stringify(curWebview.dbDateTo))
			   	  ,dbMonthFrom 			: eval(JSON.stringify(curWebview.dbMonthFrom))
			   	  ,dbMonthTo 			: eval(JSON.stringify(curWebview.dbMonthTo))
			   	  ,areaAllRadio    		: eval(JSON.stringify(curWebview.areaAllRadio))
			      ,areaBranchRadio      : eval(JSON.stringify(curWebview.areaBranchRadio))
			      ,areaProvinceRadio    : eval(JSON.stringify(curWebview.areaProvinceRadio))
			      ,provinceId           : eval(JSON.stringify(curWebview.provinceId))
			      ,branchId             : eval(JSON.stringify(curWebview.branchId))
			      ,productCategoryRadio : eval(JSON.stringify(curWebview.productCategoryRadio))
			      ,productClassRadio    : eval(JSON.stringify(curWebview.productClassRadio))
			      ,productModelRadio    : productModelRadio
			      ,modelCategoryId    	: eval(JSON.stringify(curWebview.modelCategoryId))
			      ,modelCategoryNm    	: eval(JSON.stringify(curWebview.modelCategoryNm))
			      ,modelClassId    	    : eval(JSON.stringify(curWebview.modelClassId))
			      ,modelClassNm    	    : eval(JSON.stringify(curWebview.modelClassNm))
			      ,modelId    	        : eval(JSON.stringify(curWebview.modelId))
			      ,modelNm    	        : eval(JSON.stringify(curWebview.modelNm))
			      ,exhaustArr    	    : eval(JSON.stringify(curWebview.exhaustArr))
			      ,colorArr    	        : colorArr
				  }
}

var setSalesOrderData = function(returnData) {
	
	var detailData     = returnData.details;
	var salesOrderInfo = document.getElementById("salesOrderInfo");
	
	// Set Header to screen
	setHeaderInfo(returnData);
	
	// Set WH In Out Data to Screen
	var orderHtmlGrid = orderDetailHtml(detailData);
	salesOrderInfo.innerHTML = orderHtmlGrid;
}

function setHeaderInfo (returnData) {
	
	// Set period & totalOrderQty to screen
	document.getElementById("period").innerHTML=returnData.period;
	document.getElementById("totalOrderQty").innerHTML=formatNumber(returnData.totalOrderQty);
}

var orderDetailHtml = function(orderDetails) {
	
	//auto open when warehouse have input 
	var autoOpenClass ='';
	if (orderDetails.length == 1) {
		autoOpenClass = 'mui-active';
	}
	
	var orderHtmlGrid = "";
	
	$.each(orderDetails, function (i, item) {
		orderHtmlGrid += '<ul class="common-table-view ">' +
							'<li class="mui-table-view-cell collapse-context mui-collapse '+autoOpenClass+'">' +
								'<a class="mui-navigate-right"><td>' + item.areaNm + '</td><span class="mui-badge mui-badge-red"><td>合计：'+ formatNumber(item.orderQty) + '</td></span></a>' +
								'<div class="mui-collapse-content">' +
									'<form class="mui-input-group">' +
										'<div class="mui-content-padded">' +
											'<table class="collapse-table">';
												var detailGrid = getOrderDetailHtmlGrid(item);

												orderHtmlGrid += detailGrid +
											'</table>' +
										'</div>' +
									'</form>' +
								'</div>' +
							'</li>' +
						'</ul>';
			
	});
	return orderHtmlGrid;
}

var getOrderDetailHtmlGrid = function(item) {
	
	var detailGrid = '';
	if (colorArr.length > 0){
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
							'<td style="width:*">' + operateModelShow(item) + '</td>' +
							'<td style="width:10%">' + item.colorNm + '</td>' +
							'<td style="width:17%">' + formatNumber(item.orderQty) + '</td>' +
					   	 '</tr>';
		});
	}else{
		
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
							'<td style="width:*">' + operateModelShow(item) + '</td>' +
							'<td style="width:17%">' + formatNumber(item.orderQty) + '</td>' +
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