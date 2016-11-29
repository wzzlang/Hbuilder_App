var accountCdObj      	 	  = document.getElementById('accountCd');
var verificationCdObj 	 	  = document.getElementById('verificationCd');
var getVerificationObj 	 	  = document.getElementById('getVerification');	
var submitBtnObj      	 	  = document.getElementById('submitBtn');	
var localData = eval('('+localStorage.getItem("localData")+')');
var requestGetVerificationURL =	"common/login/AppGetVerificationService";
var requestSubmitURL 		  = "common/login/AppForgetPwdService";	

(function($, doc) {
	$.init();
	$.plusReady(function() {
		getVerificationEvent();
		submitEvent();
	});
}(mui, document));

function getVerificationEvent() {
	
	getVerificationObj.addEventListener('tap', function() {
		onGetVerification();
	}, false);
}

function submitEvent() {
	
	submitBtnObj.addEventListener('tap', function() {
		onSubmit();
	}, false);
}

function onGetVerification() {
	
	// Must Input Check
	if(!mustInputCheck(accountCdObj.value, "用户名")) return;
	
	// Run Get Verification Service
	var para = prepareGetVerificationParameter();
	post_ajax(requestGetVerificationURL
			 ,para
			 , function(returnData){
		
				// Validation
				if(!getVerificationValidate(returnData.validationFlag)) return;
				
				//verification time countdown
				countdown(getVerificationObj);
				
				if(returnData.verificationCheckCd.trim() != "") {
					// Set Data to local storage
					setLocalStorageDataForGetVerification(returnData);
					showMsg("验证码发送成功");
				} else {
					showErrorMsg("非法手机号码，验证码获取失败");
				}
			 }
			 ,function(){//Err Call Back
		    	showErrorMsg("验证码获取失败");
		    });
}

var prepareGetVerificationParameter = function() {
	
	return para = {accountCd : accountCdObj.value}
}

var getVerificationValidate = function(validationFlag) {
	
	var msgContent = "";
	
	// Login Success
	if (validationFlag == "0") return true;
	
	// Account Not Exists
	if (validationFlag == "1") {
		msgContent = "用户不存在，请重新输入";
	}
	
	// Account In-Active
	if (validationFlag == "2") {
		msgContent = "用户账号已失效";
	}
	
	// Account Locked
	if (validationFlag == "3") {
		msgContent = "用户账号已被锁定";
	}
	
	// Mobile No. Not Exists
	if (validationFlag == "4") {
		msgContent = "用户手机号码不存在，请重新输入";
	}
	
	if(msgContent != "") {
		showErrorMsg(msgContent);
		return false;
	}
}

function setLocalStorageDataForGetVerification(returnData) {
	
	var verificationCheckCdArr = localStorage.getItem("verificationCheckCdArr");
	if (verificationCheckCdArr == null) {
		verificationCheckCdArr = [];
	} else {
		verificationCheckCdArr = JSON.parse(verificationCheckCdArr);
	}
	verificationCheckCdArr.push(returnData.verificationCheckCd);
	localStorage.setItem('verificationCheckCdArr',JSON.stringify(verificationCheckCdArr))
}

function onSubmit() {
	
	// Must Input Check
	if(!mustInputCheck(accountCdObj.value, "用户名") 
	|| !mustInputCheck(verificationCdObj.value, "验证码")) return;
	
	// Verification Code Match Check
	if (!varificationCdMatchCheck()) return;
	
	// Run Submit Service
	var para = prepareSubmitParameter();
	post_ajax(requestSubmitURL
			 ,para
			 ,function(returnData){//Call Back
				// Set Data to local storage
				if (returnData.successFlag == "1") {
					setLocalStorageDataForSubmit();
					showMsg("重置密码已发到您的手机");
				} else {
					showMsg("重置密码获取失败");
					return;
				}
				
				// Open new window
				runLogoutFunc();
			}
		   ,function(){//Err Call Back
		    	showErrorMsg("重置密码获取失败");
		   });
}

function varificationCdMatchCheck() {
	var forgetVerificationCheckCd = JSON.parse(localStorage.getItem('verificationCheckCdArr'));
	if($.inArray(verificationCdObj.value,forgetVerificationCheckCd)!= -1){
		return true;
	}
	else{
		showErrorMsg("验证码不正确，请重新输入");
		return false;
	}
}

var prepareSubmitParameter = function() {
	
	return para = {accountCd : accountCdObj.value
				  ,userId    : localData.userId}
}

function setLocalStorageDataForSubmit() {
	
	localStorage.removeItem("verificationCheckCdArr");
}
