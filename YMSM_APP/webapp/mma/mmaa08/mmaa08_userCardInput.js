var showHelpObj         = document.getElementById("showHelp");
var helpInfoObj         = document.getElementById("helpInfo");
var helpInfoPointObj    = document.getElementById("helpInfoPoint");
var hiddenHelpInfoObj   = document.getElementById("hiddenHelpInfo");
var takePhotoBtnObj     = document.getElementById("takePhotoBtn");
var userNameObj         = document.getElementById("userName");
var mobileNoObj         = document.getElementById("mobileNo");
var frameNoObj   	    = document.getElementById("frameNo");
var engineNoObj   	    = document.getElementById("engineNo");
var modelNmObj   	    = document.getElementById("modelNm");
var tradeStatePickerObj = document.getElementById("tradeStatePicker");
var genderPickerObj     = document.getElementById("genderPicker");
var ageTypePickerObj    = document.getElementById("ageTypePicker");
var verifyCdObj         = document.getElementById("verifyCd");
var getverifyBtnObj     = document.getElementById("getverifyBtn");
var provincePickerObj   = document.getElementById("provincePicker");
var provinceIdObj 	    = document.getElementById("provinceId");
var cityPickerObj 	    = document.getElementById("cityPicker");
var cityIdObj 		    = document.getElementById("cityId");
var addressObj          = document.getElementById("address");
var saveBtnObj          = document.getElementById("saveBtn");
var upByCameraObj       = document.getElementById("upByCamera");
var upByGalleryObj      = document.getElementById("upByGallery");
var openSurveyPageObj   = document.getElementById("openSurveyPage");
var surveyCommentObj    = document.getElementById("surveyComment");
var upImgUrl            = rootPath + "mma/mmaa08/MMAA08UploadImg"; 
var getFrameInfoUrl     = "mma/mmaa08/MMAA08GetFrameInfo"
var getVerificationUrl  = "mma/mmaa08/MMAA08GetVerification";
var userCardRegistUrl   = "mma/mmaa08/MMAA08UserCardRegist";
var userCardSurveyHtml  = "mmaa08_userCardSurvey.html";
var localDataObj;
var verificationCd;
var imgFileSize = 0;
var frameNoForSurvey = null;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		initCondition();
		helperEvent();
		takePhotoEvent();
		retrieveFrameInfo();
		getVerifyCd();
		openSurveyPage();
		saveUserCard();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function initCondition(){
	
	// show help
	showPhotoHelp();
	// hidden help
	hiddenPhotoHelp();
	// Get Parameter
	localDataObj   = eval('('+localStorage.getItem("localData")+')'); 
	//Clear userSurveyData
	localStorage.removeItem("userSurveyData");
}

function helperEvent(){
	
	tradeStateHelper();
	genderHelper();
	ageHelper();
	allProvinceHelper("provincePicker");
	allCityHelper("cityPicker", provinceIdObj);
}

function takePhotoEvent(){
	
	upByCameraObj.addEventListener('tap', function(event){
		appendByCamera();
	},false);
	upByGalleryObj.addEventListener('tap',function(event){
		appendByGallery();
	},false);
}

function retrieveFrameInfo(){
	
	frameNoObj.addEventListener("blur", function(){
		
		if (frameNoObj.value.trim() == '') return;
		//转成大写
		frameNoObj.value = frameNoObj.value.toUpperCase();
		
		//获取车辆信息
		var framePara = {frameNo : frameNoObj.value};
		post_ajax(getFrameInfoUrl,framePara,function(returnData) {
			//根据车架号得到的值，显示在画面
			setFrameInfoToScreen(returnData);
		});
	});
}

function getVerifyCd(){
	
	getverifyBtnObj.addEventListener('tap', function(event) {
		
		if (!mobileMustInputCheck()) return; //手机号必输check
		if (!mobileNoCheck())        return; //手机号格式check
		
		// Get parameter
		var verifyPara = {userId   : localDataObj.userId
				       	 ,mobileNo : mobileNoObj.value};
				       	 
	    post_ajax(getVerificationUrl,verifyPara,function(returnData){
	    	
	    	if(returnData.errorFlg == "1") {
	    		mui.alert("您输入的手机号码无效！")
	    		return;
	    	}
	    	
	    	if (returnData.verificationCd.trim() != ""){
	    		showErrorMsg('验证码发送成功！');
	    	};
	    	
	    	verificationCd = returnData.verificationCd;
	    	//time countdown 60s
			countdown(getverifyBtnObj);
	    });
	}, false);
}

