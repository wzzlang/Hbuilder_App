var localDataObj;
var requestUrl = "mma/mmaz01/MMAZ01DailyPsiService";
var isSearchByMonth = false;

(function($, doc) {
	$.init();
	$.plusReady(function() {

    	// Get Parameter
		localDataObj = eval('('+localStorage.getItem("localData")+')');
		
		// Run Daily Psi Service
		var para = prepareParameter();
		post_ajax(requestUrl,para,function(returnData) {
			// Show Daily Psi Data
			setDailyPsiData(returnData);
		});
		// Tap scroll to header
		scrollToHeader();
	});
}(mui, document));

function setDailyPsiData (returnData) {
	
	var fragment = document.createDocumentFragment();
	
	// Set header info
	setProductHeaderLabel(returnData);
	
	// Set psi data to screen
	var inDetails		 = returnData.inDetails;
	var inPsiInfo    	 = document.getElementById("inPsiInfo");
	setPsiInfoToScreen(fragment, inPsiInfo, inDetails);
	
	var retailDetails    = returnData.retailDetails;
	var retailPsiInfo    = document.getElementById("retailPsiInfo");
	setPsiInfoToScreen(fragment, retailPsiInfo, retailDetails);
	
	if (isSearchByMonth) {
	var wholesaleDetails = returnData.wholesaleDetails;
	var wholesalePsiInfo = document.getElementById("wholesalePsiInfo");
	setPsiInfoToScreen(fragment, wholesalePsiInfo, wholesaleDetails);
	}
	
	var stockDetails     = returnData.stockDetails;
	var stockPsiInfo     = document.getElementById("stockPsiInfo");
	setPsiInfoToScreen(fragment, stockPsiInfo, stockDetails);
}

function setPsiInfoToScreen (fragment, psiInfo, psiDetails) {
	
	$.each(psiDetails, function (i, item) {
		
		var tr = document.createElement('tr');
		tr.innerHTML = '<td style="text-align: left;">' + item.modelNm + '</td>'
   					 + '<td style="text-align: right;">' + formatNumber(item.qty) + '</td>';
		fragment.appendChild(tr);
	});
	psiInfo.appendChild(fragment);
}

function setProductHeaderLabel (returnData) {
	
	document.getElementById("areaName").innerHTML=returnData.areaName;
	document.getElementById("period").innerHTML=returnData.period;
	
	// Set label
	var inStr = "订单数量";
	var inTableId = "inPsiInfo";
	var inQtyId = "totalInQty";
	
	var retailStr = "U销数量";
	var retailTableId = "retailPsiInfo";
	var retailQtyId = "totalRetailQty";
	
	var wholesaleStr = "批发数量";
	var wholesaleTableId = "wholesalePsiInfo";
	var wholesaleQtyId = "totalWholesaleQty";
	
	var stockStr = "库存数量";
	var stockTableId = "stockPsiInfo";
	var stockQtyId = "totalStockQty";
	
	var htmlGrid = "";
	htmlGrid = htmlGrid + getHtmlGrid(inStr, inTableId, inQtyId);
	htmlGrid = htmlGrid + getHtmlGrid(retailStr, retailTableId, retailQtyId);
	if (isSearchByMonth) {
	htmlGrid = htmlGrid + getHtmlGrid(wholesaleStr, wholesaleTableId, wholesaleQtyId);
	}
	htmlGrid = htmlGrid + getHtmlGrid(stockStr, stockTableId, stockQtyId);
	document.getElementById("psiInfo").innerHTML=htmlGrid;

	document.getElementById(inQtyId).innerHTML="合计：" + formatNumber(returnData.totalInQty);
	document.getElementById(retailQtyId).innerHTML="合计：" + formatNumber(returnData.totalRetailQty);
	if (isSearchByMonth) {
	document.getElementById(wholesaleQtyId).innerHTML="合计：" + formatNumber(returnData.totalWholesaleQty);
	}
	document.getElementById(stockQtyId).innerHTML="合计：" + formatNumber(returnData.totalStockQty);
}

var prepareParameter = function() {
	
	var curWebview = plus.webview.currentWebview();
	
	if (eval(JSON.stringify(curWebview.dbMonthFrom)).trim() != "" || eval(JSON.stringify(curWebview.dbMonthTo)).trim() != "") {
		isSearchByMonth = true;
	} else {
		isSearchByMonth = false;
	}
	
	return para = {userId  			    : localDataObj.userId
			   	  ,psiTypeProductRadio  : eval(JSON.stringify(curWebview.psiTypeProductRadio))
			   	  ,psiTypeDealerRadio   : eval(JSON.stringify(curWebview.psiTypeDealerRadio))
			      ,dbDateFrom           : eval(JSON.stringify(curWebview.dbDateFrom))
			      ,dbDateTo             : eval(JSON.stringify(curWebview.dbDateTo))
			      ,dbMonthFrom          : eval(JSON.stringify(curWebview.dbMonthFrom))
			      ,dbMonthTo            : eval(JSON.stringify(curWebview.dbMonthTo))
			      ,orgId                : eval(JSON.stringify(curWebview.orgId))
			      ,dealerId             : eval(JSON.stringify(curWebview.dealerId))
			      ,dealerCd             : eval(JSON.stringify(curWebview.dealerCd))
			      ,productCategoryRadio : eval(JSON.stringify(curWebview.productCategoryRadio))
			      ,productClassRadio    : eval(JSON.stringify(curWebview.productClassRadio))
			      ,modelCategoryId      : eval(JSON.stringify(curWebview.modelCategoryId))
			      ,modelCategoryNm      : eval(JSON.stringify(curWebview.modelCategoryNm))
			      ,modelClassId         : eval(JSON.stringify(curWebview.modelClassId))
			      ,modelClassNm         : eval(JSON.stringify(curWebview.modelClassNm))
			      ,showDlData           : eval(JSON.stringify(curWebview.showDlData))
			      ,showSubDlData        : eval(JSON.stringify(curWebview.showSubDlData))
				  }
}

var getHtmlGrid = function(labelStr, tableId, qtyId) {
	
	var htmlGrid = '<ul class="common-table-view">' +
						'<li class="mui-table-view-cell collapse-context mui-collapse">' +
							'<a class="mui-navigate-right">' + labelStr + '<span class="mui-badge mui-badge-red" id="' + qtyId + '"></span></a>' +
							'<div class="mui-collapse-content">' +
								'<form class="mui-input-group">' +
									'<div class="mui-content-padded">' +
										'<table class="collapse-table" id=' + tableId + '></table>' +
									'</div>' +
								'</form>' +
							'</div>' +
						'</li>' +
					'</ul>';
	return htmlGrid;
}
