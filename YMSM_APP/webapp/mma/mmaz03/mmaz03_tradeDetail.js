var localDataObj;
var requestUrl = "mma/mmaz03/MMAZ03DlTradeService";

(function($, doc) {
	$.init();
	$.plusReady(function() {

    	// Get Parameter
		localDataObj = eval('('+localStorage.getItem("localData")+')');
		
		// Run Dl Trade Service
		var para = prepareParameter();
		post_ajax(requestUrl,para,function(returnData) {
			
			if (para.showTypeDetailRadio == "1") {
				// Show Dl Trade Data For Model Class
				setDlTradeDataForClass(para, returnData);
			} else {
				// Show Dl Trade Data For Total
				setDlTradeDataForTotal(para, returnData);
			}
		});
		
		// Tap scroll to header
		scrollToHeader();
	}); 	
}(mui, document));

var prepareParameter = function () {
	
	var curWebview = plus.webview.currentWebview();
	
	return para = {userId  			    : localDataObj.userId
			   	  ,dbMonthFrom 			: eval(JSON.stringify(curWebview.dbMonthFrom))
			   	  ,dbMonthTo 			: eval(JSON.stringify(curWebview.dbMonthTo))
			   	  ,showTypeDetailRadio  : eval(JSON.stringify(curWebview.showTypeDetailRadio))
			   	  ,branchId             : eval(JSON.stringify(curWebview.branchId))
			      ,provinceId           : eval(JSON.stringify(curWebview.provinceId))
			      ,modelCategoryId    	: eval(JSON.stringify(curWebview.modelCategoryId))
			      ,modelCategoryNm    	: eval(JSON.stringify(curWebview.modelCategoryNm))
			      ,modelClassId    	    : eval(JSON.stringify(curWebview.modelClassId))
			      ,modelClassNm    	    : eval(JSON.stringify(curWebview.modelClassNm))
				  }
}

function setDlTradeDataForTotal (para, returnData) {

	// Construct header && detail label to screen
	setHeaderLabel(returnData);
	
	var detailData  = returnData.details;
	var dlTradeInfo = document.getElementById("dlTradeInfo");
	var fragment    = document.createDocumentFragment();

	// Set Dl Trade Data to Screen
	$.each(detailData, function (i, item) {
		
		var agentTr = document.createElement('tr');
		agentTr.innerHTML = '<td rowspan="3">' + item.provinceNm + '</td>'
   					 	  + '<td style="text-align: left;">代理商</td>'
   					 	  + '<td>' + formatNumber(item.agentDlCount) + '</td>'
   					 	  + '<td>' + formatNumber(item.agentTradeDlCount) + '</td>'
   					 	  + '<td>' + formatNumber(item.agentRetailDlCount) + '</td>';
   		fragment.appendChild(agentTr);
   					 
   		var directTr = document.createElement('tr');
		directTr.innerHTML = '<td style="text-align: left;">直接管理</td>'
   					       + '<td>' + formatNumber(item.directDlCount) + '</td>'
   					       + '<td>' + formatNumber(item.directTradeDlCount) + '</td>'
   					       + '<td>' + formatNumber(item.directRetailDlCount) + '</td>';
   		fragment.appendChild(directTr);
   		
   		var indirect = document.createElement('tr');
   		
		indirect.innerHTML = '<td style="text-align: left;">间接管理</td>'
	   					   + '<td>' + formatNumber(item.indirectDlCount) + '</td>'
	   					   + '<td>' + formatNumber(item.indirectTradeDlCount) + '</td>'
	   					   + '<td>' + formatNumber(item.indirectRetailDlCount) + '</td>';
   		fragment.appendChild(indirect);
	});
	dlTradeInfo.appendChild(fragment);
	
	// Set bottom lable
	setBottomLableForTotal(returnData);
}

