var tabRadioContainObj	  = document.getElementById("tabRadioContain");
var segmentedControlObj	  = document.getElementById("segmentedControl");
var wholesalePsiTabObj	  = document.getElementById("wholesalePsiTab");
var muiContentObj	      = document.getElementById("muiContent");
var requestUrl = "mma/mmaz01/MMAZ01DailyPsiService";
var curWebview;
var localDataObj;
var psiTypeDealerRadio;
var isSearchByMonth  = false;
var indexClickBefore = 1;
var DISPLAY 	= "";
var NONEDISPLAY = "none";
var sortFieldValue   = "1";
var subjectDealer 	 = "0";
var subjectInPsi     = "1";
var subjectRetail 	 = "2";
var subjectWholesale = "3";
var subjectStock	 = "4";

(function($, doc) {
	$.init();
	$.plusReady(function() {
		
		getInitialData();
		//initial control
		initialControl();
		//get psi info
		getPsiInfo();
		// Tap scroll to header
		scrollToHeader();
		//get and sort Psi Info by tab select
		getPsiInfoByTab();
	});
}(mui, document));

function getInitialData(){
	// Get Parameter
	localDataObj        = eval('('+localStorage.getItem("localData")+')');
	curWebview          = plus.webview.currentWebview();
	psiTypeDealerRadio  = eval(JSON.stringify(curWebview.psiTypeDealerRadio));
}

function initialControl(){
	
	tabRadioContainObj.style.display = NONEDISPLAY;
	if (psiTypeDealerRadio == "1"){
		tabRadioContainObj.style.display = DISPLAY;
		muiContentObj.style.marginTop = "40px";
	}
	
	psiTypeDealerRadio == "1" ? tabRadioContainObj.style.display = DISPLAY
							  : tabRadioContainObj.style.display = NONEDISPLAY
	if (eval(JSON.stringify(curWebview.dbMonthFrom)).trim() != "" || eval(JSON.stringify(curWebview.dbMonthTo)).trim() != "") {
		isSearchByMonth = true;
	} else {
		isSearchByMonth = false;
	}
	//set wholesalePsiTab show or not
	if (isSearchByMonth) {wholesalePsiTabObj.style.display = DISPLAY};
}

function getPsiInfo(){
	// Run Daily Psi Service
	var para = prepareParameter();
	post_ajax(requestUrl,para,function(returnData) {
		if (para.psiTypeProductRadio == "1") {
			// Show Daily Psi Data(Product)
			setDailyPsiProduct(returnData);
		} 
		
		if (para.psiTypeDealerRadio == "1") {
			// Show Daily Psi Data(Dealer)
			setDailyPsiDealer(returnData);
		}
	});
}

function setDailyPsiDealer (returnData) {
	
	var detailData   = returnData.dealerDetails;
	var dailyPsiInfo = document.getElementById("dailyPsiInfo");
	var fragment     = document.createDocumentFragment();
	var detailTr;
	
	// Set header && label to screen
	setDealerHeaderLabel(returnData);
	
	// Set Sales Order Data to Screen
	$.each(detailData, function (i, item) {
		
		detailTr = document.createElement('tr');
		if (isSearchByMonth) {
			
			detailTr.innerHTML = '<td style="text-align:left;" >' + item.dealerAbbNm + '</td>'
						  	   + '<td style="text-align:right;">' + formatNumber(item.inQty) + '</td>'
						  	   + '<td style="text-align:right;">' + formatNumber(item.retailQty) + '</td>'
	 					       + '<td style="text-align:right;">' + formatNumber(item.wholesaleQty) + '</td>'
	 					       + '<td style="text-align:right;">' + formatNumber(item.stockQty) + '</td>';
		} else {
			
			detailTr.innerHTML = '<td style="text-align:left;" >' + item.dealerAbbNm + '</td>'
						  	   + '<td style="text-align:right;">' + formatNumber(item.inQty) + '</td>'
						  	   + '<td style="text-align:right;">' + formatNumber(item.retailQty) + '</td>'
	 					       + '<td style="text-align:right;">' + formatNumber(item.stockQty) + '</td>';
		}
		fragment.appendChild(detailTr);
	});
	dailyPsiInfo.appendChild(fragment);
}

