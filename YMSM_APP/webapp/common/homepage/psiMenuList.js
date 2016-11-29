var commonRetrieveUrl = "../../mma/common/commonRetrieve.html";
var analysMenuListUrl = "analysMenuList.html";

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
		document.getElementById(funcList[i]).style.display = "inline-block";
	}
}

function menuTapEvent() {
	
	var functionListObj = document.getElementById('functionList').getElementsByTagName('li');
	for (var i=0; i<functionListObj.length; i++) {
		functionListObj[i].addEventListener("tap", function() {
			
			var para = {parentMenuId : this.id};
			if (this.id == "analysMenu" || this.id == "analysMenuDealer") {
				
				openPreloadWindow(analysMenuListUrl, para, this.id);
			}else {
				
				openPreloadWindow(commonRetrieveUrl, para, this.id);
			}
		});
	}
}