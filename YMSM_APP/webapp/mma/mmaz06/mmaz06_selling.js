var areaNmObj 	        = document.getElementById("areaNm");
var modelCategoryNmObj 	= document.getElementById("modelCategoryNm");
var modelClassNmObj 	= document.getElementById("modelClassNm");
var periodObj 	        = document.getElementById("period");
var sellingBarChartObj 	= document.getElementById("sellingBarChart");
var sellingHeaderRequestURL = "maz06/getSellingBarHeader";
var sellingBarRequestURL    = "maz06/getSellingBarList";
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
		setSellingInfo();
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
		,modelCategoryId : eval(JSON.stringify(curWebview.modelCategoryId))
		,modelClassId 	 : eval(JSON.stringify(curWebview.modelClassId))
	};
}

function setSellingInfo(){
	
	get_ajax(sellingHeaderRequestURL, requestPara, function(returnData){
		
		areaNm 			= returnData.areaNm;
		modelCategoryNm = returnData.modelCategoryNm;
		modelClassNm 	= returnData.modelClassNm;
		period 			= returnData.period;
		
		areaNmObj.innerText 		 = areaNm;
		modelCategoryNmObj.innerText = modelCategoryNm;
		modelClassNmObj.innerText 	 = modelClassNm;
		periodObj.innerText	 		 = period;
		
		//loading Selling Bar analys
		getSellingBarChart();
	});
}

var getSellingBarChart = function(){
	
	//get selling bar data from server
	var sellingBarData = [];
	var sellingBarXAxisText = [];
	getSellingBarData(sellingBarData,sellingBarXAxisText);
}

function getSellingBarData(sellingBarData,sellingBarXAxisText){
	
	post_ajax(sellingBarRequestURL, requestPara, function(returnData){
		
		$.each(returnData.details, function (i, item) {
		
	    	sellingBarXAxisText.push(item.modelNm);
	    	sellingBarData.push({
	            y: item.modelQty                                        
	        });
	    }); 
	    
		//Construct chart title
		var chartTitle = period + " " + areaNm + "销量排行榜（机型别）";
		//loading selling chart
		loadingBarChart(sellingBarChartObj,chartTitle,sellingBarXAxisText,sellingBarData);
	});
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
            text: chartTitle ,
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
                },
	            formatter: function () {
                    var splitValue   = this.value.split(" ");
                    var displayValue = "";
                    for (var i=0; i<splitValue.length; i++) {
                    	displayValue = displayValue + splitValue[i] + '<br/>';
                    }
                    return displayValue;
	             }
		    },
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