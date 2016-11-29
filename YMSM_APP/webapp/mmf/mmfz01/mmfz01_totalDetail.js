var localData 			 = eval('('+localStorage.getItem("localData")+')');
var habitSetDataObj      = eval('('+localStorage.getItem("habitSetData")+')');
var inOutTotalObj        = document.getElementById("inOutTotal");
var detailRetrieveRqsURL = "mmf/mmfz01/MMFZ01ShipRecvTotalRetrieve";
var para;
var periodFrom;
var periodTo;
var userId;

(function($, doc) {
	$.init();
	$.plusReady(function() {

		retrieveEvent();
		
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function retrieveEvent(){
	
	periodFrom = eval(JSON.stringify(plus.webview.currentWebview().periodFrom));
	periodTo   = eval(JSON.stringify(plus.webview.currentWebview().periodTo));
	userId 		   = localData.userId;
	
	var para= {
		userId      :  userId
	   ,periodFrom  :  periodFrom
	   ,periodTo  	:  periodTo
	};
	
	//后台获取数据
	var returnData= post_ajax(detailRetrieveRqsURL,para,function(returnData){
		
		// Set Header to screen
		setHeaderInfo(returnData);
		
		setInOutTotalData(returnData);
	});
};

function setHeaderInfo (returnData) {
	document.getElementById("period").innerHTML=returnData.period;
}

function setInOutTotalData(returnData) {
	
	var inOutTotalDetails  = returnData.details;
	var inOutTotalHtmlGrid = "";
	var dbSystemDate	   = getDbDateFormat(getFormatDate(new Date()));
	var display		       = (periodTo < dbSystemDate) ? "none" : "";

	inOutTotalHtmlGrid ='<tr style="font-weight:bold;">' +
				      		'<td style="width:*;border-bottom: 0px;text-align: left;"></td>'   +
 				      		'<td style="width:15%;border-bottom: 0px;text-align: right;">入库</td>'  +
 				      		'<td style="width:15%;border-bottom: 0px;text-align: right;">出库</td>' +
 				      		'<td style="width:15%;border-bottom: 0px;text-align: right;display:'+display+'">库存</td>' +
			   	  		'</tr>'+
					   	'<tr style="font-weight:bold;">' +
						    '<td style="width:*;padding-top: 0px;text-align: left;"></td>'   +
		 				    '<td style="width:15%;padding-top: 0px;text-align: right;">' + formatNumber(returnData.inQty) + '</td>'  +
		 				    '<td style="width:15%;padding-top: 0px;text-align: right;">' + formatNumber(returnData.outQty) + '</td>' +
		 				    '<td style="width:15%;padding-top: 0px;text-align: right;display:'+display+'">' + formatNumber(returnData.stockQty) + '</td>' +
					   	'</tr>';
				   	  
	$.each(inOutTotalDetails, function (i, item) {
		
		inOutTotalHtmlGrid += '<tr>' +
					      		  '<td style="width:*;text-align: left;">'   + operateModelShow(item) + '</td>'   +
			 				      '<td style="width:15%;text-align: right;">' + formatNumber(item.inQty) + '</td>'  +
			 				      '<td style="width:15%;text-align: right;">' + formatNumber(item.outQty) + '</td>' +
			 				      '<td style="width:15%;text-align: right;display:'+display+'">' + formatNumber(item.stockQty) + '</td>' +
				   	  		  '</tr>';
	});
	
	inOutTotalObj.innerHTML = inOutTotalHtmlGrid;
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
	
		modelShowUp = item.productCd + '&nbsp&nbsp';
	}
	if (modelNmDisp == "1" && modelCdDisp == "1") {
		item.productCd.trim() == '' ? modelShowUp = item.modelNm + '</br>' + item.colorNm
							 		: modelShowUp = item.productCd + '</br>' + item.modelNm + '</br>' + item.colorNm
	}
    return modelShowUp;
}