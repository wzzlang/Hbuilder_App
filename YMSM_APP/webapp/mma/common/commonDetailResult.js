window.onload=function(){
	var fuctionId = localStorage.getItem('fuctionId');
	var getresultModel = localStorage.getItem("resultModel");
	var resultModel = eval('('+getresultModel+')');
	switch (fuctionId){
		case "mmaz01":
			url = "mma/mmaz01/MMAZ01DailyPsiService";
			var resultDetailModel = post_ajax(url,resultModel);
			break;
		case "mmaz02":
			url = "mma/mmaz02/MMAZ02SalesOrderService";
			resultDetailModel = post_ajax(url,resultModel);
			break;
		case "mmaz03":
			url = "mma/mmaz03/MMAZ03DlTradeService";
			resultDetailModel = post_ajax(url,resultModel);
			break;
		case "mmaz04":
			url = "mma/mmaz04/MMAZ04WHInOutService";
			resultDetailModel = post_ajax(url,resultModel);
			break;
		case "mmaz05":
			url = "mma/mmaz05/MMAZ05AnalysListService";
			resultDetailModel = post_ajax(url,resultModel);
			break;
		case "mmaz06":
			break;
		case "mmaz07":
			url = "mma/mmaz07/MMAZ07StockInfoService";
			resultDetailModel = post_ajax(url,resultModel);
			break;
		default:
			break;
	}
}
	var insum   = 0;
	var outsum  = 0;
	var leftsum = 0;
	var data;    
var inoroutRetriver = function(){
	var text  = "株洲仓库";
		data = getData();
		for(var i=0;i<data.length;i++){
			insum  +=data[i].innumber;
			outsum +=data[i].out;
				}
		leftsum= insum-outsum;
	var time = "2016-4-19";
	var innerHtml ='<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">进出库</h1></header>';
		innerHtml+='<div class="mui-content">  <div class="mui-content-padded"><b>仓库:</b> ' + text;
		innerHtml+='<div class="mui-content-padded">'+time;
		innerHtml+='<div class="mui-content-padded"><table ><tr style="font-weight:bold;"><td></td><td></td><td>入库</td><td>出库</td><td>库存</td>'
		innerHtml+='<div class="mui-content-padded"><table ><tr style="font-weight:bold;"><td></td><td></td><td>'+insum+'</td><td>'+outsum+'</td><td>'+leftsum+'</td>'
		for(var i=0;i<data.length;i++){
			var left = data[i].innumber-data[i].out;
			innerHtml+='<tr><td>'+data[i].name+'<td>'+data[i].color+'<td>'+data[i].innumber+'<td>'+data[i].out+'<td>'+left;
		}
	document.getElementById("qbody").innerHTML=innerHtml;
}
var getData = function(){
	var array = [
		{"name":"tiantian","color":"red","innumber":5000,"out":1000},
		{"name":"lalalaaa","color":"bulue","innumber":5000,"out":900},
		{"name":"oooo","color":"white","innumber":5000,"out":800},
		{"name":"lllllll","color":"yellow","innumber":5000,"out":700},
		{"name":"nnnnnnn","color":"gray","innumber":5000,"out":600}
	];
	return array;
};

var  stockRetriver = function(){
	var data = getData();
	var innerHtml ='<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">库存</h1></header>';
		innerHtml+='<div class="mui-content">  <div class="mui-content-padded"><b>区域:</b> ';
		innerHtml+='<div class="mui-content-padded"><table><tr style="font-weight:bold;"><td>'+"劲豹"+'<td></td>'+'<td>'+"总库存:"+'<td>36000'
		for (var i=0;i<data.length;i++){
			innerHtml+='<tr><td>'+data[i].name+'<td>'+'<td>'+data[i].color+'<td>'+data[i].innumber;
		}
		document.getElementById("qbody").innerHTML=innerHtml;
}

var ordingRetrive = function(){
	var data = getData();
	var innerHtml ='<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">订单详情</h1></header>';
		innerHtml+='<div class="mui-content">  <div class="mui-content-padded"><b>期间:</b> ';
		innerHtml+='<div class="mui-content-padded"><table >';
		for(var i=0;i<data.length;i++){
			innerHtml+='<tr><td>'+"全国"+'<td>'+data[i].name+'<td>'+data[i].color+'<td>'+data[i].innumber;
		}
	document.getElementById("qbody").innerHTML=innerHtml;
}

var PSIRetrive_02 = function (){
	var data = getData();
	var innerHtml = '<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">进销存日报</h1></header>';
	    innerHtml+='<div class="mui-content">  <div class="mui-content-padded"><b>区域:'+"areaCd"+'-'+"area"+'</b>';
		innerHtml+='<div class="mui-content-padded"><b>'+"2016-4-18"+'</b> ';
		innerHtml+='<div class="mui-content-padded mui-card-shadow" ><ul class="mui-table-view " ><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">U销数量<span class="mui-badge mui-badge-yellow" id="total" ></span></a><div class="mui-collapse-content"><form class="mui-input-group">'
		for(var i=0;i<data.length;i++){
			innerHtml+='<div class="mui-input-row"><li class="mui-table-view-cell"> '+data[i].name+'<span class="mui-badge mui-badge-yellow">'+data[i].out+'</span></li></div>';
		}
		innerHtml +='</form></div></li></ul></div>';
		innerHtml+='<div class="mui-content-padded mui-card-shadow" ><ul class="mui-table-view " ><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">批发数量<span class="mui-badge mui-badge-yellow" id="total" ></span></a><div class="mui-collapse-content"><form class="mui-input-group">'
		for(var i=0;i<data.length;i++){
			innerHtml+='<div class="mui-input-row"><li class="mui-table-view-cell"> '+data[i].name+'<span class="mui-badge mui-badge-yellow">'+data[i].out+'</span></li></div>';
		}
		innerHtml +='</form></div></li></ul></div>';
		innerHtml+='<div class="mui-content-padded mui-card-shadow" ><ul class="mui-table-view " ><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">库存数量<span class="mui-badge mui-badge-yellow" id="total" ></span></a><div class="mui-collapse-content"><form class="mui-input-group">'
		for(var i=0;i<data.length;i++){
			innerHtml+='<div class="mui-input-row"><li class="mui-table-view-cell"> '+data[i].name+'<span class="mui-badge mui-badge-yellow">'+data[i].out+'</span></li></div>';
		}
		innerHtml +='</form></div></li></ul></div>';
	document.getElementById("qbody").innerHTML=innerHtml;
	
}

