var ws=null,wo=null;
var scan=null,domready=false;
// H5 plus事件处理
function plusReady(){
	if(ws||!window.plus||!domready){
		return;
	}
	// 获取窗口对象
	ws=plus.webview.currentWebview();
	wo=ws.opener();
	// 开始扫描
	ws.addEventListener('show',function(){
		var filter = [plus.barcode.CODE128,plus.barcode.CODE39];
		scan=new plus.barcode.Barcode('bcid',filter);
	    scan.onmarked=onmarked;
	    scan.start({conserve:true,filename:"_doc/barcode/",vibrate:false,sound:"none"});
	});
	// 显示页面并关闭等待框
    ws.show("pop-in");
    wo.evalJS("closeWaiting()");
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded",function(){
	domready=true;
	plusReady();
},false);
// 二维码扫描成功
function onmarked(type,result,file){
    switch(type){
    	case plus.barcode.QR:
    	type = "QR";
    	break;
    	case plus.barcode.EAN13:
    	type = "EAN13";
    	break;
    	case plus.barcode.EAN8:
    	type = "EAN8";
    	break;
    	case plus.barcode.CODE39:
    	type = "CODE39";
    	break;
    	case plus.barcode.CODE93:
    	type = "CODE93";
    	break;
		case plus.barcode.CODE128:
    	type = "CODE128";
    	break;
    	case plus.barcode.CODABAR:
    	type = "CODABAR";
    	break;
    	default:
    	type = "其它"+type;
    	break;
    }
    result = result.replace(/\n/g, '');
    if (result.length == 17) {
    	wo.evalJS("scaned('"+ type +"','"+ result +"','"+ file +"');");
    	back();
    } else {
    	scan.start({conserve:true,filename:"_doc/barcode/",vibrate:false,sound:"none"});
    }
}
// 从相册中选择二维码图片 
function scanPicture() {
    plus.gallery.pick(function(path){
	    plus.barcode.scan(path,onmarked,function(error){
			plus.nativeUI.alert( "无法识别此图片" );
		});
    },function(err){
        plus.nativeUI.alert("Failed: "+err.message);
    });
}