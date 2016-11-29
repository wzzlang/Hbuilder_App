var whPicker 			= null;
var orgPicker 			= null;
var branchPicker 		= null;
var officePicker 		= null;
var mainDealerPicker 	= null;
var subDealerPicker 	= null;
var subSubDealerPicker 	= null;
var provincePicker 		= null;
var cityPicker 			= null;
var modelCategoryPicker = null;
var modelClassPicker 	= null;
var modelPicker 		= null;
var consigneePicker		= null;
var localData			= eval('('+localStorage.getItem("localData")+')');
var localWhList			= localData.whList;
var localOrgList		= localData.orgList;
var localMainDealerList = localData.mainDealerList;
var localSubDealerList	= localData.subDealerList;
var localProvinceList	= localData.provinceList;
var pickerData;
var whHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(whPicker) == "undefined" || whPicker == null){
			whPicker   = new mui.PopPicker();
			pickerData = [];
			for(var i=0; i<wh.length; i++) {
				if (wh[i].id == "" || $.inArray(wh[i].id, localWhList) != -1) {
					pickerData.push(wh[i]);
				}
			}
			whPicker.setData(pickerData);
		}
		return showPicker(whPicker, pickerId);
	}, false);
}
var orgHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(orgPicker) == "undefined" || orgPicker == null){
			orgPicker  = new mui.PopPicker();
			pickerData = [];
			for (var i=0; i<branch.length; i++) {
				if (branch[i].id == "" || $.inArray(branch[i].id, localOrgList) != -1) {
					pickerData.push(branch[i]);
				}
			}
			for (var i=0; i<office.length; i++) {
				if (office[i].id == "" || $.inArray(office[i].parentId, localOrgList) != -1
									   || $.inArray(office[i].id, 		localOrgList) != -1) {
					pickerData.push(office[i]);
				}
			}
			orgPicker.setData(pickerData);
		}
		return showPicker(orgPicker, pickerId);
	}, false);
}
var branchHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(branchPicker) == "undefined" || branchPicker == null){
			branchPicker = new mui.PopPicker();
			pickerData   = [];
			for (var i=0; i<branch.length; i++) {
				if (branch[i].id == "" || $.inArray(branch[i].id, localOrgList) != -1) {
					pickerData.push(branch[i]);
				}
			}
			branchPicker.setData(pickerData);
		}
		return showPicker(branchPicker, pickerId);
	 }, false);
}
var officeHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		if(typeof(officePicker) == "undefined" || officePicker == null){
			officePicker = new mui.PopPicker();
			pickerData   = [];
			for (var i=0; i<office.length; i++) {
				if (office[i].id == "" || $.inArray(office[i].parentId, localOrgList) 	!= -1
									   || $.inArray(office[i].id, 		localOrgList) 	!= -1) {
					pickerData.push(office[i]);
				}
			}
		}
		officePicker.setData(filterDataByParentId(parentIdValue, pickerData));
		return showPicker(officePicker, pickerId);
	 }, false);
}
var mainDealerHelper = function(pickerId, parentIdObj, isNoDataSecurityObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		mainDealerPicker  = new mui.PopPicker();
		pickerData   	  = [];
		if (typeof(isNoDataSecurityObj) != "undefined" && isNoDataSecurityObj.value) {
			pickerData = mainDealer;
		} else {
			for (var i=0; i<mainDealer.length; i++) {
				if (mainDealer[i].id == "" || $.inArray(mainDealer[i].grandParentId, localOrgList) 			!= -1 
				 						   || $.inArray(mainDealer[i].parentId, 	 localOrgList) 			!= -1
				 						   || $.inArray(mainDealer[i].id, 	    	 localMainDealerList) 	!= -1) {
					pickerData.push(mainDealer[i]);
				}
			}
		}
		mainDealerPicker.setData(filterDataByParentId(parentIdValue, pickerData));
		return showPicker(mainDealerPicker, pickerId);
	}, false);
}
var subDealerHelper = function(pickerId, parentIdObj, isNoDataSecurityObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		subDealerPicker   = new mui.PopPicker();
		pickerData   	  = [];
		if (typeof(isNoDataSecurityObj) != "undefined" && isNoDataSecurityObj.value) {
			pickerData = subDealer;
		} else {
			for (var i=0; i<subDealer.length; i++) {
				if (subDealer[i].id == "" || subDealer[i].parentId == parentIdValue
										  || (localSubDealerList.size > 0 && $.inArray(subDealer[i].id, localSubDealerList) != -1)) {
					pickerData.push(subDealer[i]);
				}
			}
		}
		subDealerPicker.setData(filterDataByParentId(parentIdValue, pickerData));// parentIdValue must have value
		return showPicker(subDealerPicker, pickerId);
	}, false);
}
var subSubDealerHelper = function(pickerId, parentIdObj, isNoDataSecurityObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue  = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		subSubDealerPicker = new mui.PopPicker();
		pickerData   	   = [];
		if (typeof(isNoDataSecurityObj) != "undefined" && isNoDataSecurityObj.value) {
			pickerData = subSubDealer;
		} else {
			for (var i=0; i<subSubDealer.length; i++) {
				if (subSubDealer[i].id == "" || subSubDealer[i].parentId == parentIdValue
											 || (localSubDealerList.size > 0 && $.inArray(subSubDealer[i].id, localSubDealerList) != -1)) {
					pickerData.push(subSubDealer[i]);
				}
			}
		}
		subSubDealerPicker.setData(filterDataByParentId(parentIdValue, pickerData));// parentIdValue must have value
		return showPicker(subSubDealerPicker, pickerId);
	}, false);
}
var provinceHelper = function(pickerId){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(provincePicker) == "undefined" || provincePicker == null){
			provincePicker = new mui.PopPicker();
			pickerData   	   = [];
			for (var i=0; i<province.length; i++) {
				if (province[i].id == "" || $.inArray(province[i].id, localProvinceList) != -1) {
					pickerData.push(province[i]);
				}
			}
			provincePicker.setData(pickerData);
		}
		return showPicker(provincePicker, pickerId);
	}, false);
}
var cityHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		if(typeof(cityPicker) == "undefined" || cityPicker == null){
			cityPicker = new mui.PopPicker();
			pickerData = [];
			for (var i=0; i<city.length; i++) {
				if (city[i].id == "" || $.inArray(city[i].parentId, localProvinceList) != -1) {
					pickerData.push(city[i]);
				}
			}
		}
		cityPicker.setData(filterDataByParentId(parentIdValue, pickerData));
		return showPicker(cityPicker, pickerId);
	}, false);
}
var modelCategoryHelper = function(pickerId, callBackFunc){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		if(typeof(modelCategoryPicker) == "undefined" || modelCategoryPicker == null){
			modelCategoryPicker = new mui.PopPicker();
			modelCategoryPicker.setData(modelCategory);
		}
		return showPicker(modelCategoryPicker, pickerId, callBackFunc);
	}, false);
}
var modelClassHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		if(typeof(modelClassPicker) == "undefined" || modelClassPicker == null){
			modelClassPicker = new mui.PopPicker();
		}
		modelClassPicker.setData(filterDataByParentId(parentIdValue, modelClass));
		return showPicker(modelClassPicker, pickerId);
	}, false);
}
var modelHelper = function(pickerId, parentIdObj, grandParentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue 	   = ((typeof(parentIdObj) 	    == "undefined" || parentIdObj 	   == null) ? "":parentIdObj.value);
		var grandParentIdValue = ((typeof(grandParentIdObj) == "undefined" || grandParentIdObj == null) ? "":grandParentIdObj.value);
		if(typeof(modelPicker) == "undefined" || modelPicker == null){
			modelPicker = new mui.PopPicker();
		}
		if (parentIdValue != "") {
			modelPicker.setData(filterDataByParentId(parentIdValue, model));
		} else {
			modelPicker.setData(filterDataByGrandParentId(grandParentIdValue, model));
		}
		return showPicker(modelPicker, pickerId);
	}, false);
}

