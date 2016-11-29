var photoIconContainerObj = document.getElementById("photoIconContainer");
var occupationObj         = document.getElementById("occupation");
var purTypePickerObj   	  = document.getElementById("purTypePicker");
var preCarBrandPickerObj  = document.getElementById("preCarBrandPicker");
var preCarProductObj      = document.getElementById("preCarProduct");
var knowChannalObj        = document.getElementById("knowChannal");
var saveSurveyBtnObj      = document.getElementById("saveSurveyBtn");
var takePhotoContainerObj = document.getElementById("takePhotoContainer");

var userCarPicShowObj     = document.getElementById("userCarPicShow");
var userCarPicObj         = document.getElementById("userCarPic");
var upImgUrl              = rootPath + "mma/mmaa08/MMAA08UploadSurveyImg"; 
var localDataObj;
var fileName = "";
var pictureSaveFlg = "";//"0"no save ; "1"saved

(function($, doc) {
	$.init();
	$.plusReady(function() {
		initCondition();
		helperEvent();
		takePhotoEvent();
		saveSurveyInfo();
	});
})(mui, document); 

function initCondition(){
	
	// Get Parameter
	localDataObj   = eval('('+localStorage.getItem("localData")+')'); 
	fileName       = eval(JSON.stringify(plus.webview.currentWebview().frameNo));
}

function helperEvent(){
	
	purTypeHelper();
	preCarHelper();
}

function takePhotoEvent(){
	
	takePhotoContainerObj.addEventListener('tap', function(event){
		appendByCamera();
	},false);
}

function saveSurveyInfo(){
	
	saveSurveyBtnObj.addEventListener('tap', function(event) {
		
		// Get parameter
		var userSurveyInfo = {pictureSaveFlg   : pictureSaveFlg
			                 ,occupation   	   : occupationObj.value
				             ,purType          : purTypePickerObj.value
				             ,preCarBrand      : preCarBrandPicker.value
				             ,preCarProductCd  : preCarProductObj.value
				             ,knowChannal	   : knowChannalObj.value};
		
		localStorage.setItem("userSurveyData",JSON.stringify(userSurveyInfo));
		mui.back();
	}, false);
}

var purTypeHelper = function(){
	var purTypeData = [{value: '0', name: '首次购买'}
				      ,{value: '1', name: '增购'}
				      ,{value: '2', name: '换购'}];
	commonHelper("purTypePicker",purTypeData);
}

var preCarHelper = function(){
	var preCarBrandData = [{value: '0', name: '豪爵'}
				          ,{value: '1', name: '雅马哈'}
				          ,{value: '2', name: '铃木'}
				          ,{value: '3', name: '五羊本田'}
				          ,{value: '4', name: '新大洲本田'}
				          ,{value: '5', name: '其他'}];
	commonHelper("preCarBrandPicker",preCarBrandData);
}

var commonHelper = function(targetId,pickerData){
	var targetPickerButton = document.getElementById(targetId);
	targetPickerButton.addEventListener('tap', function(event) {
		var commonsPicker   = new mui.PopPicker();
		commonsPicker.setData(pickerData);
		commonsPicker.show(function(items) {
			targetPickerButton.innerText = items[0].name;
			targetPickerButton.value     = items[0].value;
		});
	}, false);
}

// 拍照添加文件
function appendByCamera(){
	plus.camera.getCamera().captureImage(function(path){
		//上传图片
		upload(path);
		mui('#picture').popover('toggle');
	});	
}

// 上传文件
function upload(path){
	
	if(typeof(path)=="undefined" ||  path.trim == ''){
		plus.nativeUI.alert("添加图片失败！");
		return;
	}
	
	//加载等待标志
	var wt=plus.nativeUI.showWaiting();
	//压缩图片
	plus.zip.compressImage({
			src: path,
			dst: "_doc/"+fileName+".jpg",
			overwrite: true,
			width: '600px', 
			format: 'jpg',
			quality: 100
		},
		function(event) {
			var newPath = event.target;
			var task=plus.uploader.createUpload(upImgUrl
											  ,{method:"POST"}
											  ,function(t,status){ //上传完成
				if(status==200){
					var returnDatas = JSON.parse(t.responseText);
					
					showPicture(returnDatas,newPath);
					
					wt.close();
				}else{
					wt.close();
				}
			});
			//上传到服务器的数据
			task.addData("client","MMAA08");
			task.addData("uid",getUid());
			task.addFile(newPath,{key:"file_upload"});
			task.start();
		},function(error) {
			console.log("Compress error!")
		}
	);
}
// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
}

function showPicture(returnDatas,newPath) {
	
	//判断图片是否上传成功
	var userCarPicPath = returnDatas.userCarPicPath;
	userCarPicPath != null ? pictureSaveFlg = "1" 
	                       : pictureSaveFlg = "0"
	                       
	userCarPicObj.src  = newPath;
	
	userCarPicShowObj.style.display     = "block";
	photoIconContainerObj.style.display = "none";
}