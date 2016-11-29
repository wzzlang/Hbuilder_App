var noticeHomePgAreaObj   		 = document.getElementById('noticeHomePgArea');
var picSliderContainObj   		 = document.getElementById('picSliderContain');
var picSliderIndicatorContainObj = document.getElementById('picSliderIndicatorContain');
var psiMenuUrl 		      		 = "psiMenuList.html";
var userCardMenuUrl       		 = "userCardMenuList.html";
var whInOutMenuUrl        		 = "whInOutMenuList.html";
var noticeUrl 	          		 = "../../mmz/mmza05/mmza05_notice.html";
var noticeDetailUrl 	         = "../../mmz/mmza05/mmza05_noticeDetail.html";
var noticeRequestURL      		 = "mmz/mmza05/MMZA05NoticeListService";
var scrollingRequestURL   		 = "mmz/mmza05/MMZA05NoticeScrollingListService";

// Get Parameter
var localDataObj        = eval('('+localStorage.getItem("localData")+')');
var functionData="";
var targetTabId;

(function($, doc) {
	$.init({
		swipeBack:true //启用右滑关闭功能
	});
	$.plusReady(function() {
		
		loadingScrollingPicSlider();
		loadingNoticeSlider();
		initializScreen();
		menuTapEvent();
	});
}(mui, document));

function hiddenSubPage() {
	if(targetTabId==null) return;
	plus.webview.getWebviewById(targetTabId).hide();
}

function loadingScrollingPicSlider() {
	
	getScrollingPicInfo();
}

function loadingNoticeSlider() {
	
	getNoticeInfo();
}

function initializScreen() {
	
	// Function List Data Security By user
	var orgClass = localDataObj.orgClass;
	if (orgClass == "1") { // Organization
		var orgType	 = localDataObj.orgType;
		if (orgType == "1") functionData = branchFunc; // Branch
		if (orgType == "2") functionData = officeFunc; // Office
	} 
	if (orgClass == "2") { // Dealer
		var dealerType 		= localDataObj.dealerType;
		var dealerWhPICType = localDataObj.dealerWhPICType
		if (dealerWhPICType == "0") { //  Normal Dealer
			if (dealerType == "1") functionData = dealerFunc; 		// Dealer
			if (dealerType == "2") functionData = subDealerFunc; 	// Sub Dealer
			if (dealerType == "6") functionData = subSubDealerFunc; // Sub Sub Dealer
		} else { // Dealer WH PIC
			functionData = dealerWHFunc; // Dealer WH PIC
		}
	}
	
	for (var i=0; i<functionData.length; i++) {
		var mainFunctionObj = document.getElementById(functionData[i].id);
		var subFuncListObj 	= document.getElementById(functionData[i].id+"_SUBLIST");
		mainFunctionObj.style.display = "inline-block";
		subFuncListObj.value  	  	  = functionData[i].func;
	}
}

function menuTapEvent() {
	
	var functionListObj = document.getElementById('functionList').getElementsByTagName('li');
	for (var i=0; i<functionListObj.length; i++) {
		functionListObj[i].addEventListener("tap", function() {
			
			var para = {parentMenuId : this.id
					   ,funcList  	 : document.getElementById(this.id+"_SUBLIST").value};
			
			targetTabId = this.id;
			switch (this.id){
				case "MAIN_01" :
					mui.openWindow({
						url	   : psiMenuUrl,
						id     : 'MAIN_01',
						styles : {top : '0px' , bottom : '51px'},
						preload: true,
						extras : para
					});
					break;
				case "MAIN_02" :
					mui.openWindow({
						url	   : userCardMenuUrl,
						id     : 'MAIN_02',
						styles : {top : '0px' , bottom : '51px'},
						preload: true,
						extras : para
					});
					break;
				case "MAIN_03" :
					mui.openWindow({
						url	   : whInOutMenuUrl,
						id     : 'MAIN_03',
						styles : {top : '0px' , bottom : '51px'},
						preload: true,
						extras : para
					});
					break;
			}
		});
	}
	
	//transfer to noticePage
	noticeHomePgAreaObj.addEventListener("tap",function(){
		
		openWindow(noticeUrl,null);
	})
}

