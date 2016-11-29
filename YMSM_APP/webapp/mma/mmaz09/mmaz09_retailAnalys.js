var modelClassNmObj 	= document.getElementById("modelClassNm");
var periodObj 	        = document.getElementById("period");
var retailBarLiObj 	    = document.getElementById("retailBarLi");
var retailPieLiObj 	    = document.getElementById("retailPieLi");
var retailBarChartObj 	= document.getElementById("retailBarChart");
var retailPieChartObj 	= document.getElementById("retailPieChart");
var headerRequestURL    = "mma/mmaz09/MMAZ09InitialService";
var retailBarRequestURL = "mma/mmaz09/MMAZ09GetModelRetailBarList";
var retailPieRequestURL = "mma/mmaz09/MMAZ09GetModelRetailPieList";
var localDataObj;
var requestPara;
var modelClassNm;
var period;

(function($, doc) {
	$.init();
	$.plusReady(function() {
		//prepare initial data
		getInitialData();
		//set area & period to header
		setHeaderInfo();
		//loading model retail bar analys
		getModelRetailBarChart();
		//loading model retail pie analys
		getModelRetailPieChart();
		// Tap scroll to header
		scrollToHeader();
	});
})(mui, document); 

function getInitialData() {
	
	localDataObj = eval('('+localStorage.getItem("localData")+')');
	var userId 	  = localDataObj.userId;
	var curWebview = plus.webview.currentWebview();
	
	requestPara= {
		 userId            : userId
		,productClassRadio : eval(JSON.stringify(curWebview.productClassRadio))
		,modelClassId      : eval(JSON.stringify(curWebview.modelClassId))
		,dbYear            : eval(JSON.stringify(curWebview.dbYear))
		,dbMonthFrom       : eval(JSON.stringify(curWebview.dbMonthFrom))
		,dbMonthTo         : eval(JSON.stringify(curWebview.dbMonthTo))
	};
}

function setHeaderInfo(){
	
	post_ajax(headerRequestURL, requestPara, function(returnData){
		
		modelClassNm = returnData.modelClassNm;
		period = returnData.period;
		modelClassNmObj.innerText = modelClassNm;
		periodObj.innerText = period;
	});
}

function getModelRetailBarChart(){
	
	$(retailBarLiObj).one("tap",function(){
		//get gender bar data from server
		var retailBarData      = [];
		var retailBarXAxisText = [];
		getModelRetailBarData(retailBarData , retailBarXAxisText);
	})
}

function getModelRetailPieChart(){
	
	$(retailPieLiObj).one("tap",function(){
		//get age pie data from server
		var retailPieData = [];
		getModelRetailPieData(retailPieData);
	})
}

function getModelRetailBarData(retailBarData , retailBarXAxisText){
	
	post_ajax(retailBarRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
		
	    	retailBarXAxisText.push(item.areaNm);
	    	retailBarData.push({
	            y: item.userCardQty                                       
	        });
	    }); 
	    
		//Construct chart title
		var chartTitle = modelClassNm + "<br/>" + "累计零售【省别】";
		//loading selling chart
		loadingBarChart(retailBarChartObj,chartTitle,retailBarXAxisText,retailBarData);
	});
}

function getModelRetailPieData(retailPieData){
	
	post_ajax(retailPieRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
			var pieColor = getColorByType(item.areaNm);
	    	retailPieData.push({
	        	name : item.areaNm,
	            y    : item.userCardQty,
	            color:pieColor
	        });
	    });
	    
		//Construct chart title
		var chartTitle = modelClassNm + "<br/>" + "累计零售【区域】";
		//loading pie chart
		loadingPieChart(retailPieChartObj,chartTitle,retailPieData);
	});
}

/**
 * 加载饼状图
 * @param chartId：chart container id
 * @param titleText ：chart title
 * @param seriesData ：pie chart data
 */
var loadingPieChart = function (chartId,titleText,seriesData) {
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
            text: titleText,
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
                	distance:1,
                    enabled: true,
                    formatter: function() {
						return '<b>'+ this.point.name +'</b>: <br/> '
							   + Highcharts.numberFormat(this.percentage, 1) +'%'+'<br/>'
							   + Highcharts.numberFormat(this.y,0,',');
					}
                }
            }
        },
        
		series: [{                                                              
            type: 'pie',
            //从后台获取数据
            data:seriesData
        }]
    });
};

var getColorByType = function(areaNm){
	
	var chartColor;
	switch (areaNm.trim()){
		case "华东支店":
			chartColor = '#FF6666';
			break;
		case "华西支店":
			chartColor = '#99CCFF';
			break;
		case "华南支店":
			chartColor = '#99CC00';
			break;
		case "华北支店":
			chartColor = '#003366';
			break;
		case "华中支店":
			chartColor = '#FFC125';
			break;
		default:
			break;
		}
	
	return chartColor
}

var loadingBarChart = function(chartId,chartTitle,xAxisText,seriesData){
	
	 $(chartId).highcharts({                                           
        chart: {                                                           
            type: 'bar'                                                    
        },
        exporting: {
        	enabled: false
        },
        title: {                                                           
            text: chartTitle,
			style: {
				color: "#000000",
				fontSize: "16px",
				fontFamily:"微软雅黑",
				fontWeight:"bold"
			}                
        },                                                               
        xAxis: {
            categories: xAxisText,
            title: {                                                       
                text: null                                                 
            },
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
                text: null                            
            }                                                        
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
        series: [{
            data: seriesData
        }]                                                                 
    }); 
}