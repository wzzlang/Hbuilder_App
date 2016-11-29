var accountCdObj      = document.getElementById("accountCd");
var settingObj        = document.getElementById("setting");
var logOutObj         = document.getElementById("logOut");
var changePasswordObj = document.getElementById("changePassword");
var aboutSystemObj    = document.getElementById("aboutSystem");
var retrieveHabitObj  = document.getElementById("retrieveHabit");
var changePasswordUrl = "changePassword.html";
var aboutSystemUrl    = "about.html";
var settingUrl        = "setting.html";
var retrieveHabitUrl  = "retrieveHabit.html";
var localData;

(function($, doc) {
	$.init();
	$.ready(function() {
		//Initial
		initializeData();
		// Change Password
		changePasswordObj.addEventListener("tap", function(){
			openWindow(changePasswordUrl);
		});
		// about
		aboutSystemObj.addEventListener("tap", function(){
			var para = {parentMenuId : this.id};
			openPreloadWindow(aboutSystemUrl, para, this.id);
		});
		// habit
		retrieveHabitObj.addEventListener("tap", function(){
			var para = {parentMenuId : this.id};
			openWindow(retrieveHabitUrl);
		});
		// Logout
		logOutObj.addEventListener("tap", function(){
			runLogoutFunc();
		});
	});
}(mui, document));

function initializeData() {
	
	localData = eval('('+localStorage.getItem("localData")+')');
	
	accountCdObj.innerText = localData.accountCd;
}