var consigneeHelper = function(pickerId, parentIdObj){
	document.getElementById(pickerId).addEventListener('tap', function(event) {
		var parentIdValue = ((typeof(parentIdObj) == "undefined" || parentIdObj == null) ? "":parentIdObj.value);
		consigneePicker   = new mui.PopPicker();
		if (parentIdValue == "") {
			var pickerData = [];
			pickerData.push(consignee[0]);
			consigneePicker.setData(pickerData);
			return showPicker(consigneePicker, pickerId);
		}
		consigneePicker.setData(filterDataByParentId(parentIdValue, consignee));
		return showPicker(consigneePicker, pickerId);
	 }, false);
}
//普通下拉框
var showPicker = function(pickerObj, pickerId, callBackFunc){
	pickerObj.show(function(items) {
		
		var pickerObj = document.getElementById(pickerId);
		
		//设置画面显示内容
		pickerObj.innerHTML = items[0].name;
		//设置确定后的字体颜色
		items[0].id == '' ? pickerObj.classList.remove("common-font")
						  : pickerObj.classList.add("common-font");
		
		//设置下拉框隐藏Value（默认设置db.id）
		var pickerName		= document.getElementById(pickerId).getAttribute("name");
		var pickerObjArr 	= document.getElementsByName(pickerName);
		var pickerValueObj 	= pickerObjArr[pickerObjArr.length-1];
		pickerValueObj.value= items[0].id;
		if (typeof(callBackFunc) != "undefined" && callBackFunc != null) {
			callBackFunc();
		}
	
		return items[0];
		//sessionStorage.setItem(id,items[0].id);
		//设置一个对象存储dropdownlist的id
		//返回 false 可以阻止选择框的关闭
		//return false;
	});
}

function setHelperValue(valueObj, valueId, valueType){
	if (typeof(valueObj) != "undefined") {
		var value = "";
		if (valueType == "id"	) value = valueObj.id;
		if (valueType == "code"	) value = valueObj.code; 
		if (valueType == "name"	) value = valueObj.name; 
		
		document.getElementById(valueId).value = value;
	}
}

var filterDataByParentId = function(parentIdValue, sourceDataArr){
	var pickerData = [];
	if (typeof(parentIdValue) == "undefined" || parentIdValue == null || parentIdValue == "") {
		pickerData=sourceDataArr;
	} else {
		for(var i=0;i<sourceDataArr.length;i++){
			if (sourceDataArr[i].id=="" || parentIdValue==sourceDataArr[i].parentId){
				pickerData.push(sourceDataArr[i]);
			}
		}
	}
	return pickerData;
}

var filterDataByGrandParentId = function(grandParentIdValue, sourceDataArr){
	var pickerData = [];
	if (typeof(grandParentIdValue) == "undefined" || grandParentIdValue == null || grandParentIdValue == "") {
		pickerData=sourceDataArr;
	} else {
		for(var i=0;i<sourceDataArr.length;i++){
			if (ourceDataArr[i].id=="" || grandParentIdValue==sourceDataArr[i].grandParentId){
				pickerData.push(sourceDataArr[i]);
			}
		}
	}
	return pickerData;
}

var getParentId =function(id){
	var parentId = sessionStorage.getItem(id);
	return parentId
}
