var requestURL = "common/settings/AppAboutService";
var versionCdObj = document.getElementById("versionCd");
var para = {}

mui.init({
	swipeBack:true //启用右滑关闭功能
});

mui.plusReady(function(){
	
	//获取版本号
	getVersionInfo();
	
	//后台获取数据
	post_ajax(requestURL,para, function(returnData){
		
		var connectInfo = document.getElementById("connectInfo");
		var fragment = document.createDocumentFragment();
		var tr;
		
		//循环数据填入表格
		$.each(returnData.details, function (i, item) {
			tr = document.createElement('tr');
			tr.innerHTML = '<td>'+item.orgAbbNm+'</td>'
			             + '<td>'+item.accountNm+'</td>'
			             + '<td id = "'+i+'" onclick="dialTest(this.id)">'
			             	+'<font class="mui-mobile-no"><u>'
			             		+item.mobileNo
			             	+'</u></font>'
			             +'</td>';
			fragment.appendChild(tr);
		});
		connectInfo.appendChild(fragment);
	});
});

//点击号码直接拨打电话
function dialTest(Id) {
	var mobileNo = document.getElementById(Id).innerText;

    plus.nativeUI.confirm("您确定要拨打电话吗？",

        function(event){

            if(event.index ==1){

                plus.device.dial( mobileNo, false );
            }else{

                return false;
            }
        }
        ,'友情提示',['取消','确定']
    )
}

var getVersionInfo = function(){
	
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        versionCdObj.innerText = "版本号："+inf.version+"";
    });
}
