var areaNmObj 	        = document.getElementById("areaNm");
var periodObj 	        = document.getElementById("period");
var agePieChartLiObj 	= document.getElementById("agePieChartLi");
var ageBarChartLiObj 	= document.getElementById("ageBarChartLi");
var genderBarChartLiObj = document.getElementById("genderBarChartLi");
var colorPieChartLiObj  = document.getElementById("colorPieChartLi");
var agePieChartObj 	    = document.getElementById("agePieChart");
var ageBarChartObj 	    = document.getElementById("ageBarChart");
var genderBarChartObj   = document.getElementById("genderBarChart");
var colorPieChartObj    = document.getElementById("colorPieChart");
var headerRequestURL    = "maz05/initialService";
var agePieRequestURL    = "maz05/getAgePieList";
var ageBarRequestURL    = "maz05/getAgeBarList";
var genderBarRequestURL = "maz05/getGenderBarList";
var colorPieRequestURL  = "maz05/getColorPieList";
var genderBarXAxisText;
var ageBarXAxisText;
var localDataObj;
var requestPara;
var areaNm;
var period;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		//prepare initial data
		getInitialData();
		//set area & period to header
		setHeaderInfo();
		//loading age pie analys
		getAgePieChart();
		//loading age bar analys
		getAgeBarChart();
		//loading gender bar analys
		getGenderBarChart();
		//loading color pie analys
		getColorPieChart();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function getInitialData() {
	
	localDataObj = eval('('+localStorage.getItem("localData")+')');
	var userId 	  = localDataObj.userId;
	var curWebview = plus.webview.currentWebview();
	
	requestPara= {
		 userId          : userId
		,provinceId      : eval(JSON.stringify(curWebview.provinceId))
		,areaOwnShopRadio: eval(JSON.stringify(curWebview.areaOwnShopRadio))
		,dbYear          : eval(JSON.stringify(curWebview.dbYear))
		,dbMonthFrom     : eval(JSON.stringify(curWebview.dbMonthFrom))
		,dbMonthTo       : eval(JSON.stringify(curWebview.dbMonthTo))
	};
}

function setHeaderInfo(){
	
	post_ajax(headerRequestURL, requestPara, function(returnData){
		
		areaNm = returnData.areaNm;
		period = returnData.period;
		areaNmObj.innerText = areaNm;
		periodObj.innerText = period;
	});
}

function getAgePieChart(){
	
	$(agePieChartLiObj).one("tap",function(){
		
		//get age pie data from server
		var agePieData = [];
		getAgePieData(agePieData);
	})
}
function getAgeBarChart(){
	
	$(ageBarChartLiObj).one("tap",function(){
		
		//get gender bar data from server
		var ageBarData = [];
		getAgeBarData(ageBarData);
	})
}
function getGenderBarChart(){
	
	$(genderBarChartLiObj).one("tap",function(){
		
		//get gender bar data from server
		var genderBarData = [];
		getGenderBarData(genderBarData);
	})
}
function getColorPieChart(){
	
	$(colorPieChartLiObj).one("tap",function(){
		
		//get color pie data from server
		var colorPieData = [];
		getColorPieData(colorPieData);
	})
}

function getAgePieData(agePieData){
	
	post_ajax(agePieRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
			var pieColor = getColorByType(item.analyzeNm);
	    	agePieData.push({
	        	name : item.analyzeNm,
	            y    : item.userCardQty,
	            color:pieColor
	        });
	    });
	    
		//Construct chart title
		var chartTitle = period + " " + areaNm + "<br/>" + "购车用户年龄分布";
		//loading pie chart
		loadingPieChart(agePieChartObj,chartTitle,agePieData, true);
	});
}

function getColorPieData(colorPieData){
	
	post_ajax(colorPieRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
	    	var pieColor =  getColorByColorNm(item.analyzeNm);
	    	colorPieData.push({
	        	name: item.analyzeNm,
	            y   : item.userCardQty,
	            color:pieColor
	        });
	    });
	    
		//Construct chart title
		var chartTitle = period + " " + areaNm + "<br/>" + "颜色喜好分析";
		//loading color chart
		loadingPieChart(colorPieChartObj,chartTitle,colorPieData, false);
	});
}

function getGenderBarData(genderBarData){
	
	var male,female;
	var modelNmMale   = [];
	var modelNmFemale = [];
	
	post_ajax(genderBarRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
			
			switch(item.analyzeType)
			{
			case "0":
			  male=item.analyzeNm;
			  modelNmMale.push(item.modelNm);
			  genderBarData.push({
			  		color:'#0080FF',
			  		y: item.userCardQty});
			  break;
			case "1":
			  female=item.analyzeNm;
			  modelNmFemale.push(item.modelNm);
			  genderBarData.push({
			  		color:'#FF8000',
			  		y: item.userCardQty});
			  break;
			}
	    });
	    
		genderBarXAxisText = [{name: male   ,categories: modelNmMale}
		           			, {name: female ,categories: modelNmFemale}]
	    
		//Construct chart title
		var chartTitle = period + " " + areaNm + "<br/>" + "车型喜好分析";
		//loading gender chart
		loadingBarChart(genderBarChartObj,chartTitle,genderBarXAxisText,genderBarData);
	});
}

