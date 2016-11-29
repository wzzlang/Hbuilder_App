var userCardQueryUrl = "../../mma/mmaz08/mmaz08_userCardQuery.html";
var userCardInputUrl = "../../mma/mmaa08/mmaa08_userCardInput.html";

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
			
			switch (this.id){
				case "MMAA08" :
					openPreloadWindow(userCardInputUrl, para, this.id);
					break;
				case "MMAZ08" :
					openPreloadWindow(userCardQueryUrl, para, this.id);
					break;
			}
		});
	}
}