function openSurveyPage(){
	
	openSurveyPageObj.addEventListener('tap', function(event) {
		
		para = { frameNo : frameNoForSurvey};
		
		openWindow(userCardSurveyHtml,para);
	}, false);
}

function saveUserCard(){
	
	saveBtnObj.addEventListener('tap', function(event) {
		
	    // get User Survey data
	    var userSurveyData = getUserSurveyData();
		
		// Get parameter
		var para = {userId		    : localDataObj.userId
				   ,userNm   	    : userNameObj.value
				   ,mobileNo		: mobileNoObj.value
				   ,frameNo    	    : frameNoObj.value
				   ,tradeState    	: tradeStatePickerObj.value
				   ,gender			: genderPickerObj.value
				   ,ageType			: ageTypePickerObj.value
				   ,provinceId		: provinceIdObj.value
				   ,cityId			: cityIdObj.value
				   ,address			: addressObj.value
				   ,pictureSaveFlg  : userSurveyData.pictureSaveFlg
				   ,occupation      : userSurveyData.occupation
		           ,purType         : userSurveyData.purType
		           ,preCarBrand     : userSurveyData.preCarBrand
		           ,preCarProductCd : userSurveyData.preCarProductCd
		           ,knowChannal     : userSurveyData.knowChannal};
		
		// Must Input Check
		if (!nameMustInputCheck())   return; //姓名必输check
		if (!mobileMustInputCheck()) return; //手机号必输check
		if (!mobileNoCheck())        return; //手机号格式check
		if (!frameMustInputCheck())  return; //车架号必输check
		if (!genderMustInputCheck()) return; //性别必输check
		if (!ageMustInputCheck())    return; //年龄必输check
		if (!verifyMustInputCheck()) return; //验证码必输check
		if (!verificationCdCheck())  return; //验证码准确性check
		
		post_ajax(userCardRegistUrl,para,function(returnData) {
		
			switch (returnData.errorFlg){
				case "2" :
					mui.alert("存在重复车架号")
					return;
				case "3" :
					mui.alert("车架号不存在")
					return;
				case "0" :
					setTimeout(mui.toast("保存成功！"),4000);
					//回到顶部
					window.scroll(0, 0);
					//重新加载界面
					plus.webview.currentWebview().reload();
					break;
			}
		});
	}, false);
}

var showPhotoHelp = function(){
	
	showHelpObj.addEventListener('tap', function(event) {
		helpInfoPointObj.style.display = "block";
		helpInfoObj.style.display = "block";
	}, false);
}
var hiddenPhotoHelp = function(){
	
	hiddenHelpInfoObj.addEventListener('tap', function(event) {
		$('#helpInfo').slideToggle('fast');
		//定位到指定位置
		window.scroll(0,40);
		helpInfoPointObj.style.display = "none";
	}, false);
}

var setFrameInfoToScreen = function(returnData){
	
	switch (returnData.errorFlg){
		case "2" :
			mui.alert("存在重复车架号")
			return;
		case "3" :
			mui.alert("车架号不存在" + returnData.frameNo)
			return;
		case "4" :
			mui.alert("上传图片识别失败,请重新拍照上传!请参考帮助中的说明内容!")
			return;
		case "5" :
			mui.alert("车架号识别有误,请重新拍照上传或手动修正!")
			return;
	}
	
	if (returnData.frameNo.trim() != '') {frameNoObj.value = returnData.frameNo};
	engineNoObj.value           = returnData.engineNo;
	modelNmObj.value            = returnData.modelNm + "  " + returnData.colorNm;
	provincePickerObj.innerHTML = returnData.provinceNm;
	cityPickerObj.innerHTML     = returnData.cityNm;
	provinceIdObj.value         = returnData.provinceId;
	cityIdObj.value             = returnData.cityId;
	frameNoForSurvey            = returnData.frameNo;
	
	//控制是否可以输入调查项目
	returnData.specifyFlg == "1" ? openSurveyPageObj.style.display = "block"
	                             : openSurveyPageObj.style.display = "none"
	//显示备注
	surveyCommentObj.innerHTML = returnData.surveyComment;
}

var nameMustInputCheck = function() {
	return mustInputCheck(userNameObj.value, "姓名");
}

var mobileMustInputCheck = function() {
	return mustInputCheck(mobileNoObj.value, "手机号码");
}

