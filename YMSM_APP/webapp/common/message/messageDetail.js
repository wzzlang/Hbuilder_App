var conTitleObj 		= document.getElementById("con_title");
var messageDetailSubUrl = "messageDetailSub.html";
 
mui.init({
	subpages:[{
		url:messageDetailSubUrl,
		id :messageDetailSubUrl,
		styles:{
			top: '45px',
			bottom: '0px',
		},
	}]
});

mui.plusReady(function() {
	
	setTimeout(function(){
		conTitleObj.innerHTML = eval(JSON.stringify(plus.webview.currentWebview().msgTitle))
	},1000)
	
	document.querySelector('header').addEventListener('tap',function () {
		var	contentWebview = plus.webview.currentWebview().children()[0];
		contentWebview.evalJS("mui('#msgDetailRefresh').pullRefresh().scrollTo(0,0,100)");
	});
});
