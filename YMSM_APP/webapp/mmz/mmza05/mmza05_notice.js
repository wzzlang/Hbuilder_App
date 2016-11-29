var noticeSubUrl = "mmza05_noticeSub.html";
 
mui.init({
	subpages:[{
		url:noticeSubUrl,
		id :noticeSubUrl,
		styles:{
			top	  : '45px',
			bottom: '0px',
		},
	}]
});

mui.plusReady(function() {
	
	document.querySelector('header').addEventListener('tap',function () {
		var	contentWebview = plus.webview.currentWebview().children()[0];
		contentWebview.evalJS("mui('#noticeRefresh').pullRefresh().scrollTo(0,0,100)");
	});
});
