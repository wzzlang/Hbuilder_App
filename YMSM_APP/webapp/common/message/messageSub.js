var listContainObj 	 = document.getElementById("listContain");
var requestUrl 		 = "common/message/AppMessageListService";
var deleteRequestUrl = "common/message/AppMessageDeleteService/deleteMessageByMsgType";
var messageDetailUrl = "messageDetail.html";
var localData;
var userId;
var unreadQty;

mui.init({
	pullRefresh: {
		container: '#messageRefresh',
		down: {
			callback: pulldownRefresh
		},
	}			
});

if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function(){
			getInitialData();
			mui('#messageRefresh').pullRefresh().pulldownLoading();
			clickDetailEvent();
			deleteMessageEvent();
			setInterval("setTimeInterval()",1000000);
		},1000);
	});
} else {
	mui.ready(function() {
		getInitialData();
		mui('#messageRefresh').pullRefresh().pulldownLoading();
		clickDetailEvent();
		deleteMessageEvent();
		setInterval("setTimeInterval()",1000000);
	});
}
function setTimeInterval(){
	
	mui('#messageRefresh').pullRefresh().pulldownLoading();
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
		listContainObj.innerHTML = "";
		// Call Service
		var para = {userId : userId};
		post_ajax(requestUrl
				 ,para
				 ,function(returnData){
					// Show Message
					showMessageToScreen(returnData);
					mui('#messageRefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
					mui('#messageRefresh').pullRefresh().refresh(true);
				 }
				 ,function(){
					mui('#messageRefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			     }
				 ,false);
}, 60);
}

var clickDetailEvent = function() {

	//跳转到Detail 画面，并传值
	mui('#listContain').on('tap','ul',function(){

		// Prepare Parameter
		var index     = this.getAttribute('id');
		var ulObj       = document.getElementById(index);
		var msgTypeObj  = document.getElementById("msgType_"  + index);
		var titleObj    = document.getElementById("title_"	  + index);
		var readSignObj = document.getElementById("readSign_" + index);
		
		if (document.getElementById("unread_"+ index) != undefined) {
			
			unreadQty--;
			//change readSign
			readSignObj.innerHTML = '<span id="readed_'+index+'" class="com-message-readed"></span>';
			//update new message sign to homepage
	   		updateNewMsgSignToHome(unreadQty);
		}
		
		// Open New Window
		var para = {msgType : msgTypeObj.value
				   ,msgTitle: titleObj.innerText
				   ,msgLiId : ulObj.id}
	  	openWindow(messageDetailUrl, para);
	});
}

var showMessageToScreen = function(returnData) {
	
	//未读消息数量初始值
	unreadQty = 0;
	var fragment = document.createDocumentFragment();
	$.each(returnData.details, function (i, item) {
		ul = document.createElement('ul');
		ul.id 		    = i;
		ul.style.margin = '10px auto';
		ul.className    = 'mui-table-view mui-table-view-chevron';
		ul.innerHTML    = messageContainHTML(i,item);
		fragment.appendChild(ul);
	});
	listContainObj.appendChild(fragment);
	
	//update new message sign to homepage
    updateNewMsgSignToHome(unreadQty);
}

var messageContainHTML = function(i,item){
	
	var isReadSign;
	if(item.readSign == "0"){
		//更新未读消息数量
		unreadQty++;
		isReadSign = '<span id="unread_'+i+'" class="com-message-unread"></span>' // Un-Read
	}else{
		isReadSign = '<span id="readed_'+i+'" class="com-message-readed"></span>' // Read
	}

	var messageContainHTML =
	 '<li class="mui-table-view-cell" style="padding-right:30px;">'
	+'<div class="mui-slider-right mui-disabled">'
		+'<a class="mui-btn mui-btn-red">删除</a>'
	+'</div>'
	+'<div class="mui-table mui-slider-handle">'
		+'<div id="readSign_'+i+'" class="mui-table-cell mui-col-xs-1 mui-text-right" style="padding-right: 3px;">'
			+ isReadSign
		+'</div>'
		+'<div class="mui-table-cell mui-col-xs-12">'
			+'<h4  id="title_'+i+'" class="mui-ellipsis com-message-text" style="padding-top:5px;text-align: left;">'
				+ item.title
			+'</h4>'
			+'<p id="sendTime_'+i+'" class="mui-h6 mui-ellipsis com-message-text" style="color: #007AFF;">'
				+ item.sendTimeStr
			+'</p>'
			+'<p id="content_'+i+'" class="mui-h5 mui-ellipsis com-message-text">'
				+ item.msgContent
			+'</p>'
		+'</div>'
	+'</div>'
	+'<input id="msgType_'+i+'" style="display:none" value="'+item.msgType +'">'
	+'</input>'
	+'</li>';

	return messageContainHTML;
}

function deleteMessageEvent() {
	
	//左滑删除信息
	$(listContainObj).on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条信息？', '删除信息', btnArray, function(e) {
			if (e.index == 0) {
				li.parentNode.removeChild(li);
				requestDelete(li);
			} else {
				setTimeout(function() {
					$.swipeoutClose(li);
				}, 0);
			}
		});
	});
	var btnArray = ['确认', '取消'];
}

function requestDelete(li) {
	
	var para = {userId  : userId
			   ,msgType : li.getElementsByTagName("input")[0].value}
	post_ajax(deleteRequestUrl, para, function(){});
}

var removeMsg = function(li){
	var li = document.getElementById(li);
	listContainObj.removeChild(li);
}

var updateMsg = function(sendTime,content,li){
	document.getElementById('sendTime_'+li).innerText = sendTime;
	document.getElementById('content_'+li).innerText = content;
}

function updateNewMsgSignToHome(unreadQty){
	var homePage = plus.webview.getWebviewById('../homepage/homePage.html');
	unreadQty > 0 ? homePage.evalJS('showNewMsgSign()')
				  : homePage.evalJS('cleanNewMsgSign()')
}
