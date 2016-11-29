var localData           = eval('('+localStorage.getItem("localData")+')');
var getSubDealerInfoUrl = "mmf/mmfa03/MMFA03GetDealerInfo";
var detailRequestUrl    = "mmf/mmfa03/MMFA03GetShowCarInfo";
var confirmUrl    		= "mmf/mmfa03/MMFA03SpecifiesShowCarService";
var headPickerInfoObj   = document.getElementById("headPickerInfo");
var showCarContainObj   = document.getElementById("showCarContain");
var subDealerIdObj      = document.getElementById("subDealerId");
var specifyDealerIdObj  = document.getElementById("specifyDealerId");
var totalQtyObj    	    = document.getElementById("totalQty");
var totalSpcfQtyObj	    = document.getElementById("totalSpcfQty");
var submitBtnObj        = document.getElementById("submitBtn");
var pickerData   	    = [];
var DISPLAY 			= "";
var NONEDISPLAY 		= "none";
var subDealerPicker;
var specifyDealerPicker;
var totalQty;
var totalSpcfQty = 0;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		retrieveEvent();
		helperEvent();
		confirmEvent();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function retrieveEvent(){
	//获取用户身份
	var dealerType = localData.dealerType;
	
	if (dealerType == "1") {//Dealer
		headPickerInfoObj.style.display   = DISPLAY;
		showCarContainObj.style.marginTop = "82px";
		searchWhenDealer();
	}
	if (dealerType == "2") {// Sub Dealer
		headPickerInfoObj.style.display = NONEDISPLAY;
		searchWhenSubDl();
	} 
};

function searchWhenDealer(){
	
	var para= {userId       :  localData.userId};
	
	//后台获取数据
	var returnData= post_ajax(getSubDealerInfoUrl,para,function(returnData){
		
		var subDealerData = [];
		//循环填充数据
		$.each(returnData.dealerInfoList, function (i, item) {
			//构造dataPicker的值
			var subDealerInfo = {id  : item.dealerId 
							   , name: item.dealerNm
							   , type: item.dealerType}
			subDealerData.push(subDealerInfo);
		});
		pickerData 	   = subDealerData;
		showSubDlHelper("subDealerPicker");
	});
}

function searchWhenSubDl(){
	
	var para= {userId       :  localData.userId};
	searchSpecifyCarInfo(para);
}

function changeQtyEvent(){
	
	mui('.mui-checkbox').on('change', 'input', function() {
		if (this.checked) {
			//展车数量+1
			totalSpcfQty = totalSpcfQty + 1;
			//set current show type value
			this.value = "2";//展车
		} else {
			totalSpcfQty = totalSpcfQty - 1;
			//set current show type value
			this.value = "1";//非展车
		}
		totalSpcfQtyObj.innerText = totalSpcfQty;
	});
}

function confirmEvent(){
	
	submitBtnObj.addEventListener('tap',function(event){
		
		if (!checkDealerType()) return;
		
		var frameNoAndShowTpArr = [];
		var showCarDetailObj = showCarContainObj.getElementsByTagName('ul');
		for (var i=0; i<showCarDetailObj.length; i++) {
			
			var currentShowType   =  document.getElementById("showType_"+i+"").value;
			var originShowType    =  document.getElementById("showTypeHidden_"+i+"").value;
			
			if (currentShowType != originShowType) {
				var frameNo = document.getElementById("productInfo_"+i+"").value;
				frameNoAndShowTpArr.push(frameNo+";"+currentShowType);
			}
		}
		if (frameNoAndShowTpArr.length == 0){
			mui.toast("请指定展车")
			return;
		};
		var para = {userId       	   : localData.userId
				   ,dealerId 		   : subDealerIdObj.value
				   ,specifyDealerId    : specifyDealerIdObj.value
				   ,frameNoShowTypeArr : frameNoAndShowTpArr};
		//后台获取数据
		var returnData= post_ajax(confirmUrl,para,function(returnData){
			
			if (returnData.successFlag == "0") {
				mui.toast('指定经销商与车架号所属经销商不可同为分销商/本店中的一种!')
			}
			
			if (returnData.successFlag == "1") {
				mui.toast('提交成功');
				//刷新界面
				var para;
				localData.dealerType == "1" ? para = {dealerId 		: subDealerIdObj.value}
											: para = {userId       :  localData.userId};
				searchSpecifyCarInfo(para);
			} else {
				mui.toast("提交失败！请重试");
			}
		});
		
	},false);
}

