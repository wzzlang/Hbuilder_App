var accountCdObj 	   = document.getElementById("accountCd");
var rmbAccountCdBoxObj = document.getElementById("rmbAccountCdBox");
var pwdObj  	 	   = document.getElementById("pwd");
var requestUrl   	   = "common/login/AppLoginService";
var homePageHtmlUrl    = "../homepage/homePage.html";
var forgetPwdHtmlUrl   = "forgetPassword.html";
var checkUrl		   = 'common/version/UpdateVersionService/checkVersion'
var wgtVer			   = null;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		getVersion()
		rememberAccount();
		getRetrieveHobit();
		loginEvent();
		forgetPwdEvent();
		quitApp(); //dblclick mobile retrun Btn to quit
	});
})(mui, document); 

function rememberAccount(){
	
	accountCdObj.addEventListener("blur", function(){
		saveAccountCd();
	});
	
	mui('#checkBoxContain').on('change', 'input', function() {
		saveAccountCd();
	});
	
	getInitAccount(); 
}
	
function saveAccountCd(){
	
	var accountCdInfo = {isRmbAccountCd : rmbAccountCdBoxObj.checked
		                ,accountCd 	    : accountCdObj.value};
		
	localStorage.setItem("localData",JSON.stringify(accountCdInfo));
}

function getInitAccount(){
	
	var localData = eval('('+localStorage.getItem("localData")+')');
	if(localData != null && localData.isRmbAccountCd){
		
		rmbAccountCdBoxObj.checked = true;
		accountCdObj.value = localData.accountCd;
	}else{
		rmbAccountCdBoxObj.checked = false;
		accountCdObj.value = ''; 
	}
}

function loginEvent(){
	
	var loginBtnObj = document.getElementById("loginBtn");
	loginBtnObj.addEventListener('tap', function(event) {
		onLogin();
	}, false);
}

function forgetPwdEvent(){
	
	var forgetPwdObj = document.getElementById("forgetPwd");
	forgetPwdObj.addEventListener('tap', function(event) {
		onForgetPwd();
	}, false);
}

function onLogin() {

	// Must Input Check
	if(!mustInputCheck(accountCdObj.value, "用户名") 
	|| !mustInputCheck(pwdObj.value, "密码")) return;
	
	// Run Login Service
	var para = prepareParameter();
	post_ajax(requestUrl, para, function(returnData){
		
		// Validation
		if(!loginValidate(returnData.validationFlag)) return;
		
		// Set Data to local storage
		setLocalStorageData(returnData);
		
		// Open new window
		if (returnData.successFlag == "1") {
			openWindow(homePageHtmlUrl)
		};
	});
}

var prepareParameter = function() {
	
	return para = {accountCd	:accountCdObj.value.trim()
			   	  ,pwd			:pwdObj.value};
}

var loginValidate = function(validationFlag) {
	
	var msgContent = "";
	
	// Login Success
	if (validationFlag == "0") return true;
	
	// Account Not Exists
	if (validationFlag == "1") {
		msgContent = "用户不存在，请重新输入";
	}
	
	// Password incorrect
	if (validationFlag == "2") {
		msgContent = "密码输入错误，请重新输入";
	}
	
	// Account In-Active
	if (validationFlag == "3") {
		msgContent = "用户账号已失效";
	}
	
	// Password In-Active
	if (validationFlag == "4") {
		msgContent = "用户密码已失效";
	}
	
	// Account Locked
	if (validationFlag == "5" || validationFlag == "6") {
		msgContent = "用户账号已被锁定";
	}
	
	// Access Permission
	if (validationFlag == "7") {
		msgContent = "您没有系统权限";
	}
	
	if(msgContent != "") {
		showErrorMsg(msgContent);
		return false;
	}
}

function setLocalStorageData(returnData) {
	
	var localData = {userId 	      	: returnData.userId
					,accountCd 	      	: returnData.accountCd
					,orgClass 	      	: returnData.orgClass
					,orgId		      	: returnData.orgId
					,orgType	      	: returnData.orgType
					,dealerId 	      	: returnData.dealerId
					,dealerType       	: returnData.dealerType
					,subDlAgentType     : returnData.subDlAgentType
					,admOrgId         	: returnData.admOrgId
					,admDealerId      	: returnData.admDealerId
					,admSubDealerId     : returnData.admSubDealerId
					,whList			  	: returnData.whList
					,orgList		  	: returnData.orgList
					,mainDealerList   	: returnData.mainDealerList
					,subDealerList    	: returnData.subDealerList
					,subSubDealerList 	: returnData.subSubDealerList
					,provinceList	  	: returnData.provinceList
					,dealerWhPICType	: returnData.dealerWhPICType
	                ,isRmbAccountCd   	: rmbAccountCdBoxObj.checked};
					
	localStorage.setItem("localData",JSON.stringify(localData));
}

function onForgetPwd() {
	
	// Open new window
	openWindow(forgetPwdHtmlUrl);
}

function quitApp(){
	
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		if (!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if (new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	};
}
   // 获取本地应用资源版本号
function getVersion(){
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        console.log("当前应用版本："+wgtVer);
        checkVersion(wgtVer);
    });
}
//检查版本是否有更新
function checkVersion(wgtVer){
	var para = {version : wgtVer} ;
	console.log(para)
	post_ajax(checkUrl,para,function(response){
		var newVer = JSON.stringify(response);
			console.log(newVer)
			if(newVer==1){
				updateDown(wgtVer);
			}else{
				return
			} 
	},function(){}, false)
}

// 获取用户的查询偏好设置
function getRetrieveHobit(){
	
	var habitSetData = eval('('+localStorage.getItem("habitSetData")+')');
	
	if(habitSetData == null || habitSetData.modelNmDisp == null || habitSetData.modelCdDisp == null){
		var habitSetDataInfo = {modelCdDisp : "0"
		                  	   ,modelNmDisp : "1"};
		                  
		localStorage.setItem("habitSetData",JSON.stringify(habitSetDataInfo));
	}
}

//下载更新资源
var updateDown = function(version){
	var downpath='common/version/UpdateVersionService/updateVersion?version='+version;
	var downUrl = rootPath+downpath
	plus.nativeUI.showWaiting("正在下载更新资源...")
    plus.downloader.createDownload( downUrl, {filename:"_doc/update/",method:"GET"}, function(d,status){
        if ( status == 200 ) { 
//      	var btnArray = ['确定', '取消'];
//      	plus.nativeUI.confirm("有数据更新是否更新", function(btnArray){
//      		if(btnArray.index==0){
        		installWgt(d.filename); // 安装wgt包
//      		}else {
//      			return
//      		}
//      	},"提示",btnArray)
        } else if(status==500){
            plus.nativeUI.alert("资源下载失败");
            plus.nativeUI.closeWaiting();
        }
    }).start();
}

// 更新应用资源
function installWgt(path){
    plus.nativeUI.showWaiting("正在更新应用资源...");
    plus.runtime.install(path,{},function(){
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert("应用资源更新完成！自动重启APP",function(){
            plus.runtime.restart();
        });
    },function(e){
        plus.nativeUI.alert("资源更新失败");
        plus.nativeUI.closeWaiting();
    });
}