function setDlTradeDataForClass (para, returnData) {
	
	// Construct header && detail label to screen
	setHeaderLabel(returnData);
	
	var detailData  = returnData.details;
	var dlTradeInfo = document.getElementById("dlTradeInfo");
	var fragment    = document.createDocumentFragment();

	// Set Dl Trade Data to Screen
	$.each(detailData, function (i, item) {
		
		var agentTr = document.createElement('tr');
		agentTr.innerHTML = '<td rowspan="3">' + item.provinceNm + '</td>'
   					 	  + '<td rowspan="3">' + item.modelNm + '</td>'
   					 	  + '<td style="text-align: left;">代理商</td>'
   					 	  + '<td>' + formatNumber(item.agentDlCount) + '</td>'
   					 	  + '<td>' + formatNumber(item.agentTradeDlCount) + '</td>'
   					 	  + '<td>' + formatNumber(item.agentRetailDlCount) + '</td>';
   		fragment.appendChild(agentTr);
   					 
   		var directTr = document.createElement('tr');
		directTr.innerHTML = '<td style="text-align: left;">直接管理</td>'
   					       + '<td>' + formatNumber(item.directDlCount) + '</td>'
   					       + '<td>' + formatNumber(item.directTradeDlCount) + '</td>'
   					       + '<td>' + formatNumber(item.directRetailDlCount) + '</td>';
   		fragment.appendChild(directTr);
   		
   		var indirect = document.createElement('tr');
   		
		indirect.innerHTML = '<td style="text-align: left;">间接管理</td>'
	   					  + '<td>' + formatNumber(item.indirectDlCount) + '</td>'
	   					  + '<td>' + formatNumber(item.indirectTradeDlCount) + '</td>'
	   					  + '<td>' + formatNumber(item.indirectRetailDlCount) + '</td>';
   		fragment.appendChild(indirect);
	});
	dlTradeInfo.appendChild(fragment);
	
	// Set bottom lable
	setBottomLableForClass(returnData);
}

function setHeaderLabel(returnData) {
	
	// Set accountMonth to screen
	document.getElementById("period").innerHTML=returnData.period;
	
	var fragmentLabel = document.createDocumentFragment();
	var label 		  = document.createElement('tr');
	var dlTradeInfo   = document.getElementById("dlTradeInfo");
	
	if (para.showTypeDetailRadio == "1") {
		
		label.innerHTML = '<td style="width: 58px;"></td>'
						+ '<td style="width: *px;"></td>'
						+ '<td style="width: 72px;"></td>'
						+ '<td style="width: 48px;">网点店数</td>'
						+ '<td style="width: 48px;">交易店数</td>'
						+ '<td style="width: 48px;">零售店数</td>';
	} else {
		
	
		label.innerHTML = '<td style="width: 60px;"></td>'
						+ '<td style="width: *px;"></td>'
						+ '<td style="width: 50px;">网点店数</td>'
						+ '<td style="width: 50px;">交易店数</td>'
						+ '<td style="width: 50px;">零售店数</td>';
	}
					
   	fragmentLabel.appendChild(label);
   	dlTradeInfo.appendChild(fragmentLabel);
}