function setDailyPsiProduct (returnData) {
	
	var fragment = document.createDocumentFragment();
	
	// Set period to screen
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

var prepareParameter = function() {

	return para = {userId  			    : localDataObj.userId
			   	  ,psiTypeProductRadio  : eval(JSON.stringify(curWebview.psiTypeProductRadio))
			   	  ,psiTypeDealerRadio   : psiTypeDealerRadio
			      ,dbDateFrom           : eval(JSON.stringify(curWebview.dbDateFrom))
			      ,dbDateTo             : eval(JSON.stringify(curWebview.dbDateTo))
			      ,dbMonthFrom          : eval(JSON.stringify(curWebview.dbMonthFrom))
			      ,dbMonthTo            : eval(JSON.stringify(curWebview.dbMonthTo))
			      ,areaAllRadio         : eval(JSON.stringify(curWebview.areaAllRadio))
			      ,orgId                : eval(JSON.stringify(curWebview.orgId))
			      ,dealerId             : eval(JSON.stringify(curWebview.dealerId))
			      ,dealerCd             : eval(JSON.stringify(curWebview.dealerCd))
			      ,cityId				: eval(JSON.stringify(curWebview.cityId))
			      ,productCategoryRadio : eval(JSON.stringify(curWebview.productCategoryRadio))
			      ,productClassRadio    : eval(JSON.stringify(curWebview.productClassRadio))
			      ,modelCategoryId      : eval(JSON.stringify(curWebview.modelCategoryId))
			      ,modelCategoryNm      : eval(JSON.stringify(curWebview.modelCategoryNm))
			      ,modelClassId         : eval(JSON.stringify(curWebview.modelClassId))
			      ,modelClassNm         : eval(JSON.stringify(curWebview.modelClassNm))
			      ,showDlData           : eval(JSON.stringify(curWebview.showDlData))
			      ,showSubDlData        : eval(JSON.stringify(curWebview.showSubDlData))
			      ,sortField            : sortFieldValue
				  }
}

function setDealerHeaderLabel(returnData) {
	
	// Set header info
	document.getElementById("areaName").innerHTML=returnData.areaName;
	document.getElementById("period").innerHTML=returnData.period;
	
	// Set label
	if(isSearchByMonth) {
		
		var htmlGrid = '<tr>' +
					   		'<th style="border-bottom: 0px; width: *px"></th>' +
					  		'<th style="border-bottom: 0px; width: 60px; text-align:right;">订单</th>' +
					  		'<th style="border-bottom: 0px; width: 60px; text-align:right;">U销</th>' +
					   		'<th style="border-bottom: 0px; width: 60px; text-align:right;">批发</th>' +
					 		'<th style="border-bottom: 0px; width: 60px; text-align:right;">库存</th>' +
					   '</tr>' +
					   '<tr>' + 
					 		'<th></th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalInQty) + '</th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalRetailQty) + '</th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalWholesaleQty) + '</th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalStockQty) + '</th>' +
					    '</tr>';
	} else {
		
		var htmlGrid = '<tr>' +
					   		'<th style="border-bottom: 0px; width: *px"></th>' +
					  		'<th style="border-bottom: 0px; width: 60px; text-align:right;">订单</th>' +
					  		'<th style="border-bottom: 0px; width: 60px; text-align:right;">U销</th>' +
					 		'<th style="border-bottom: 0px; width: 60px; text-align:right;">库存</th>' +
					   '</tr>' +
					   '<tr>' + 
					 		'<th></th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalInQty) + '</th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalRetailQty) + '</th>' +
					 		'<th style="text-align:right;">' + formatNumber(returnData.totalStockQty) + '</th>' +
					    '</tr>';
	}
	
	document.getElementById("dailyPsiInfo").innerHTML=htmlGrid;
}

function setProductHeaderLabel(returnData) {
	
	// Set header info
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
function getPsiInfoByTab() {
	var list = segmentedControlObj.getElementsByTagName('a');
	for(var i = 0;i<list.length;i++){
		list[i].index = i;
		list[i].addEventListener("tap", function(){

			if (indexClickBefore == this.index) return;
			switch (this.index){
				case 0:
					sortFieldValue = subjectDealer; 	// 0
				break;
				case 1:
					sortFieldValue = subjectInPsi; 		// 1
				break;
				case 2:
					sortFieldValue = subjectRetail; 	// 2
				break;
				case 3:
					sortFieldValue = subjectWholesale; 	// 3
				break;
				case 4:
					sortFieldValue = subjectStock; 		// 4
				break;
			}
			indexClickBefore = this.index;
			showSortIcon(this.index);
			getPsiInfo();
		});	
	}
}

var showSortIcon = function(tabIndex){
	var sortIcons = segmentedControlObj.getElementsByClassName("sort-icon");
	for(var i = 0;i<sortIcons.length;i++){
		i == tabIndex ? sortIcons[i].style.display = DISPLAY
					  : sortIcons[i].style.display = NONEDISPLAY
	}
}
