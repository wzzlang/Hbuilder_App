var noticeTitleObj	 = document.getElementById("noticeTitle");
var processDateObj	 = document.getElementById("processDate");
var noticeContentObj = document.getElementById("noticeContent");
var requestUrl 		 = "mmz/mmza05/MMZA05NoticeDetailService";
var localDataObj;
(function($, doc) {
	$.init();
	$.plusReady(function() {
		// Get Parameter
		localDataObj   = eval('('+localStorage.getItem("localData")+')');
		// Run Message Detail Service
		var para = prepareNoticeDetailService();
		post_ajax(requestUrl,para,function(returnData){
			// Show Message
			showNoticeToScreen(returnData);
		});
		// Tap scroll to header
		scrollToHeader();
	});
}(mui, document));

var prepareNoticeDetailService = function() {
	return para = {noticeId : eval(JSON.stringify(plus.webview.currentWebview().noticeId))
				  ,userId   : localDataObj.userId}
}

var showNoticeToScreen = function(returnData) {
	if (returnData.dataNotExistFlg == "1") {
		showErrorMsg("数据不存在，请重新查询");
		return;
	}
	
	noticeTitleObj.innerHTML   = returnData.noticeTitle;
	processDateObj.innerHTML   = returnData.processDate;
	noticeContentObj.innerHTML = returnData.noticeContent;
}