function getNoticeInfo() {
	
	var para= {
		userId : localDataObj.userId
	};
	
	post_ajax(noticeRequestURL, para, function(returnData){
		
		noticeHomePgAreaObj.innerHTML = '<li class="mui-table-view-cell">'
											+'<div class="new-notice">'
												+'<i class="new-notice-bkg"></i>'
											+'</div>'
											+'<div class="new-notice-a">'
												+'<div id="noticeTitleContain" class="hot-list">'
												+'</div>'
											+'</div>'
										+'</li>';
										
		var noticeTitleContainObj = document.getElementById('noticeTitleContain');
		
		// If no notice, show no data
		if (returnData.details.length == 0) {
			noticeTitleContainObj.innerHTML = '<a class="hot-list-a">暂无公告内容</a>';
			return;
		}
		
		$.each(returnData.details, function (i, item) {
			a = document.createElement('a');
			a.className = 'hot-list-a';
			a.innerHTML = item.noticeTitle;
			noticeTitleContainObj.appendChild(a);
		});
		
		noticeSlider();
	}, function(){}, false);
}

var noticeSlider = function(){
	
	var a = $(".hot-list-a").length;
	var b = 0;
	if (a > 1) {
		$(".hot-list").append($(".hot-list").find(".hot-list-a").eq(0).clone());
	};
	setInterval(function(){
		b++;
		$(".hot-list").addClass('ani').css("-webkit-transform","translateY(-"+b*20+"px )");
		setTimeout(function(){
			if (b == a) {
				$(".hot-list").removeClass('ani').css("-webkit-transform","translateY(0)");
				b = 0;
			}
		}, 300)
	},3000);
}

var getScrollingPicInfo = function() {
	
	var para= {
		userId : localDataObj.userId
	};
	
	post_ajax(scrollingRequestURL, para, function(returnData){
		
		// If no notice, do not show default image
		if (returnData.details.length == 0) {
			picSliderContainObj.classList.remove('mui-slider-loop');
			picSliderContainObj.innerHTML = '<div class="com-slider-item-single"><a href="#"><img src="../../../images/home_img.jpg"></a></div>';
		};
		
		picSliderContainObj.style.display 		   = "block";
		picSliderIndicatorContainObj.style.display = "block";
		
		var details  = returnData.details;
		$.each(details, function (i, item) {
			
			// 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播)
			if (i==0) {
				picDivObj 			= document.createElement('div');
				picDivObj.className = "mui-slider-item mui-slider-item-duplicate";
				picDivObj.innerHTML = '<a href="#">'
							 			+ details[details.length-1].scrollingPic
						 			+ '</a>';
				picSliderContainObj.appendChild(picDivObj);
			}
			
			// 第N张
			picDivObj 			= document.createElement('div');
			picDivObj.className = "mui-slider-item";
			picDivObj.innerHTML = '<a href="#">'
						 			+ item.scrollingPic
						 			//+ '<p class="mui-slider-title">'+item.title+'</p>'
						 		+ '</a>';
			picDivObj.value		= item.noticeId;
			picSliderContainObj.appendChild(picDivObj);
			
			// 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播)
			if (i==details.length-1) {
				picDivObj = document.createElement('div');
				picDivObj.className = "mui-slider-item mui-slider-item-duplicate";
				picDivObj.innerHTML = '<a href="#">'
							 			+ details[0].scrollingPic
							 		+ '</a>';
				picSliderContainObj.appendChild(picDivObj);
			}
		});
		
		$.each(returnData.details, function (i, item) {
			picDivObj = document.createElement('div');
			if (i==0) {
				picDivObj.className = "mui-indicator mui-active";
			} else {
				picDivObj.className = "mui-indicator";
			}
			picSliderIndicatorContainObj.appendChild(picDivObj);
		});
		
		mui("#picSlider").slider({interval: 5000});
		
		// If no notice, can not link to notice detail
		if (returnData.details.length != 0) {
			scrollingPicTapEvent();
		}
	}, function(){}, false);
}

var scrollingPicTapEvent = function() {
	
	var picSliderContainListObj = picSliderContainObj.getElementsByTagName('div');
	for (var i=0; i<picSliderContainListObj.length; i++) {
		picSliderContainListObj[i].addEventListener("tap", function() {
			var para = {noticeId : this.value};
			openWindow(noticeDetailUrl, para);
		});
	}
}