var mobileNoCheck = function(){
	var pattern = /^1\d{10}$/;  
	if (pattern.test(mobileNoObj.value)) return true;  
	showErrorMsg('非法手机号码，请重新输入！');
	return false;
}

var frameMustInputCheck = function() {
	return mustInputCheck(frameNoObj.value, "车架号");
}

var genderMustInputCheck = function() {
	return mustInputCheck(genderPickerObj.value, "性别");
}

var ageMustInputCheck = function() {
	return mustInputCheck(ageTypePickerObj.value, "年龄段");
}

var verifyMustInputCheck = function() {
	return mustInputCheck(verifyCdObj.value, "验证码");
}

var verificationCdCheck = function(){
	
	if (verifyCdObj.value == verificationCd) return true;
	showErrorMsg('验证码错误，请重新输入！');
	return false;
}

var tradeStateHelper = function(){
	//默认初始值
	tradeStatePickerObj.value = '2';
	var tradeStateData = [{value: '1', name: '未点检'}
						 ,{value: '2', name: '已点检'}];
	commonHelper("tradeStatePicker",tradeStateData);
}
var genderHelper = function(){
	var genderData = [{value: '0', name: '男'}
					 ,{value: '1', name: '女'}];
	commonHelper("genderPicker",genderData);
}
var ageHelper = function(){
	var ageTypeData = [{value: '0', name: '20以下'}
				      ,{value: '1', name: '20~35'}
				      ,{value: '2', name: '36~50'}
				      ,{value: '3', name: '50以上'}];
	commonHelper("ageTypePicker",ageTypeData);
}

var commonHelper = function(targetId,pickerData){
	var targetPickerButton = document.getElementById(targetId);
	targetPickerButton.addEventListener('tap', function(event) {
		var commonsPicker   = new mui.PopPicker();
		commonsPicker.setData(pickerData);
		commonsPicker.show(function(items) {
			targetPickerButton.innerText = items[0].name;
			targetPickerButton.value     = items[0].value;
		});
	}, false);
}

// 拍照添加文件
function appendByCamera(){
	plus.camera.getCamera().captureImage(function(path){
		//上传图片
		upload(path);
		mui('#picture').popover('toggle');
	});	
}
// 从相册添加文件
function appendByGallery(){
	plus.gallery.pick(function(path){
		//上传图片
		upload(path);
        mui('#picture').popover('toggle');
    });
}

// 上传文件
function upload(path){
	
	if(typeof(path)=="undefined" ||  path.trim == ''){
		plus.nativeUI.alert("添加图片失败！");
		return;
	}
	//加载等待标志
	var wt=plus.nativeUI.showWaiting();
	//压缩图片
	
	var task=plus.uploader.createUpload(upImgUrl
									  ,{method:"POST"}
									  ,function(t,status){ //上传完成
		if(status==200){
			var returnDatas = JSON.parse(t.responseText);
			setFrameInfoToScreen(returnDatas);
			wt.close();
		}else{
			wt.close();
		}
	});
	//上传到服务器的数据
	task.addData("client","MMAA08");
	task.addData("uid",getUid());
	task.addFile(path,{key:"file_upload"});
	task.start();
}
// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
}

var allProvinceHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(provincePicker) == "undefined" || provincePicker == null){
			provincePicker = new mui.PopPicker();
			var pickerData   	   = [];
			for (var i=0; i<province.length; i++) {
				pickerData.push(province[i]);
			}
			provincePicker.setData(pickerData);
		}
		return showPicker(provincePicker, pickerId);
	}, false);
}

var allCityHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		var cityPicker = new mui.PopPicker();
		var pickerData = [];
		parentIdValue=="" ? pickerData = [{"id":"","name":"请选择市"}]
						  : pickerData = filterDataByParentId(parentIdValue, city)
		cityPicker.setData(pickerData);
		return showPicker(cityPicker, pickerId);
	}, false);
}

var getUserSurveyData = function(){
	
	var userSurveyDataObj = eval('('+localStorage.getItem("userSurveyData")+')'); 
    if (userSurveyDataObj != null) return userSurveyDataObj;
    
    var userSurveyData = {pictureSaveFlg  : ""
    	                 ,occupation      : ""
    	                 ,purType         : ""
    	                 ,preCarBrand     : ""
    	                 ,preCarProductCd : ""
    	                 ,knowChannal     : ""
    };
    
	return userSurveyData;
}
