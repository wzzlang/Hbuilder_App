var noticeContainObj = document.getElementById("noticeContain");
var requestUrl = "mmz/mmza05/MMZA05NoticeListService";
var noticeDetailUrl = "mmza05_noticeDetail.html";
var localData;
var userId;
var lastNoticeId;
var listCount = 0;

mui.init({
	pullRefresh: {
		container: '#noticeRefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			callback: pullupRefresh
		}
	}
});

if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function(){
			getInitialData();
			mui('#noticeRefresh').pullRefresh().pulldownLoading();
			clickDetailEvent();
		},1000);
	});
} else {
	mui.ready(function() {
		getInitialData();
		mui('#noticeRefresh').pullRefresh().pulldownLoading();
		clickDetailEvent();
	});
}

function getInitialData() {
	
	localData = eval('('+localStorage.getItem("localData")+')');
	userId 	  = localData.userId;
}

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		// Clear List Contain
		noticeContainObj.innerHTML = "";
		listCount = 0;
		// Call Service
		var para = {userId : userId};
		post_ajax(requestUrl
				 ,para
				 ,function(returnData){
					// Show Notice
					showNoticeToScreen(returnData);
					mui('#noticeRefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
					mui('#noticeRefresh').pullRefresh().refresh(true);
				 }
				 ,function(){
				 	mui('#noticeRefresh').pullRefresh().endPulldownToRefresh();
				 }
				 ,false);
	}, 1500);
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
     	
		// Call Service
		var para = {userId 	     : userId
				   ,lastNoticeId : lastNoticeId};
		post_ajax(requestUrl
				, para
				, function(returnData){
					// Show Notice
					showNoticeToScreen(returnData);
					// If no more data, show notice
					if (returnData.details.length > 0) {
						mui('#noticeRefresh').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#noticeRefresh').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
					}
				}
				,function() {
					mui('#noticeRefresh').pullRefresh().endPullupToRefresh(false);
				}
				,false);
	}, 1500);
}

var showNoticeToScreen = function(returnData) {
	
	var fragment = document.createDocumentFragment();
	$.each(returnData.details, function (i, item) {
		ul              = document.createElement('ul');
		ul.id 		    = "notice_"+listCount;
		ul.className    = 'mui-table-view mui-table-view-chevron';
		ul.style.margin = '10px auto';
		ul.innerHTML    = noticeContainHTML(listCount,item);
		fragment.appendChild(ul);
		
		listCount++;
	});
	noticeContainObj.appendChild(fragment);
	lastNoticeId = returnData.lastNoticeId;
}

var clickDetailEvent = function() {
	
	//跳转到Detail 画面，并传值
	mui('#noticeContain').on('tap','ul',function(){
		
		// Prepare Parameter
		var ulObj = document.getElementById(this.getAttribute('id'));
		
		// Open New Window
		var para = {noticeId : ulObj.getElementsByTagName("input")[0].value}
	  	openWindow(noticeDetailUrl, para);
	});
}

var noticeContainHTML = function(i,item){
	
	var isTopSign;
			
	if(item.topSign == "1"){
		isTopSign = '<span class="com-notice-top-sign"></span>'
	}else{
		isTopSign = ''
	}

	var noticeContainHTML = 
		'<li class="mui-table-view-cell" style="padding-right:30px;">'
		+'<div class="mui-table">'
			+'<div class="mui-table-cell mui-col-xs-2 mui-text-right" style="padding-right: 3px;">'
				+ '<span class="com-notice-horn-sign"></span>'
			+'</div>'
			+'<div class="mui-table-cell mui-col-xs-12">'
				+'<h4  id="title_'+i+'" class="mui-ellipsis com-message-text" style="padding-top:5px;text-align: left;">'
					+ item.noticeTitle
				+'</h4>'
				+'<p id="processDate_'+i+'" class="mui-ellipsis common-font-h6" style="color: #7F7F7F;">'
					+ item.processDate
				+'</p>'
			+'</div>'
        	+'<div id="topSign_'+i+'" class="mui-table-cell mui-col-xs-1 mui-text-right">'
        		+ isTopSign
        	+'</div>'
    	+'</div>'
    	+'<input id="noticeId_'+i+'" style="display:none" value="'+item.noticeId +'">'
		+'</input>'
		+'</li>';
	
	return noticeContainHTML;
}
