var modelNmDispSwitchObj    = document.getElementById("modelNmDispSwitch");
var modelCdDispSwitchObj    = document.getElementById("modelCdDispSwitch");

(function($, doc) {
	$.init();
	$.plusReady(function() {
		
		//Initial
		initializeData();
		
		modelNmDispSwitchObj.addEventListener('toggle', function(event) {
			
			//save checked of the modelCd & modelNm
			saveRetrieveHabit();
		});
		
		modelCdDispSwitchObj.addEventListener('toggle', function(event) {
			
			//save checked of the modelCd & modelNm
			saveRetrieveHabit();
		});
	});
}(mui, document));

function initializeData() {
	
	var habitSetData = eval('('+localStorage.getItem("habitSetData")+')');
	
	modelNmDispSwitchObj.value = habitSetData.modelNmDisp;
	modelCdDispSwitchObj.value = habitSetData.modelCdDisp;
	
	if(modelNmDispSwitchObj.value == "1"){
		modelNmDispSwitchObj.classList.add("mui-active");
	}
	if(modelCdDispSwitchObj.value == "1"){
		modelCdDispSwitchObj.classList.add("mui-active");
	}
}

function saveRetrieveHabit(){

	modelNmDispSwitchObj.value = modelNmDispSwitchObj.classList.contains('mui-active') ? "1" : "0";
	modelCdDispSwitchObj.value = modelCdDispSwitchObj.classList.contains('mui-active') ? "1" : "0";

	var habitSetDataInfo = {modelNmDisp : modelNmDispSwitchObj.value
						   ,modelCdDisp : modelCdDispSwitchObj.value};
		                  
    if (modelNmDispSwitchObj.value == "0" && modelCdDispSwitchObj.value == "0") {
    	habitSetDataInfo = {modelNmDisp : "1"
    					   ,modelCdDisp : "0"};
    }
    
	localStorage.setItem("habitSetData",JSON.stringify(habitSetDataInfo));
}