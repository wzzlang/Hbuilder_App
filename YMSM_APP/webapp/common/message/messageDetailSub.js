var msgDetailContainObj	= document.getElementById("msgDetailContain");
var requestUrl 		 	= "common/message/AppMessageDetailService";
var deleteRequestUrl 	= "common/message/AppMessageDeleteService/deleteMessage";
var mmfz03UnfinishedUrl = "../../mmf/mmfz03/mmfz03_unfinished.html";
var localDataObj;
var listCount = 0;
var lastMsgId;

mui.init({
	pullRefresh: {
		container: '#msgDetailRefresh',
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
			mui('#msgDetailRefresh').pullRefresh().pulldownLoading();
			deleteMsgDetail();
			transferToOtherScreen();
		},1000)
	});
} else {
	mui.ready(function() {
		getInitialData();
		mui('#msgDetailRefresh').pullRefresh().pulldownLoading();
		deleteMsgDetail();
		transferToOtherScreen();
	});
}

function deleteMsg(msgLiId,msgPage){
	msgPage.evalJS('removeMsg("'+msgLiId+'")');
}

function reflashMsg(i,msgLiId,msgPage){
	var sendTime = document.getElementById('sendTime_'+i).innerText;
	var content  = document.getElementById('content_'+i).innerText;
	msgPage.evalJS('updateMsg("'+sendTime+'"'+',"'+content+'"'+','+msgLiId+')');
	
}
function getInitialData() {
	
	localDataObj = eval('('+localStorage.getItem("localData")+')');
}

function deleteMsgDetail() {
	
	//点击删除按钮
	mui(msgDetailContainObj).on('tap','a',function(){
		var msgLiId = eval(JSON.stringify(plus.webview.getWebviewById("messageDetail.html").msgLiId))
		var msgPage = plus.webview.getWebviewById('messageSub.html');
		var i 		= this.getAttribute('id');
		var msgId   = document.getElementById('msgId_'+i).value;
		var msgObj 	= document.getElementById('message_'+i)
		
		//获取对应的对象
		var btnArray = ['取消', '删除'];
		mui.confirm('确认删除吗？删除后不可恢复', '删除消息', btnArray, function(e) {
			if (e.index == 1) {
				
				para = {
					msgId : msgId
				};
				//删除对应内容
				msgDetailContainObj.removeChild(msgObj);
				//当详情无一条记录则删除msg首页的记录
				if(msgDetailContainObj.childElementCount == 0){
					deleteMsg(msgLiId,msgPage);
				}else{
				//当删除第一条详情记录时，将第二条记录置顶
					var firstId = msgDetailContainObj.firstChild.getElementsByTagName('a')[0].id;
					reflashMsg(firstId,msgLiId,msgPage);
				}
				//点击确认后删除数据
				post_ajax(deleteRequestUrl,para,function(){});
			} else {
				return;
			}
		})
	});
}

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		// Clear List Contain
		msgDetailContainObj.innerHTML = "";
		listCount = 0;
		// Call Service
		var para = {userId    : localDataObj.userId
				   ,msgType   : eval(JSON.stringify(plus.webview.getWebviewById("messageDetail.html").msgType))}
		post_ajax(requestUrl
				 ,para
				 ,function(returnData){
					// Show Message
					showMessageToScreen(returnData);
					mui('#msgDetailRefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
					mui('#msgDetailRefresh').pullRefresh().refresh(true);
				 }
				 ,function(){
					mui('#msgDetailRefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
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
		var para = {userId    : localDataObj.userId
				   ,msgType   : eval(JSON.stringify(plus.webview.getWebviewById("messageDetail.html").msgType))
				   ,lastMsgId : lastMsgId}
		post_ajax(requestUrl
				, para
				, function(returnData){
					// Show Message
					showMessageToScreen(returnData);
					// If no more data, show message
					if (returnData.details.length > 0) {
						mui('#msgDetailRefresh').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#msgDetailRefresh').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
					}
				}
				, function(){
					mui('#msgDetailRefresh').pullRefresh().endPullupToRefresh(false);
				}
				,false);
	}, 1500);
}

var showMessageToScreen = function(returnData) {
	var fragment = document.createDocumentFragment();
	$.each(returnData.details, function (i, item) {
		ul              = document.createElement('ul');
		ul.id           = "message_"+listCount;
		ul.style.margin = '10px auto';
		ul.className    = 'mui-table-view mui-table-view-chevron';
		ul.innerHTML    = messageContainHTML(listCount,item);
		fragment.appendChild(ul);
	
		listCount++;
	});
	msgDetailContainObj.appendChild(fragment);
	lastMsgId = returnData.lastMsgId;
}

var messageContainHTML = function(i,item){
	
	var messageContainHTML = '<li id ="'+i+'" class="mui-table-view-cell" style="padding:20px 15px; padding-right:20px;">'
								+'<div class="mui-table">'
									+'<div class="mui-table-cell mui-col-xs-12">'
										+'<p  id ="sendTime_'+i+'" class="mui-h6 mui-ellipsis com-message-text" style="color:#27AADE">'+item.sendTimeStr+'</p>'
										+'<p id="content_'+i+'" class="com-message-text" style="padding-top:5px;text-align: left;">'+item.msgContent+'</p>'
									+'</div>'
									+'<div class="mui-table-cell mui-col-xs-1 mui-text-right">'
										+'<a id ="'+i+'" class="mui-tab-item">'
											+'<span class="com-message-delete"></span>'
											+'<input id="msgId_'+i+'" style="display:none" value="'+item.msgId +'"></input>'
										+'</a>'
									+'</div>'
								+'</div>'
								+'<input id="dataId_'+i+'" style="display:none" value="'+item.dataId +'"></input>'
							+'</li>'
	return messageContainHTML;
}


function transferToOtherScreen() {
	
	//点击删除按钮
	mui(msgDetailContainObj).on('tap','li',function(){

		var i	    = this.getAttribute('id');
		var msgType = eval(JSON.stringify(plus.webview.getWebviewById("messageDetail.html").msgType))
		var dataId  = document.getElementById('dataId_'+i).value;
		
		var para		= "";
		var transferUrl = "";
		
		if (msgType == "01" || msgType == "04") { // Receivement Msg
			para 		= {shipmentId  : dataId
						  ,shipRecvFlg : "1"}; // Ship
			transferUrl = mmfz03UnfinishedUrl;
		}
		
		if (msgType == "02" || msgType == "05") { // Shipment Msg
			para 		= {shipmentId  : dataId
						  ,shipRecvFlg : "2"}; // Recv
			transferUrl = mmfz03UnfinishedUrl;
		}

		if (transferUrl != "") {
			openWindow(transferUrl, para);
		}
	});
}