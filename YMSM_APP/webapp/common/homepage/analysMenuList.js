var commonRetrieveUrl = "../../mma/common/commonRetrieve.html";

(function($, doc) {
	$.plusReady(function() {
		
		// Get Parameter
		initializScreen();
		menuTapEvent();
	});
}(mui, document));

function initializScreen() {
	
	var windowId = eval(JSON.stringify(plus.webview.currentWebview().id));
	if (windowId == "analysMenuDealer") {
		document.getElementById("MMAZ09").style.display = "none";
	}
}

function menuTapEvent() {
	
	var functionListObj = document.getElementById('functionLists').getElementsByTagName('ul');
	for (var i=0; i<functionListObj.length; i++) {
		functionListObj[i].addEventListener("tap", function() {
			
			var para = {parentMenuId : this.id};
			openPreloadWindow(commonRetrieveUrl, para, this.id);
		});
	}
}