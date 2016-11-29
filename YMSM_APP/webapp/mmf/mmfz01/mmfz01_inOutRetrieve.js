var localData = eval('('+localStorage.getItem("localData")+')');
var dayFromPickerObj 	= document.getElementById("dayFromPicker");
var dayToPickerObj 	    = document.getElementById("dayToPicker");
var dbDateFromObj 		= document.getElementById("dbDateFrom");
var dbDateToObj 		= document.getElementById("dbDateTo");
var retrieveBtnObj      = document.getElementById("retrieveBtn");
var shipRecvInfo        = document.getElementById("shipRecvInfo");
var headerRetrieveRqsURL    = "mmf/mmfz01/MMFZ01ShipRecvHeaderRetrieve";
var inOutDetailHtmlUrl      = "mmfz01_detail.html";
var inOutTotalDetailHtmlUrl = "mmfz01_totalDetail.html";
var para = [];

(function($, doc) {
	$.init();
	$.ready(function() {
		initCondition();
		datePickEvent(); 
		retrieveEvent();
		clickDetailEvent();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function initCondition(){
	
	pickerCurrentDay("dayFromPicker");
	pickerCurrentDay("dayToPicker");
}

function retrieveEvent(){
	
	retrieveBtnObj.addEventListener('tap', function(event) {
		
		onRetrieve();
	},false)
}

function onRetrieve(){
	
	initialGrid(shipRecvInfo);
	
	// Date Range Check
	if (!dateRangeCheck()) return false;
	
	// Search Condition Data
	var para = prepareSearchData();
	
	//后台获取数据
	post_ajax(headerRetrieveRqsURL,para,function(returnData){
		
		//clear table cells
		shipRecvInfo.innerHTML = '';
		var fragment = document.createDocumentFragment();
		
		//表头
		var headerTr = setHeaderLabel();
		fragment.appendChild(headerTr);
		
		//循环数据填入表格
		var tr;
		$.each(returnData.details, function (i, item) {
			tr = document.createElement('tr');
			tr.id = i;
			tr.innerHTML = '<td id="processDate_'+i+'" style="text-align: center;">'+item.processDate+'</td>'
			             + '<td style="text-align: right;">'+formatNumber(item.receiveQty)+'</td>'
			             + '<td style="text-align: right;">'+formatNumber(item.shipQty)+'</td>'
			fragment.appendChild(tr);
		});
		
		//合计栏数据
		var footerTr = resetFooterLable(returnData.totalRecvQty,returnData.totalShipQty);
		fragment.appendChild(footerTr);
	
		shipRecvInfo.appendChild(fragment);
	});
};

function initialGrid(shipRecvInfo) {
	
	//clear table cells
	shipRecvInfo.innerHTML = '';
	
	var fragment = document.createDocumentFragment();
	
	var headerTr = setHeaderLabel();
	fragment.appendChild(headerTr);
	
	var footerTr = resetFooterLable(0,0);
	fragment.appendChild(footerTr);
	
	shipRecvInfo.appendChild(fragment);
}

var setHeaderLabel = function() {
	
	//表头
	var headerTr = document.createElement('tr');
	headerTr.innerHTML = '<td style="text-align: center;">日期</td>'
					   + '<td style="text-align: center;">入库</td>'
					   + '<td style="text-align: center;">出库</td>';
	return headerTr;
}

var resetFooterLable = function(totalRecvQty, totalShipQty) {
	
	var footerTr         = document.createElement('tr');
	footerTr.innerHTML   = '<td style="text-align: center;">合计</td>' +
				     	   '<td style="text-align: right;">' + formatNumber(totalRecvQty) + '</td>' +
				     	   '<td style="text-align: right;">' + formatNumber(totalShipQty) + '</td>';
				     	   
	if (totalRecvQty > 0 || totalShipQty > 0) {
		footerTr.id = -1;
	}
	
	return footerTr;
}

var clickDetailEvent = function() {
	
	mui(shipRecvInfo).on('tap','tr',function(){
		
		var id = this.getAttribute('id');
		
		if (id == null) return;

		// Detail
		if (id >= 0) {
			
			var dbProcessDate = document.getElementById("processDate_"+this.getAttribute('id')).innerText.replace(/-/g,"");
			inOutDetailInfo = {
				processDate:dbProcessDate
			};
			//跳转到明细画面并传值
			openWindow(inOutDetailHtmlUrl, inOutDetailInfo);
		}
		
		// Footer
		if (id == -1) {
			
			inOutDetailInfo = {
				periodFrom : dbDateFromObj.value,
				periodTo   : dbDateToObj.value
			};
			//跳转到明细画面并传值
			openWindow(inOutTotalDetailHtmlUrl, inOutDetailInfo);
		}

	});
}

var dateRangeCheck = function(){
	// Start Date <= End Date Check
	// Start Date ~ End Date, not exceed 1 Month Check
	return dateCompareLeCheck(dbDateFromObj.value, dbDateToObj.value, "开始日", "结束日")
		&& monthsIntevalCheck(dayFromPickerObj.innerHTML, dayToPickerObj.innerHTML, 1, "日期");
}

var prepareSearchData = function() {
	
	var para = {
		        userId      : localData.userId
			   ,periodFrom  : dbDateFromObj.value
		       ,periodTo    : dbDateToObj.value
	    };
	
	return para;
}