function searchSpecifyCarInfo(para){
	//清空内容
	showCarContainObj.innerHTML = "";
	//后台获取数据
	var returnData= post_ajax(detailRequestUrl,para,function(returnData){
		//底部合计数量
		totalQty 	 				= returnData.totalQty;
		totalQtyObj.innerHTML   	= totalQty;
		totalSpcfQty 				= returnData.showQty;
		totalSpcfQtyObj.innerHTML   = totalSpcfQty;
		
		var fragment = document.createDocumentFragment();
		//循环填充数据
		$.each(returnData.showCarInfoList, function (i, item) {
			div = document.createElement('div');
			div.id = "showCarInfo_" +i;
			div.className = 'mui-card detail-list-margin';
			div.innerHTML = showCarContainHTML(item,i);
			fragment.appendChild(div);
		});
		//底部空白行，防止底部信息被遮挡
		var lastDiv = document.createElement('div');
		lastDiv.style.marginTop = "60px";
		fragment.appendChild(lastDiv);
		
		showCarContainObj.appendChild(fragment);
		//设置选择框显示状态
		initialCheckBoxStatus();
		//点击checkBox改变展车数量
		changeQtyEvent();
	});
}

var showCarContainHTML = function(item,i){
	
	var showCarContainHTMLs = '<ul class="mui-table-view">'
		                        +'<li class="mui-table-view-divider" style="background-color:#FFF">'
									+'<div class="mui-table">'
										+'<div class="mui-table-cell mui-col-xs-10">'
											+'<div id="modelNm_'+i+'" style="color: #000;">'
												+ item.modelNm
											+'</div>'
											+'<div style="font-size: 12px;">'
												+ '颜色：' + item.colorNm
												+ '&nbsp;'
												+ '车架：' + item.frameNo
												+ '<input id="productInfo_'+i+'" value="'+item.frameNo+'" class="hidden"/>'
											+'</div>'
										+'</div>'
										+'<div id="showTypeInfo_'+i+'" class="mui-input-row mui-checkbox cur-check-box">'
											+'<label>&nbsp;</label>'
											+'<input id="showType_'+i+'" value="'+item.showType+'" name="showType" type="checkbox" style="top:12px;">'
											+'<input id="showTypeHidden_'+i+'" value="'+item.showType+'" class="hidden"/>'
										+'</div>'
									+'</div>'
								+'</li>'
							+'</ul>'
	return showCarContainHTMLs;
};

function helperEvent(){
	
	subDealerHelper("subDealerPicker");
	specifyDealerHelper("specifyDealerPicker");
}

var subDealerHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		showSubDlHelper(pickerId);
	}, false);
}
var specifyDealerHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		showSpcfDlHelper(pickerId);
	}, false);
}

var showSubDlHelper = function(pickerId){
	if(typeof(subDealerPicker) == "undefined" || subDealerPicker == null){
		subDealerPicker = new mui.PopPicker();
		subDealerPicker.setData(pickerData);
	}
	return showPicker(subDealerPicker, pickerId ,function(){
		
		var para = {dealerId 		: subDealerIdObj.value}
		searchSpecifyCarInfo(para);
	});
}

var showSpcfDlHelper = function(pickerId){
	if(typeof(specifyDealerPicker) == "undefined" || specifyDealerPicker == null){
		specifyDealerPicker = new mui.PopPicker();
//		pickerData.unshift({"id":"","name":"请选择指定经销商"})
		specifyDealerPicker.setData(pickerData);
	}
	return showPicker(specifyDealerPicker, pickerId);
}

function initialCheckBoxStatus(){
	
	var showCarDetailObj = showCarContainObj.getElementsByTagName('ul');
	for (var i=0; i<showCarDetailObj.length; i++) {
		
		var checkBoxObj 	  = document.getElementById("showType_"+i+"");
		var currentShowType   = checkBoxObj.value;
		
		if (currentShowType == "2") {
			checkBoxObj.checked = true;
		}
	}
}

function checkDealerType(){
	
	var subDealerType     =  filterDataById(subDealerIdObj.value,pickerData);
	var specifyDealerType =  filterDataById(specifyDealerIdObj.value,pickerData);
	
	if (subDealerIdObj.value != specifyDealerIdObj.value && (subDealerType  == 2 || subDealerType== 3) && (specifyDealerType==2 || specifyDealerType == 3)) {
		
		mui.toast('指定经销商与车架号所属经销商不可同为分销商/本店中的一种!');
		return false;
	}
	return true;
}

var filterDataById = function(targetIdValue, sourceDataArr){
	
	var returnData = "";
	for(var i=0;i<sourceDataArr.length;i++){
		if (targetIdValue==sourceDataArr[i].id){
			returnData = sourceDataArr[i].type;
		}
	}
	return returnData;
}