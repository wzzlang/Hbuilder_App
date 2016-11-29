var headerTotalObj =document.getElementById("headerTotal");
var localDataObj;
var habitSetDataObj;
var requestUrl = "mma/mmaz04/MMAZ04WHInOutService";
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
		// Run WH In Out Service
		var para = prepareParameter();
		post_ajax(requestUrl,para,function(returnData) {
			// Show WH In Out Data
			setWHInOutData(returnData);
		});
		// Tap scroll to header
		scrollToHeader();
	}); 	
}(mui, document));

var prepareParameter = function() {
	
	var curWebview    = plus.webview.currentWebview();
	colorArr          = eval(JSON.stringify(curWebview.colorArr));
	whId              = eval(JSON.stringify(curWebview.whId));
	productModelRadio = eval(JSON.stringify(curWebview.productModelRadio));
	modelCdDisp       = habitSetDataObj.modelCdDisp;
	modelNmDisp       = habitSetDataObj.modelNmDisp;
	
	return para = {userId  			    : localDataObj.userId
			   	  ,modelCdDisp  	    : modelCdDisp
			   	  ,modelNmDisp 		    : modelNmDisp
			   	  ,dbDateFrom  			: eval(JSON.stringify(curWebview.dbDateFrom))
			   	  ,dbDateTo  			: eval(JSON.stringify(curWebview.dbDateTo))
			   	  ,dbMonthFrom 			: eval(JSON.stringify(curWebview.dbMonthFrom))
			   	  ,dbMonthTo 			: eval(JSON.stringify(curWebview.dbMonthTo))
			   	  ,whId 			    : whId
			      ,productCategoryRadio : eval(JSON.stringify(curWebview.productCategoryRadio))
			      ,productClassRadio    : eval(JSON.stringify(curWebview.productClassRadio))
			      ,productModelRadio    : productModelRadio
			      ,modelCategoryId    	: eval(JSON.stringify(curWebview.modelCategoryId))
			      ,modelCategoryNm    	: eval(JSON.stringify(curWebview.modelCategoryNm))
			      ,modelClassId         : eval(JSON.stringify(curWebview.modelClassId))
			      ,modelClassNm         : eval(JSON.stringify(curWebview.modelClassNm))
			      ,modelId    			: eval(JSON.stringify(curWebview.modelId))
			      ,modelNm    			: eval(JSON.stringify(curWebview.modelNm))
			      ,exhaustArr           : eval(JSON.stringify(curWebview.exhaustArr))
			      ,colorArr    		    : colorArr
				  }
}

function setWHInOutData (returnData) {
	
	var whInOutDetails  = returnData.details;
	var whInOutInfo = document.getElementById("whInOutInfo");
	
	// Set Header to screen
	setHeaderInfo(returnData);
	
	// Set table header qty
	if (whId == ''){
		var table = document.createElement('table');
		table.innerHTML = tableTotalQtyHtml(returnData);
		headerTotalObj.appendChild(table);
	}
	
	// Set WH In Out Data to Screen
	var whInOutHtmlGrid = whInOutDetailHtml(whInOutDetails);
	whInOutInfo.innerHTML = whInOutHtmlGrid;
}

function setHeaderInfo (returnData) {
	document.getElementById("period").innerHTML=returnData.period;
}

var tableTotalQtyHtml = function(returnData){
	var tableTotalQtyHt = 
		'<tr>' 
			+ '<td style="width: 60px; border-bottom: 0px; padding-top: 0px;text-align:center;">总入库</td>'
			+ '<td style="width: 60px; border-bottom: 0px; padding-top: 0px;text-align:center;">总出库</td>'
			+ '<td style="width: 60px; border-bottom: 0px; padding-top: 0px;text-align:center;">总库存</td>'
			+ '<td style="width: *px;  border-bottom: 0px; padding-top: 0px;"></td>' 
		+ '</tr>'
		+ '<tr>' 
			+ '<td style="width: 60px; border-bottom: 0px; padding-top: 0px;text-align:center;">'+ formatNumber(returnData.totalWhInQty) +'</td>'
			+ '<td style="width: 60px; border-bottom: 0px; padding-top: 0px;text-align:center;">'+ formatNumber(returnData.totalWhOutQty) +'</td>'
			+ '<td style="width: 60px; border-bottom: 0px; padding-top: 0px;text-align:center;">'+ formatNumber(returnData.totalStockQty) +'</td>'
			+ '<td style="width: *px;  border-bottom: 0px; padding-top: 0px;"></td>' 
		+ '</tr>'
	return tableTotalQtyHt;
}

