var processPeriodTypeObj = document.getElementById("processPeriodType");
var dailyTabObj	         = document.getElementById("dailyTab");
var weeklyTabObj	     = document.getElementById("weeklyTab");
var monthlyTabObj	     = document.getElementById("monthlyTab");
var dailyTabTargetObj	 = document.getElementById("dailyTabTarget");
var weeklyTabTargetObj	 = document.getElementById("weeklyTabTarget");
var monthlyTabTargetObj	 = document.getElementById("monthlyTabTarget");
var requestUrl           = "mmf/mmfz02/MMFZ02ShipRecvAnalysis";
var recvDailyBarData     = [];
var shipDailyBarData     = [];
var recvWeeklyBarData    = [];
var shipWeeklyBarData    = [];
var recvMonthlyBarData   = [];
var shipMonthlyBarData   = [];
var dailyLineData        = [];
var weeklyLineData       = [];
var monthlyLineData      = [];
var subjectDaily 	     = "1";
var subjectWeekly 	     = "2";
var subjectMonthly 	     = "3";

var userId;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		getInitialData();
		retrieveEvent();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function getInitialData() {
	var localDataObj = eval('('+localStorage.getItem("localData")+')');
	userId 	         = localDataObj.userId;
}

function retrieveEvent() {
	
	dailyAnalysEvent();
	weeklyAnalysEvent();
	monthlyAnalysEvent();
}

function dailyAnalysEvent() {
	
	var barXAxisText = ["今日：","昨日："];
	var analyzeTarget = subjectDaily;
	
	//获取后台数据
	var para = perpareParameter(analyzeTarget);
	post_ajax(requestUrl,para,function(returnData){
		
		//获取出库、入库的条形图数据
		recvDailyBarData = [{color : '#F14E41'
					        ,data  : [returnData.curRecvQty ,returnData.oldRecvQty]
						    }]
		shipDailyBarData = [{color : '#008000'
					        ,data  : [returnData.curShipQty ,returnData.oldShipQty]
						    }]
	                         
		//生成条形图
		loadingBarChart("dailyRecvContainer",null,barXAxisText,recvDailyBarData);
		loadingBarChart("dailyShipContainer",null,barXAxisText,shipDailyBarData);
		
		//获取出库、入库的线性图数据
		var recvSeriesDt = recvSeriesData(returnData);
		var shipSeriesDt = shipSeriesData(returnData);
		
		//获取线性图的x轴坐标
		var lineXAxisText = lineXAxisLabel(returnData);
		
		dailyLineData.push({
	        name  : '入库'
	       ,color : '#F14E41'
	       ,data  : recvSeriesDt
	    })
		
		dailyLineData.push({
	        name  : '出库'
	       ,color : '#008000'
	       ,data  : shipSeriesDt
	    })
		
		//生成折线图
		loadingLineChart("dailyLineContainer",dailyLineData,lineXAxisText);
	});
	
	dailyTabObj.addEventListener('tap', function(event) {
		
		dailyTabTargetObj.style.display="block";
		weeklyTabTargetObj.style.display="none";
		monthlyTabTargetObj.style.display="none";
	}, false);
}

function weeklyAnalysEvent() {
	
	weeklyTabObj.addEventListener('tap', function(event) {
		
		dailyTabTargetObj.style.display="none";
		weeklyTabTargetObj.style.display="block";
		monthlyTabTargetObj.style.display="none";
		
		if(recvWeeklyBarData.length > 0 || shipWeeklyBarData.length > 0 || weeklyLineData.length > 0) return;
		
		var barXAxisText = ["本周：","上周："];
		var analyzeTarget = subjectWeekly;
		
		//获取后台数据
		var para = perpareParameter(analyzeTarget);
		post_ajax(requestUrl,para,function(returnData){
			
			//获取出库、入库的条形图数据
			recvWeeklyBarData = [{color : '#F14E41'
						         ,data  : [returnData.curRecvQty ,returnData.oldRecvQty]
							     }]
			shipWeeklyBarData = [{color : '#008000'
						         ,data  : [returnData.curShipQty ,returnData.oldShipQty]
							     }]
			
			//生成条形图
			loadingBarChart("weeklyRecvContainer",null,barXAxisText,recvWeeklyBarData);
			loadingBarChart("weeklyShipContainer",null,barXAxisText,shipWeeklyBarData);
			
			//获取出库、入库的线性图数据
			var recvSeriesDt = recvSeriesData(returnData);
			var shipSeriesDt = shipSeriesData(returnData);
			
			//获取线性图的x轴坐标
			var lineXAxisText = lineXAxisLabel(returnData);
			
			weeklyLineData.push({
		        name: '入库'
		       ,color : '#F14E41'
		       ,data: recvSeriesDt
		    })
			
			weeklyLineData.push({
		        name: '出库'
	       	   ,color : '#008000'
		       ,data: shipSeriesDt
		    })
			
			//生成折线图
			loadingLineChart("weeklyLineContainer",weeklyLineData,lineXAxisText);
		});
	}, false);
}

