var receiveScanUrl 		 = "../../mmf/mmfa01/mmfa01_receivement.html";
var shipScanUrl 		 = "../../mmf/mmfa02/mmfa02_shipment.html";
var specifyShowCarUrl    = "../../mmf/mmfa03/mmfa03_specifyShowCar.html";
var inOutInquiryUrl 	 = "../../mmf/mmfz01/mmfz01_inOutRetrieve.html";
var inOutAnalysUrl 		 = "../../mmf/mmfz02/mmfz02_inOutAnalys.html";
var unFinishedInquiryUrl = "../../mmf/mmfz03/mmfz03_unfinished.html";

(function($, doc) {
	$.plusReady(function() {
		// Get Parameter
		initializScreen();
		menuTapEvent();
	});
}(mui, document));

function initializScreen() {
	
	var funcList = eval(JSON.stringify(plus.webview.currentWebview().funcList));
	
	for (var i=0; i<funcList.length; i++) {
		document.getElementById(funcList[i]).style.display = "block";
	}
}

function menuTapEvent() {
	
	var functionListObj = document.getElementById('functionList').getElementsByTagName('ul');
	for (var i=0; i<functionListObj.length; i++) {
		functionListObj[i].addEventListener("tap", function() {
			
			var para = {parentMenuId : this.id};
			switch(this.id) {
				case "MMFA01" :
					openWindow(receiveScanUrl, para);
					break;
				case "MMFA02" :
					openWindow(shipScanUrl, para);
					break;
				case "MMFA03" :
					openWindow(specifyShowCarUrl, para);
					break;
				case "MMFZ01" :
					openWindow(inOutInquiryUrl, para);
					break;
				case "MMFZ02" :
					openWindow(inOutAnalysUrl, para);
					break;
				case "MMFZ03" :
					openWindow(unFinishedInquiryUrl, para);
					break;
			}
		});
	}
}