var whInOutDetailHtml = function(whInOutDetails) {
	
	//auto open when warehouse have input 
	var autoOpenClass ='';
	if (whInOutDetails.length == 1) {
		autoOpenClass = 'mui-active';
	}
	
	var whInOutHtmlGrid = "";
	
	$.each(whInOutDetails, function (i, item) {
		whInOutHtmlGrid += '<ul class="common-table-view ">' +
				'<li class="mui-table-view-cell collapse-context mui-collapse '+autoOpenClass+'">' +
					'<a class="mui-navigate-right"><td>' + item.whAbbNm + '</td></a>' +
					'<div class="mui-collapse-content">' +
						'<form class="mui-input-group">' +
							'<div class="mui-content-padded">' +
								'<table class="collapse-table">';
									var detailGrid = getWhInOutDetailHtmlGrid(item);
									whInOutHtmlGrid += detailGrid +
								'</table>' +
							'</div>' +
						'</form>' +
					'</div>' +
				'</li>' +
			'</ul>';
			
	});
	return whInOutHtmlGrid;
}

var getWhInOutDetailHtmlGrid = function(item) {
	
	var detailGrid = '';
	if (colorArr.length > 0){
		detailGrid = '<tr style="font-weight:bold;">' +
					      '<td style="width:*;border-bottom: 0px;text-align: left;"></td>'   +
	 				      '<td style="width:8%;border-bottom: 0px;text-align: left;"></td>'   +
	 				      '<td style="width:17%;border-bottom: 0px;text-align: right;">入库</td>'  +
	 				      '<td style="width:17%;border-bottom: 0px;text-align: right;">出库</td>' +
	 				      '<td style="width:17%;border-bottom: 0px;text-align: right;">库存</td>' +
				   	  '</tr>'+
				   	  '<tr style="font-weight:bold;">' +
					      '<td style="width:*;padding-top: 0px;text-align: left;"></td>'   +
	 				      '<td style="width:20%;padding-top: 0px;text-align: left;"></td>'   +
	 				      '<td style="width:17%;padding-top: 0px;text-align: right;">' + formatNumber(item.whInQty) + '</td>'  +
	 				      '<td style="width:17%;padding-top: 0px;text-align: right;">' + formatNumber(item.whOutQty) + '</td>' +
	 				      '<td style="width:17%;padding-top: 0px;text-align: right;">' + formatNumber(item.stockQty) + '</td>' +
				   	  '</tr>';
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
						      '<td style="width:*;text-align: left;">' + operateModelShow(item) + '</td>'   +
		 				      '<td style="width:8%;text-align: left;">' + item.colorNm + '</td>'   +
		 				      '<td style="width:17%;text-align: right;">' + formatNumber(item.whInQty) + '</td>'  +
		 				      '<td style="width:17%;text-align: right;">' + formatNumber(item.whOutQty) + '</td>' +
		 				      '<td style="width:17%;text-align: right;">' + formatNumber(item.stockQty) + '</td>' +
					   	  '</tr>';
		});
		
	}else{
		detailGrid = '<tr style="font-weight:bold;">' +
					      '<td style="width:*;border-bottom: 0px;text-align: left;"></td>'   +
	 				      '<td style="width:17%;border-bottom: 0px;text-align: right;">入库</td>' +
	 				      '<td style="width:17%;border-bottom: 0px;text-align: right;">出库</td>' +
	 				      '<td style="width:17%;border-bottom: 0px;text-align: right;">库存</td>' +
				   	  '</tr>'+
				   	  '<tr style="font-weight:bold;">' +
					      '<td style="width:*;padding-top: 0px;text-align: left;"></td>'   +
	 				      '<td style="width:17%;padding-top: 0px;text-align: right;">' + formatNumber(item.whInQty) + '</td>'  +
	 				      '<td style="width:17%;padding-top: 0px;text-align: right;">' + formatNumber(item.whOutQty) + '</td>' +
	 				      '<td style="width:17%;padding-top: 0px;text-align: right;">' + formatNumber(item.stockQty) + '</td>' +
				   	  '</tr>';;
		$.each(item.details, function (i, item) {
			detailGrid += '<tr>' +
						      '<td style="width:*;text-align: left;">'  + operateModelShow(item) + '</td>'   +
		 				      '<td style="width:17%;text-align: right;">' + formatNumber(item.whInQty) + '</td>'  +
		 				      '<td style="width:17%;text-align: right;">' + formatNumber(item.whOutQty) + '</td>' +
		 				      '<td style="width:17%;text-align: right;">' + formatNumber(item.stockQty) + '</td>' +
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