var PSIRetrive_01 = function(){
	var data = getData();
	var innerHtml ='<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">进销存日报</h1></header>';
		innerHtml+='<div class="mui-content">  <div class="mui-content-padded"><b>仓库: ' + "text";
		innerHtml+='<div class="mui-content-padded">'+"2016-4-18</b>";
		innerHtml+='<div class="mui-content-padded"><table ><tr style="font-weight:bold;"><td ></td><td>U销</td><td>批发</td><td>库存</td>'
		innerHtml+='<tr><td></td><td></td><td></td><td></td></tr>'
		for(var i=0;i<data.length;i++){
			innerHtml+='<tr><td style="border-bottom:0px;">'+data[i].name+'</tr><tr><td><td>'+data[i].color+'<td>'+data[i].innumber+'<td>'+data[i].out;
		}
	document.getElementById("qbody").innerHTML=innerHtml;
}

var netData = function(){
	netArray = [
	{"pro":"福建","cata":"天剑","type":"1","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"天剑","type":"2","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"天剑","type":"3","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"金符","type":"1","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"金符","type":"2","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"金符","type":"3","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"琉璃","type":"1","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"琉璃","type":"2","net":23,"change":22,"zero":33},
	{"pro":"福建","cata":"琉璃","type":"3","net":23,"change":22,"zero":33},
	{"pro":"江西","cata":"天剑","type":"1","net":23,"change":22,"zero":33},
	{"pro":"江西","cata":"天剑","type":"2","net":23,"change":22,"zero":33},
	{"pro":"江西","cata":"天剑","type":"3","net":23,"change":22,"zero":33},
	{"pro":"江西","cata":"飞致","type":"1","net":23,"change":22,"zero":33},
	{"pro":"江西","cata":"飞致","type":"2","net":23,"change":22,"zero":33},
	{"pro":"江西","cata":"飞致","type":"3","net":23,"change":22,"zero":33}
	];
	return netArray;
}

var outletRetrive_01 = function(){
	var data = netData();
	var province = null;
	var innerHtml ='<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">网点查询</h1></header>';
		innerHtml+='<div class="mui-content"><div class="mui-content-padded">'+"2016-4-18</b>";
		innerHtml += '<table border="1px"><tr><td></td><td></td><td>网点店数</td><td>交易店数</td><td>零售店数</td></tr>'
	for(var i=0; i<data.length;i++){
		if (data[i].pro!=province){innerHtml +='<tr><td rowspan="3">'+data[i].pro;}
		 province = data[i].pro;
		switch (data[i].type){
			case "1":
				innerHtml+='<td>代理商</td><td>'+data[i].net+'<td>'+data[i].change+'<td>'+data[i].zero+'</td></tr>'
				break;
			case "2":
				innerHtml+='<td>直接管理</td><td>'+data[i].net+'<td>'+data[i].change+'<td>'+data[i].zero+'</td></tr>'
				break;
			case "3":
				innerHtml+='<td>间接管理</td><td>'+data[i].net+'<td>'+data[i].change+'<td>'+data[i].zero+'</td></tr>'
				break;
			default:
				break;
			}
	}
	document.getElementById("qbody").innerHTML=innerHtml;
}
var outletRetrive_02 = function(){
	var data = netData();
	var province = null;
	var cata = null;
	var innerHtml ='<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title">网点查询</h1></header>';
		innerHtml+='<div class="mui-content"><div class="mui-content-padded">'+"2016-4-18</b>";
		innerHtml += '<table border="1px"><tr><td></td><td></td><td></td><td>网点店数</td><td>交易店数</td><td>零售店数</td></tr>'
	for(var i=0; i<data.length;i++){
		if (data[i].pro!=province){innerHtml +='<tr><td rowspan="10">'+data[i].pro;}
		 province = data[i].pro;
		 if(data[i].cata!=cata){innerHtml +='<tr><td rowspan="3">'+data[i].cata;}
		 cata = data[i].cata;
		switch (data[i].type){
			case "1":
				innerHtml+='<td>代理商</td><td>'+data[i].net+'<td>'+data[i].change+'<td>'+data[i].zero+'</td></tr>'
				break;
			case "2":
				innerHtml+='<td>直接管理</td><td>'+data[i].net+'<td>'+data[i].change+'<td>'+data[i].zero+'</td></tr>'
				break;
			case "3":
				innerHtml+='<td>间接管理</td><td>'+data[i].net+'<td>'+data[i].change+'<td>'+data[i].zero+'</td></tr>'
				break;
			default:
				break;
			}
	}
	document.getElementById("qbody").innerHTML=innerHtml;
}
