var oldPasswordObj      		= document.getElementById('oldPassword');
var newPasswordObj      		= document.getElementById('newPassword');
var verifyPasswordObj   		= document.getElementById('verifyPassword');
var verificationCdObj   		= document.getElementById('verificationCd');
var getVerificationObj   		= document.getElementById('getVerification');
var commitBtnObj        		= document.getElementById('commitBtn');
var requestURLForCommit 		= "common/settings/AppChangePwdService";
var requestURLForGetVerification= "common/login/AppGetVerificationService";
var loginHtmlUrl 		 	  	= "../login/login.html";
var localData
var accountCd;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		getInitialData();
		//getVerificationEvent();
		commitEvent();
	});
}(mui, document));

function getInitialData() {
	
	localData = eval('('+localStorage.getItem("localData")+')');
	accountCd = localData.accountCd;
}

function getVerificationEvent(){
	
	getVerificationObj.addEventListener('tap', function() {
		
		//verification time countdown
		countdown(this);
		
		// Run Get Verification Service
		var para = {accountCd : accountCd}
		post_ajax(requestURLForGetVerification
			     ,para
			     ,function(returnData){
			// Set Data to local storage
				if(returnData.verificationCheckCd.trim() != "") {
					setLocalStorageDataForGetVerification(returnData);
					showMsg("验证码发送成功");
				}else{
					showErrorMsg("验证码获取失败");
				}
			} 
				,function(){//Err Call Back
		    	showErrorMsg("验证码获取失败");
			});
	}, false);
}

function setLocalStorageDataForGetVerification(returnData) {
	var verificationCheckCd = localStorage.getItem('changeVerificationCheckCd');
	if(verificationCheckCd == null){
		verificationCheckCd  = [];
	}else {
		verificationCheckCd = JSON.parse(verificationCheckCd)
	}
	verificationCheckCd.push(returnData.verificationCheckCd);
	localStorage.setItem("changeVerificationCheckCd",JSON.stringify(verificationCheckCd));
}

function commitEvent() {
	
	commitBtnObj.addEventListener('tap', function() {
		
		// Must Input Check
		if(!mustInputCheck(oldPasswordObj.value, 	"旧密码")
		 ||!mustInputCheck(newPasswordObj.value, 	"新密码")
		 ||!mustInputCheck(verifyPasswordObj.value, "确认密码")
		 //||!mustInputCheck(verificationCdObj.value, "验证码")
		 ) return;
		 
		// Verification Code Match Check
		//if (!varificationCdMatchCheck()) return;
		
		// Input Password Check
		if (!inputPwdCheck()) return;
		
		// Run Commit Service
		var para = {
			accountCd      : accountCd,
			oldPassword    : oldPasswordObj.value,
			newPassword    : newPasswordObj.value,
		}
		
		post_ajax(requestURLForCommit, para, function(returnData){
			
			// Return Data Validation
			if(!commitValidate(returnData.pwdCheckFlag, returnData.requiredLen)) return;
			
			// Set Data to local storage
			//setLocalStorageDataForSubmit();
			// Open new window
			if (returnData.successFlag == "1") {
				showMsg("密码更新成功");
				runLogoutFunc();
			}
			
		});
	}, false);
}

var varificationCdMatchCheck = function() {
	var changeVerificationCheckCdArray = JSON.parse(localStorage.getItem("changeVerificationCheckCdArray"))
	if ($.inArray(verificationCdObj.value,changeVerificationCheckCdArray) != -1 ) {
		return true;
	}else{
		showErrorMsg("验证码不正确，请重新输入");
		return false;
	}
}

var inputPwdCheck = function() {
	
	var msgContent = "";
	if(newPasswordObj.value == oldPasswordObj.value){
		msgContent = "新密码不能与旧密码相同";
	}
	if(newPasswordObj.value != verifyPasswordObj.value){
		msgContent = "确认密码与新密码不符";
	}
	
	if(msgContent != "") {
		showErrorMsg(msgContent);
		return false;
	}
	
	return true;
}

var commitValidate = function(validationFlag, requiredLen) {
	
	var msgContent = "";
	
	// Success
	if (validationFlag == "0") return true;
	
	if(validationFlag == "1"){
		msgContent = "旧密码错误";
	}
	if(validationFlag == "2"){
		msgContent = "新密码长度不足" + requiredLen + "位";
	}
	
	if(msgContent != "") {
		showErrorMsg(msgContent);
		return false;
	}
}

function setLocalStorageDataForSubmit() {
	
	localStorage.removeItem("changeVerificationCheckCd");
}