function monthlyAnalysEvent() {
	
	monthlyTabObj.addEventListener('tap', function(event) {
		
		dailyTabTargetObj.style.display="none";
		weeklyTabTargetObj.style.display="none";
		monthlyTabTargetObj.style.display="block";
		
		if(recvMonthlyBarData.length > 0 || shipMonthlyBarData.length > 0 || monthlyLineData.length > 0) return;
		
		var barXAxisText = ["本月：","上月："];
		var analyzeTarget = subjectMonthly;
		
		//获取后台数据
		var para = perpareParameter(analyzeTarget);
		post_ajax(requestUrl,para,function(returnData){
			
			//获取出库、入库的条形图数据
			recvMonthlyBarData = [{color : '#F14E41'
						          ,data  : [returnData.curRecvQty ,returnData.oldRecvQty]
							      }]
			shipMonthlyBarData = [{color : '#008000'
						          ,data  : [returnData.curShipQty ,returnData.oldShipQty]
							      }]
	                             
			//生成条形图
			loadingBarChart("monthlyRecvContainer",null,barXAxisText,recvMonthlyBarData);
			loadingBarChart("monthlyShipContainer",null,barXAxisText,shipMonthlyBarData);
			
			//获取出库、入库的线性图数据
			var recvSeriesDt = recvSeriesData(returnData);
			var shipSeriesDt = shipSeriesData(returnData);
			
			//获取线性图的x轴坐标
			var lineXAxisText = lineXAxisLabel(returnData);
			
			monthlyLineData.push({
		        name: '入库'
		       ,color : '#F14E41'
		       ,data: recvSeriesDt
		    })
			
			monthlyLineData.push({
		        name: '出库'
	       	   ,color : '#008000'
		       ,data: shipSeriesDt
		    })
			
			//生成折线图
			loadingLineChart("monthlyLineContainer",monthlyLineData,lineXAxisText);
		});
	}, false);
}

var recvSeriesData = function(returnData){
	
	var recvSeriesDt = [];
	$.each(returnData.recvDetails, function (i, item) {
		
		recvSeriesDt.push(item.qty);
	});
	return recvSeriesDt;
}

var shipSeriesData = function(returnData){
	
	var shipSeriesDt = [];
	
	$.each(returnData.shipDetails, function (i, item) {
		
		shipSeriesDt.push(item.qty);
	});
	
	return shipSeriesDt;
}

var lineXAxisLabel = function(returnData){
	
	var lineXAxisText = [];
	var hash = {};
	
	$.each(returnData.recvDetails, function (i, item) {
		
		lineXAxisText.push(item.processTime);
		hash[item.processTime] = true;
	});
	
	$.each(returnData.shipDetails, function (i, item) {
		
		if (!hash[item.processTime]) {
            lineXAxisText.push(item.processTime);
        }
	});
	
	return lineXAxisText.sort();
}

var perpareParameter = function(analyzeTarget) {
	
	return  {userId:userId
			,analyzeTarget:analyzeTarget
			};
}

/**
 * 加载线状图
 * @param chartId：chart container id
 * @param seriesData ：line chart data
 */
var loadingLineChart = function (chartId,seriesData,lineXAxisText) {
	var chartLineId = document.getElementById(chartId);
	
	$(chartLineId).highcharts({
        title: {
            text: null,
        },
        credits: {
            enabled: false
        },
        xAxis: {
        	categories:lineXAxisText,
        },
        yAxis: {
            title: {
                text: null
            },
            allowDecimals:false
        },
        tooltip: {
            enabled: false
        },
        series: seriesData
    });
}

/**
 * 加载条形图
 * @param chartId：chart container id
 * @param titleText ：chart title
 * @param xAxisText ：xAxis show text
 * @param seriesData ：bar chart data
 */
var loadingBarChart = function (chartId,titleText,xAxisText,seriesData) {
	var chartBarId = document.getElementById(chartId);
	
	$(chartBarId).highcharts({                                           
        chart: {                                                           
            type: 'bar',
            reflow:false
        },                                                                 
        title: {                                                           
            text: titleText                    
        },                                                               
        xAxis: {
            categories: xAxisText,
    		tickWidth:0,
            title: {                                                       
                text: null                                                 
            },
            labels: {
                align: 'right',
                style: {
		            fontSize: '14px',
		            color: "#000000",
					fontFamily:"微软雅黑"
                }
		    }
        },                                                                 
        yAxis: {
        	title: {                                                       
                text: null                                                 
            },
            gridLineWidth:0,
            tickInterval: 100,
            labels: {
                enabled:false
		    },
        },
        legend: {
            enabled: false
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
        credits: {                                                         
            enabled: false                                                 
        },                                                                 
        series: seriesData                                                            
    }); 
};