function setBottomLableForClass(returnData) {
	
	var dlTradeInfo = document.getElementById("dlTradeInfo");
	var fragment    = document.createDocumentFragment();
	
	var agentTr = document.createElement('tr');
	agentTr.innerHTML = '<td rowspan="3" colspan="2">合计</td>'
				 	  + '<td style="text-align: left;">代理商</td>'
				 	  + '<td>' + formatNumber(returnData.totalAgentDlCount) 		+ '</td>'
				 	  + '<td>' + formatNumber(returnData.totalAgentTradeDlCount) 	+ '</td>'
				 	  + '<td>' + formatNumber(returnData.totalAgentRetailDlCount) 	+ '</td>';
	fragment.appendChild(agentTr);
				 
	var directTr = document.createElement('tr');
	directTr.innerHTML = '<td style="text-align: left;">直接管理</td>'
				       + '<td>' + formatNumber(returnData.totalDirectDlCount) 		+ '</td>'
				       + '<td>' + formatNumber(returnData.totalDirectTradeDlCount) 	+ '</td>'
				       + '<td>' + formatNumber(returnData.totalDirectRetailDlCount) + '</td>';
	fragment.appendChild(directTr);
	
	var indirect = document.createElement('tr');
	indirect.innerHTML = '<td style="text-align: left;">间接管理</td>'
   					   + '<td>' + formatNumber(returnData.totalIndirectDlCount) 		 + '</td>'
   					   + '<td>' + formatNumber(returnData.totalIndirectTradeDlCount)  + '</td>'
   					   + '<td>' + formatNumber(returnData.totalIndirectRetailDlCount) + '</td>';
	fragment.appendChild(indirect);
	
	var totalCountTr = document.createElement('tr');
	totalCountTr.innerHTML = '<td colspan="3">总合计</td>'
				 	  	   + '<td>' + formatNumber(returnData.totalDlCount) 		+ '</td>'
				 	  	   + '<td>' + formatNumber(returnData.totalTradeDlCount) 	+ '</td>'
				 	  	   + '<td>' + formatNumber(returnData.totalRetailDlCount) + '</td>';
	fragment.appendChild(totalCountTr);
	
   	dlTradeInfo.appendChild(fragment);
}

function setBottomLableForTotal(returnData) {
	
	var dlTradeInfo = document.getElementById("dlTradeInfo");
	var fragment    = document.createDocumentFragment();
	
	var agentTr = document.createElement('tr');
	agentTr.innerHTML = '<td rowspan="3">合计</td>'
				 	  + '<td style="text-align: left;">代理商</td>'
				 	  + '<td>' + formatNumber(returnData.totalAgentDlCount) 		+ '</td>'
				 	  + '<td>' + formatNumber(returnData.totalAgentTradeDlCount) 	+ '</td>'
				 	  + '<td>' + formatNumber(returnData.totalAgentRetailDlCount) 	+ '</td>';
	fragment.appendChild(agentTr);
				 
	var directTr = document.createElement('tr');
	directTr.innerHTML = '<td style="text-align: left;">直接管理</td>'
				       + '<td>' + formatNumber(returnData.totalDirectDlCount) 		+ '</td>'
				       + '<td>' + formatNumber(returnData.totalDirectTradeDlCount) 	+ '</td>'
				       + '<td>' + formatNumber(returnData.totalDirectRetailDlCount) + '</td>';
	fragment.appendChild(directTr);
	
	var indirect = document.createElement('tr');
	indirect.innerHTML = '<td style="text-align: left;">间接管理</td>'
   					   + '<td>' + formatNumber(returnData.totalIndirectDlCount) 		 + '</td>'
   					   + '<td>' + formatNumber(returnData.totalIndirectTradeDlCount)  + '</td>'
   					   + '<td>' + formatNumber(returnData.totalIndirectRetailDlCount) + '</td>';
	fragment.appendChild(indirect);
	
	var totalCountTr = document.createElement('tr');
	totalCountTr.innerHTML = '<td colspan="2">总合计</td>'
				 	  	   + '<td>' + formatNumber(returnData.totalDlCount) 		+ '</td>'
				 	  	   + '<td>' + formatNumber(returnData.totalTradeDlCount) 	+ '</td>'
				 	  	   + '<td>' + formatNumber(returnData.totalRetailDlCount) + '</td>';
	fragment.appendChild(totalCountTr);
	
   	dlTradeInfo.appendChild(fragment);
}

//var getColSpanTr = function () {
//		
//	var count = 0;
//	var provinceCd = item.provinceCd;
//		
//	for (var i=0; i<detailData.length; i++) {
//			
//		if (provinceCd == detailData[i].provinceCd) {
//				count = count + 1;
//		}
//	}
//	var colspanTr = count * 3;
//	return colspanTr;
//}