function getAgeBarData(ageBarData){
	
    var ageType0_19,ageType20_35,ageType36_50,ageType51_100;
	var modelNm0_19   = [];
	var modelNm20_35  = [];
	var modelNm36_50  = [];
	var modelNm51_100 = [];
	
	post_ajax(ageBarRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
			
			switch(item.analyzeType)
			{
			case "0":
			  ageType0_19=item.analyzeNm;
			  modelNm0_19.push(item.modelNm);
			  ageBarData.push({
			  		color:'#FF6666',
			  		y: item.userCardQty});
			  break;
			case "1":
			  ageType20_35=item.analyzeNm;
			  modelNm20_35.push(item.modelNm);
			  ageBarData.push({
			  		color:'#99CCFF',
			  		y: item.userCardQty});
			  break;
			case "2":
			  ageType36_50=item.analyzeNm;
			  modelNm36_50.push(item.modelNm);
			  ageBarData.push({
			  		color:'#99CC00',
			  		y: item.userCardQty});
			  break;
			case "3":
			  ageType51_100=item.analyzeNm;
			  modelNm51_100.push(item.modelNm);
			  ageBarData.push({
			  		color:'#003366',
			  		y: item.userCardQty});
			  break;
			}
	    });
	    
		ageBarXAxisText = [{name: ageType0_19   ,categories: modelNm0_19}
				         , {name: ageType20_35  ,categories: modelNm20_35}
				         , {name: ageType36_50  ,categories: modelNm36_50}
				 		 , {name: ageType51_100 ,categories: modelNm51_100}]
		    
		//Construct chart title
		var chartTitle = period + " " + areaNm + "<br/>" + "车型喜好分析";
		//loading gender chart
		loadingBarChart(ageBarChartObj,chartTitle,ageBarXAxisText,ageBarData);
	});
}

/**
 * 加载饼状图
 * @param chartId：chart container id
 * @param titleText ：chart title
 * @param seriesData ：pie chart data
 */
var loadingPieChart = function (chartId,titleText,seriesData, nameBrFlg) {
	$(chartId).highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        exporting: {
        	enabled: false
        },
        title: {
            text: titleText ,
			style: {
				color: "#000000",
				fontSize: "16px",
				fontFamily:"微软雅黑",
				fontWeight:"bold"
			}       
        },
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                	distance:0.5,
                    enabled: true,
                    formatter: function() {
                    	if (nameBrFlg) {
							return '<b>'+ this.point.name +'</b>:'+'<br/>'
								   + Highcharts.numberFormat(this.percentage, 1) +'%'+'<br/>'
								   + Highcharts.numberFormat(this.y,0,',');
                    	} else {
							return '<b>'+ this.point.name +'</b>:'
								   + Highcharts.numberFormat(this.percentage, 1) +'%'+'<br/>'
								   + Highcharts.numberFormat(this.y,0,',');
                    	}
					}
                }
            }
        },
        
		series: [{                                                              
            type: 'pie',
            //从后台获取数据
            data:seriesData,
        }]
    });
};

/**
 * 加载条形图
 * @param chartId：chart container id
 * @param titleText ：chart title
 * @param xAxisText ：xAxis show text
 * @param seriesData ：bar chart data
 */
var loadingBarChart = function (chartId,titleText,xAxisText,seriesData) {
	
	$(chartId).highcharts({
        chart: {
            type: 'bar'
        },
        exporting: {
        	enabled: false
        },
        title: {
            text: titleText ,
			style: {
				color: "#000000",
				fontSize: "16px",
				fontFamily:"微软雅黑",
				fontWeight:"bold"
			}       
        },
        xAxis: {
        	categories: xAxisText,
            labels: {
                align: 'right',
                style: {
					color: "#000000",
		        	fontSize: '12px',
					fontFamily:"微软雅黑",
                }
		    }
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
            },
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        
		series: [{                                                              
            data: seriesData                                                                
        }]
    });
};

var getColorByType = function(analyzeNm){
	
	var chartColor;
	switch (analyzeNm.trim()){
		case "20以下":
			chartColor = '#FF6666';
			break;
		case "20-35岁":
			chartColor = '#99CCFF';
			break;
		case "36-50岁":
			chartColor = '#99CC00';
			break;
		case "50以上":
			chartColor = '#003366';
			break;
		default:
			break;
		}
	
	return chartColor
}

var getColorByColorNm = function(colorNm){
	
	var chartColor;
	if(colorNm.indexOf("白") >= 0)   chartColor = '#FFFFFF';
	if(colorNm.indexOf("橙") >= 0)   chartColor = '#EEAD0E';
	if(colorNm.indexOf("粉") >= 0)   chartColor = '#EE82EE';
	if(colorNm.indexOf("褐") >= 0)   chartColor = '#8B3E2F';
	if(colorNm.indexOf("黑") >= 0)   chartColor = '#000000';
	if(colorNm.indexOf("红") >= 0)   chartColor = '#CD2626';
	if(colorNm.indexOf("黄") >= 0)   chartColor = '#EEEE00';
	if(colorNm.indexOf("灰") >= 0)   chartColor = '#8C8C8C';
	if(colorNm.indexOf("蓝") >= 0)   chartColor = '#1C86EE';
	if(colorNm.indexOf("青") >= 0)   chartColor = '#00FFFF';
	if(colorNm.indexOf("银") >= 0)   chartColor = '#D9D9D9';
	if(colorNm.indexOf("紫") >= 0)   chartColor = '#9932CC';
	if(colorNm.indexOf("绿") >= 0)   chartColor = '#32CD32';
	if(colorNm.indexOf("金") >= 0)   chartColor = '#FAFAD2';
	if(colorNm.indexOf("其他") >= 0) chartColor = '#BFEFFF';
	
	return chartColor
}