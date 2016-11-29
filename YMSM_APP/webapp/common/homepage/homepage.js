var newMsgSignObj = document.getElementById("newMsgSign");
//mui初始化
mui.init();
var subpages = ['index.html', '../message/message.html', '../setting/setting.html'];
var subpage_style = {
	top: '45px',
	bottom: '51px'
};

var aniShow = {};

 //创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	for (var i = 0; i < 3; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if (i > 0) {
			sub.hide();
		}else{
			temp[subpages[i]] = "true";
			mui.extend(aniShow,temp);
		}
		self.append(sub);
	}
});
 //当前激活选项
var activeTab = subpages[0];
var title = document.getElementById("title");
 //选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
	
	var all = plus.webview.all();
	var targetTab = this.getAttribute('href');
	//关闭index画面的子画面
	var indexPage = plus.webview.getWebviewById(subpages[0]);
	indexPage.evalJS("hiddenSubPage();");
	if (targetTab == activeTab) {
		return;
	}
	//更换标题
	title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	//显示目标选项卡
	//若为iOS平台或非首次显示，则直接显示
	if(mui.os.ios||aniShow[targetTab]){
		plus.webview.show(targetTab);
	}else{
		//否则，使用fade-in动画，且保存变量
		var temp = {};
		temp[targetTab] = "true";
		mui.extend(aniShow,temp);
		plus.webview.close(all,"fade-out",300);
		plus.webview.show(targetTab,"fade-in",300);
	}
	//隐藏当前;
	plus.webview.hide(activeTab);
	//更改当前活跃的选项卡
	activeTab = targetTab;
});
 //自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome', function() {
	var defaultTab = document.getElementById("defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
	if (defaultTab !== current) {
		current.classList.remove('mui-active');
		defaultTab.classList.add('mui-active');
	}
});
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

//messageSub画面调用，更新新消息未读标志
var showNewMsgSign = function(){
	newMsgSignObj.style.display = "inline-block";
}
var cleanNewMsgSign = function(){
	newMsgSignObj.style.display = "none";
}