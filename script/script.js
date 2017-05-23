//--------------AJAX call
function xhr(mode,payload){
	try{
		var xmlhttp;
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		  }
		else
		  {
		  try{
		  	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		  catch(e){
		  	try{
		  		xmlhttp=new ActiveXObject("Msxml3.XMLHTTP");
		  	}
		  	catch(e){
		  		try{
		  			xmlhttp=new ActiveXObject("Msxml2.XMLHTTP.6.0");
		  		}
		  		catch(e){
		  			try{
		  				xmlhttp=new ActiveXObject("Msxml2.XMLHTTP.3.0");
		  			}
		  			catch(e){
		  				try{
		  					xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
		  				}
		  				catch(e){
		  					try{
		  						xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  					}
		  					catch(e){
		  						closeLoadBar();
		  						alert('Your browser does not have the required functionalities.<br>Please switch to a newer browser.');
		  						return;
		  					}
		  					
		  				}
		  			}
		  		}
		  	}
		  }
		  }
		xmlhttp.onreadystatechange=function(){
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		    {
		      clearTimeout(xmlHttpTimeout); 
		      doProcess(xmlhttp.responseText);
		    }
		}
		var pLoad=JSON.stringify(payload);
		xmlhttp.open("POST",'https://script.google.com/a/macros/jowaipolytechnic.in/s/AKfycbzAzOkP_MNFDV15UlCo54Dbq1qfL1qfcTw6-dg4c_8xKcvDvW0/exec?mode='+mode+'&payload='+pLoad,true);
		xmlhttp.send();
		// Timeout to abort in 2 mins
		var xmlHttpTimeout=setTimeout(ajaxTimeout,120000);
		function ajaxTimeout(){
		   xmlhttp.abort();
		   closeLoadBar();
		   alert("Request timed out.<br>Check Internet Connection and try again.<br>If problem persist, switch to a newer browser.");
		}
	}
	catch(e){closeLoadBar();alert('Browser Error.<br>Please switch to a newer browser.');}
}
function formData(data){
	if(typeof data==='string'){
		var s1=data.replace(/&/g,'ampersandChar');
		var s2=s1.replace(/#/g,'hashChar');
		var s3=s2.replace(/%/g,'percentageChar');
		return s3;
	}
}
function doProcess(data){
  var returnPayload=JSON.parse(data);
  if(returnPayload.action=='showHtml'){
    getE('container').innerHTML=returnPayload.html;
    closeLoadBar();
  }
  if(returnPayload.action=='showPortalMessage'){
    getE('portalMessageBody').innerHTML=returnPayload.portal.message;
    closeLoadBar();
    getE('dialog').setAttribute('class','cover');
  }
  if(returnPayload.action=='showAlertAndHtml'){
    getE('container').innerHTML=returnPayload.html;
    closeLoadBar();
    alert(returnPayload.portal.message)
  }
  if(returnPayload.action=='showRegisterWarning'){
    getE('warning').innerHTML=returnPayload.portal.message;
    getE('regUserName').value='';
    getE('regPassword').value='';
    getE('repassword').value='';
    closeLoadBar();
  }
  if(returnPayload.action=='showLoginWarning'){
    getE('loginMessage').innerHTML=returnPayload.portal.message;
    getE('userName').value='';
    getE('password').value='';
    closeLoadBar();
  }
  if(returnPayload.action=='showApplicationForm'){
    getE('container').innerHTML=returnPayload.html;
    closeLoadBar();
    initialiseForm();
    fillSavedData(returnPayload.data);
  }
  if(returnPayload.action=='showSubmittedForm'){
    getE('container').innerHTML=returnPayload.html;
    closeLoadBar();
    getE('messageContent').innerHTML=returnPayload.data.message;
    getE('downloadLink').setAttribute('href',returnPayload.data.link);
    getE('messageLinks').setAttribute('class','visible');
  }
  if(returnPayload.action=='showAlert'){
    closeLoadBar();
    alert(returnPayload.portal.message);
  }
}

//----------------Alert Registration------------------------
function doSubscribe(){
    var chk=checkNo(getE('mobileNo'));
    if (chk=='OK'){
      var mobileNo=getE('mobileNo').value;
      var relationship=getE('relationship').value;
      showLoadBar('Registering....');
      var payload={'mobileNo':mobileNo,'relationship':relationship};
      xhr('alert',payload);
    }
}
function checkNo(obj){
    var state='False';
  var minValue=1000000000;
    var maxValue=9999999999;
	if(isNaN(obj.value)){alert('Mobile Number should be Numeric.');}
    else{
    if(obj.value>=minValue && obj.value<=maxValue){
      if(obj.value.indexOf('+')!==-1){alert('Mobile number should not contain a +.');}
      else{state='OK';}
    }
    else{alert('Mobile Number should be a valid 10 digit number.');}
    }
    return state;
}
//---------------Registration------------------------------
function showRegistrationForm(){
  showLoadBar('Please wait...');
  var payload={'registerName':'','registerPassword':''};
  xhr('register',payload);    
}
  
function callRegisterApplicant(){
  var registerName=getE('regUserName').value;
  var registerPassword=getE('regPassword').value;
  var repsw=getE('repassword').value;
  if((registerName=='')||(registerPassword=='')||(repsw=='')){registerError('User Name or Password cannot be blank.');return;}
  if(registerPassword != repsw){registerError('Passwords not matching.');return;}
  showLoadBar('Registering...');
  var payload={'registerName':formData(registerName),'registerPassword':formData(registerPassword)};
  xhr('register',payload);
}
  
function registerError(msg){    
  getE('warning').innerHTML=msg;
  getE('repassword').value='';
  return;
}

//----------------------Login---------------------------------
var un='';
var pswd='';
function callLogin(){
  un=formData(getE('userName').value);
  pswd=formData(getE('password').value);
  //Check if user name or password is blank
  if((un=='') || (pswd=='')){
    getE('loginMessage').innerHTML='User name or password cannot be blank.';      
  }
  else{
    showLoadBar('Logging.....');
    var payload={'loginName':un,'loginPassword':pswd};
    xhr('login',payload);
  }
}
//----------------------Application Data------------------------
function initialiseForm(){
  var d=new Date();
	var y=d.getFullYear();
	var selYear=document.getElementById('selYear');
	var op;
	for (var i=10;i<41;i++)
	{	op=document.createElement("option");
		var yyyy=y-i;
		op.value=yyyy;
		op.innerHTML=yyyy;
		selYear.appendChild(op);
	}
	var sel=document.getElementById('selSex');
	sel.value='';
	sel=document.getElementById('selDay');
	sel.value='';
	sel=document.getElementById('selMonth');
	sel.value='';
	sel=document.getElementById('selYear');
	sel.value='';
	sel=document.getElementById('selCategory');
	sel.value='';
	sel=document.getElementById('selDivision10');
	sel.value='';
	sel=document.getElementById('selDivision12');
	sel.value='';
	sel=document.getElementById('selFirstPreference');
	sel.value='';
	sel=document.getElementById('selSecondPreference');
	sel.value='';
	sel=document.getElementById('selThirdPreference');
	sel.value='';
	sel=document.getElementById('selDiscontinued');
	sel.value='';
}
function fillSavedData(data){
  //--------------Personal Information-------------------------------------
  getE('tbName').value=data.name;getE('tbFathersName').value=data.fathersName;getE('tbMothersName').value=data.mothersName;
  getE('selSex').value=data.sex;getE('selDay').value=data.dobDay;getE('selMonth').value=data.dobMonth;getE('selYear').value=data.dobYear;
  getE('tbNationality').value=data.nationality;getE('tbReligion').value=data.religion;getE('tbMotherTongue').value=data.motherTongue;
  getE('selCategory').value=data.category;
  //--------------Communication Details-------------------------------------
  getE('txPermanentAddress').value=data.permanentAddress;getE('txCommunicationAddress').value=data.communicationAddress;
  getE('tbPhoneNumber').value=data.phone;getE('tbMobileNumber').value=data.mobile;
  //--------------Other Personal Information--------------------------------
  getE('tbGuardian').value=data.localGuardianName;getE('tbGuardianRelationship').value=data.localGuardianRelationship;
  getE('txGuardianAddress').value=data.localGuardianAddress;getE('tbMaintenanceSource').value=data.source;
  getE('tbMaintenanceSource').value=data.source;getE('tbAnnualIncome').value=data.annualIncome;
  //---------------Academic Information-------------------------------------
       //---------------Examination Passed----------------------------
  getE('tbBoard10').value=data.board10;getE('tbInstitute10').value=data.institute10;
  getE('tbYearPassing10').value=data.year10;getE('selDivision10').value=data.division10;
  getE('txSubjects10').value=data.subjects10;
  getE('tbBoard12').value=data.board12;getE('tbInstitute12').value=data.institute12;
  getE('tbYearPassing12').value=data.year12;getE('selDivision12').value=data.division12;
  getE('txSubjects12').value=data.subjects12;
      //---------------Class 10 Marks--------------------------------
  getE('tbSubject101').value=data.subject101;getE('tbSubject102').value=data.subject102;getE('tbSubject103').value=data.subject103;
  getE('tbMarksMaths10').value=data.marksMaths10;getE('tbMarksScience10').value=data.marksScience10;getE('tbMarksEnglish10').value=data.marksEnglish10;
  getE('tbMarksSubject101').value=data.marksSubject101;getE('tbMarksSubject102').value=data.marksSubject102;getE('tbMarksSubject103').value=data.marksSubject103;
  getE('tbMarksSecured10').value=data.marksSecured10;getE('tbOutOf10').value=data.outOf10;calculatePercentage(10);
      //---------------Class 12 Marks--------------------------------
  getE('tbSubject121').value=data.subject121;getE('tbSubject122').value=data.subject122;getE('tbSubject123').value=data.subject123;
  getE('tbSubject124').value=data.subject124;getE('tbSubject125').value=data.subject125;getE('tbSubject126').value=data.subject126;
  getE('tbMarksSubject121').value=data.marksSubject121;getE('tbMarksSubject122').value=data.marksSubject122;getE('tbMarksSubject123').value=data.marksSubject123;
  getE('tbMarksSubject124').value=data.marksSubject124;getE('tbMarksSubject125').value=data.marksSubject125;getE('tbMarksSubject126').value=data.marksSubject126;
  getE('tbMarksSecured12').value=data.marksSecured12;getE('tbOutOf12').value=data.outOf12;calculatePercentage(12);
  //-------------------------Branch of Study-------------------------  
  getE('selFirstPreference').value=data.firstPreference;firstChoiceSelected();
  getE('selSecondPreference').value=data.secondPreference;secondChoiceSelected();// no need to load third choice as it is already done by secondChoiceSelected()
  //-------------------------Uncategorized----------------------------  
  getE('selDiscontinued').value=data.discontinued;getE('tbParentName').value=data.parentName;getE('txOfficeAndAddress').value=data.officeAndAddress;
  getE('tbGovtDeptt').value=data.govtDeptt;getE('tbPostHeld').value=data.postHeld;getE('tbSinceDate').value=data.sinceDate;
}
function getFilledData(){
  var data={};
  //--------------Personal Information-------------------------------------
  data.name=getE('tbName').value;data.fathersName=getE('tbFathersName').value;data.mothersName=getE('tbMothersName').value;
  data.sex=getE('selSex').value;data.dobDay=getE('selDay').value;data.dobMonth=getE('selMonth').value;data.dobYear=getE('selYear').value;
  data.nationality=getE('tbNationality').value;data.religion=getE('tbReligion').value;data.motherTongue=getE('tbMotherTongue').value;
  data.category=getE('selCategory').value;
  //--------------Communication Details-------------------------------------
  data.permanentAddress=getE('txPermanentAddress').value;data.communicationAddress=getE('txCommunicationAddress').value;
  data.phone=getE('tbPhoneNumber').value;data.mobile=getE('tbMobileNumber').value;
  //--------------Other Personal Information--------------------------------
  data.localGuardianName=getE('tbGuardian').value;data.localGuardianRelationship=getE('tbGuardianRelationship').value;
  data.localGuardianAddress=getE('txGuardianAddress').value;data.source=getE('tbMaintenanceSource').value;
  data.source=getE('tbMaintenanceSource').value;data.annualIncome=getE('tbAnnualIncome').value;
  //---------------Academic Information-------------------------------------
       //---------------Examination Passed----------------------------
  data.board10=getE('tbBoard10').value;data.institute10=getE('tbInstitute10').value;
  data.year10=getE('tbYearPassing10').value;data.division10=getE('selDivision10').value;
  data.subjects10=getE('txSubjects10').value;
  data.board12=getE('tbBoard12').value;data.institute12=getE('tbInstitute12').value;
  data.year12=getE('tbYearPassing12').value;data.division12=getE('selDivision12').value;
  data.subjects12=getE('txSubjects12').value;
      //---------------Class 10 Marks--------------------------------
  data.subject101=getE('tbSubject101').value;data.subject102=getE('tbSubject102').value;data.subject103=getE('tbSubject103').value;
  data.marksMaths10=getE('tbMarksMaths10').value;data.marksScience10=getE('tbMarksScience10').value;data.marksEnglish10=getE('tbMarksEnglish10').value;
  data.marksSubject101=getE('tbMarksSubject101').value;data.marksSubject102=getE('tbMarksSubject102').value;data.marksSubject103=getE('tbMarksSubject103').value;
  data.marksSecured10=getE('tbMarksSecured10').value;data.outOf10=getE('tbOutOf10').value;
      //---------------Class 12 Marks--------------------------------
  data.subject121=getE('tbSubject121').value;data.subject122=getE('tbSubject122').value;data.subject123=getE('tbSubject123').value;
  data.subject124=getE('tbSubject124').value;data.subject125=getE('tbSubject125').value;data.subject126=getE('tbSubject126').value;
  data.marksSubject121=getE('tbMarksSubject121').value;data.marksSubject122=getE('tbMarksSubject122').value;data.marksSubject123=getE('tbMarksSubject123').value;
  data.marksSubject124=getE('tbMarksSubject124').value;data.marksSubject125=getE('tbMarksSubject125').value;data.marksSubject126=getE('tbMarksSubject126').value;
  data.marksSecured12=getE('tbMarksSecured12').value;data.outOf12=getE('tbOutOf12').value;
  //-------------------------Branch of Study-------------------------  
  data.firstPreference=getE('selFirstPreference').value;
  data.secondPreference=getE('selSecondPreference').value;
  data.thirdPreference=getE('selThirdPreference').value;
  //-------------------------Uncategorized----------------------------  
  data.discontinued=getE('selDiscontinued').value;data.parentName=getE('tbParentName').value;data.officeAndAddress=getE('txOfficeAndAddress').value;
  data.govtDeptt=getE('tbGovtDeptt').value;data.postHeld=getE('tbPostHeld').value;data.sinceDate=getE('tbSinceDate').value;
  for(var key in data){data[key]=formData(data[key]);}
  return data;
}
function callSaveFilledData(){
  var objects=[];
  var data=getFilledData();
  data.submitDate='';
  data.status='DataEntry';
  objects.push(data);
  var user={};
  var usrObject=[];
  user.userName=un;
  user.password=pswd;
  showLoadBar('Saving...');
  var payload={'objects':objects,'userObj':user};
  xhr('save',payload);
}
function callSubmitFilledData(){
  var txt="Once you submit the Form, you will not be able to Edit again.<br>Make sure you have entered everything correctly before pressing OK button.";
  jpConfirm(txt,'confirmOK()','confirmCancel()');
}
function showApplicationForm(){
    getE('formApplication').setAttribute('class','visible');
    getE('formFAQ').setAttribute('class','hidden');
}
function showFAQForm(){
    getE('formApplication').setAttribute('class','hidden');
    getE('formFAQ').setAttribute('class','visible');
}
function confirmOK(){
    closeAlert();
    var objects=[];
    var data=getFilledData();
    //------Check if all Mandatory fields are filled----------
    var status=statusMandatoryFields();
    if (status=='OK'){
      showLoadBar("Submitting your data.....");
      objects.push(data);
      var user={};
      user.userName=un;
      user.password=pswd;
      var payload={'objects':objects,'userObj':user};
      xhr('submit',payload);
      }else
    {
      alert(status);
    }
}
function confirmCancel(){
    closeAlert();
}
function populateYear(){  
  var d=new Date();
	var y=d.getFullYear();
	var selYear=document.getElementById('selYear');
	var op;
	for (var i=10;i<41;i++)
	{	op=document.createElement("option");
		var yyyy=y-i;
		op.value=yyyy;
		op.innerHTML=yyyy;
		selYear.appendChild(op);
	}
}
function firstChoiceSelected(){
  var obj=getE('selFirstPreference');
	var op1=getE('secondPreferenceChoice1');
	var op2=getE('secondPreferenceChoice2');
	var op=getE('thirdPreferenceChoice');
	if (obj.value=='AE')
	{
		op1.value='AA';
		op1.innerHTML="Architectural Assistantship";
		op2.value='CDGT';
		op2.innerHTML="Costume Design & Garment Technology";
		secondChoiceSelected();
	}
	if (obj.value=='AA')
	{
		op1.value='AE';
		op1.innerHTML="Automobile Engineering";
		op2.value='CDGT';
		op2.innerHTML="Costume Design & Garment Technology";
		secondChoiceSelected();
	}
	if (obj.value=='CDGT')
	{
		op1.value='AA';
		op1.innerHTML="Architectural Assistantship";
		op2.value='AE';
		op2.innerHTML="Automobile Engineering";
		secondChoiceSelected();
	}
}

function secondChoiceSelected(){
	var obj=getE('selSecondPreference');
	var op=getE('thirdPreferenceChoice');
	var op1=getE('secondPreferenceChoice1');
	var op2=getE('secondPreferenceChoice2');
	if(obj.value==op1.value)
	{
		op.value=op2.value;
		op.innerHTML=op2.innerHTML;
	}
	else{
		op.value=op1.value;
		op.innerHTML=op1.innerHTML;
	}
}

function calculatePercentage(exam){
	var marks;
	var total;
	var percent;
	if (exam==10){
		marks=document.getElementById("tbMarksSecured10").value;
		total=document.getElementById("tbOutOf10").value
		percent=document.getElementById("tbPercentage10")
	}
	if (exam==12){
		marks=document.getElementById("tbMarksSecured12").value;
		total=document.getElementById("tbOutOf12").value
		percent=document.getElementById("tbPercentage12")
	}
	var pc=marks*100/total;
	if ((pc=="Infinity")||(pc=="0")||(isNaN(pc))){
		percent.style.color="Red";
		percent.style.fontWeight="bold";
	}
	else{
		percent.style.color="Black";
		percent.style.fontWeight="normal";
	}
	percent.innerHTML=formatNumber(pc,2);
}
function statusMandatoryFields(){
 var status='You have not entered the following mandatory field(s):<br>'; 
 var n=0;
 if (getE('tbName').value==''){
   n+=1;
   status+=n+".  Name.<br>";
 }  
 if (getE('tbFathersName').value==''){
   n+=1;
   status+=n+".  Father's Name.<br>";
 }  
 if (getE('tbMothersName').value==''){
   n+=1;
   status+=n+".  Mother's Name.<br>";
 }  
 if (getE('selSex').value==''){
   n+=1;
   status+=n+".  Sex.<br>";
 }  
 if (getE('selDay').value==''||getE('selMonth').value==''||getE('selYear').value==''){
   n+=1;
   status+=n+".  Date of Birth.<br>";
 } 
 else{
   var yyyy=getE('selYear').value;
   var mm=getE('selMonth').value;
   var dd=getE('selDay').value;
   var date= dd+"/"+mm+"/"+yyyy;
   if (!isValidDate(date)){  
     n+=1;
     status+= n+".  Invalid Date of Birth. - "+ dd +"/" + mm + "/" + yyyy + "<br>";        
   }
 }
 if (getE('selCategory').value==''){
   n+=1;
   status+=n+".  Category.<br>";
 }  
 if (getE('txCommunicationAddress').value==''){
   n+=1;
   status+=n+".  Communication Address.<br>";
 }  
 if (getE('tbMobileNumber').value==''){
   n+=1;
   status+=n+".  Mobile Number.<br>";
 }  
 if (getE('tbAnnualIncome').value==''){
   n+=1;
   status+=n+".  Annual Income.<br>";
 }  
 if (getE('tbBoard10').value==''||getE('tbInstitute10').value==''||getE('tbYearPassing10').value==''||getE('selDivision10').value==''||getE('txSubjects10').value==''){
   n+=1;
   status+=n+".  HSLC/SSLC/10+ Examination.<br>";
 }  
 if (getE('tbMarksMaths10').value==''||getE('tbMarksScience10').value==''||getE('tbMarksEnglish10').value==''||getE('tbMarksSecured10').value==''||getE('tbOutOf10').value==''){
   n+=1;
   status+=n+".  HSLC/SSLC/10+ Marks.<br>";
 }  
 if (getE('selFirstPreference').value==''){
   n+=1;
   status+=n+".  Preferences.<br>";
 }  
 if (getE('selDiscontinued').value==''){
   n+=1;
   status+=n+".  Whether you have discontinued studies.";
 }
 if (status=='You have not entered the following mandatory field(s):<br>'){
   status='OK'
 }
 return status;
}

//---------------------UTIL------------------------------------
function formatNumber(num,precision){
  var fNum;
	var intNum;
	var decNum;
	var expNum;
	var posExponent=String(num).indexOf("e");
	if (posExponent>-1){
		var x=String(num).split("e");
		fNum=parseFloat(x[0]);
		expNum=x[1];
	}
	else{
		fNum=parseFloat(num);
	}
	var lenNum=String(fNum).length;
	var posDecimal=String(fNum).indexOf(".");
	var p;
	switch(posDecimal){
		case -1:
			intNum=fNum;
			decNum=0;
		break;
		default:
			var n=String(fNum).split(".");
			if (n[0]=="0"){
				intNum=n[0];
				p=parseInt(precision,10);
				if(n[1].length>=p){
					decNum=n[1].substr(0,p)
					while((parseInt(n[1].substr(0,p))==0) && (p<n[1].length+1)){
						p+=1;
						decNum=n[1].substr(0,p);
					}
				}
				else{
					decNum=n[1];
				}
			}
			else{
				p=parseInt(precision,10);
				intNum=n[0];
				decNum=n[1].substr(0,p);
			}
	}
	return parseFloat(intNum+"."+decNum+"e"+expNum);
}
function getE(id){
  return document.getElementById(id);
}
function createE(id){
    return document.createElement(id);
}
//==========================================VALIDATION FUNCTION==============================================
function isNonNumericCode(obj,key,booSigned,booDecimal){
  var keycode=key.keyCode;
	var shift =key.shiftKey;
	if (!shift){
		if(keycode==32){return false;}
		if (keycode > 64 && keycode < 91){return false}//alphabet a to z from 65 to 90
		if (keycode > 185 && keycode < 189){return false}//; = , from 186 to 188
		if (keycode > 190 && keycode < 223){return false}// / (\)' from 191 to 222
		if (keycode == 106 || keycode == 111){return false}// numpad multipy and divide
		if(keycode==189 || keycode==107||keycode==109){
			if(booSigned){
				if(obj.value.length==1){return true;}
				else{return false;}
			}
			else{return false;}
		}
		if (keycode==110 ||keycode==190) {//decimal and period
			if (booDecimal){
				var num=obj.value.toString();
				var cnt=num.split('.');
				if (cnt.length==2){return true;}
				else{return false;}
			}
			else{return false;}
		}
	}else{
		if(booSigned && (keycode==187)){
			if(obj.value.length==1){return true;}
			else{return false;}
		}else{return false;}
	}
	return true;
}

function validateNumber(obj,key){
	if(!isNonNumericCode(obj,key,false,true)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateInteger(obj,key){
	if(!isNonNumericCode(obj,key,false,false)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateSignedNumber(obj,key){
	if(!isNonNumericCode(obj,key,true,true)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateSignedInteger(obj,key){
	if(!isNonNumericCode(obj,key,true,false)){obj.value=obj.value.substring(0,obj.value.length-1);}
}

function validateNumberAndRange(obj,key,minValue,maxValue){
	//### validates positive number where the min value is from 0 to 9 ######

	//check pressed keycodes
	if(!isNonNumericCode(obj,key,false,true)){obj.value=obj.value.substring(0,obj.value.length-1);}

	if (obj.value<minValue){
		obj.value="";
		alert("Number should be at least "+minValue);
	}
	if (obj.value>maxValue){
		obj.value=obj.value.substring(0,obj.value.length-1);
		alert("Number should be at most "+maxValue);
	}
}

function validateMobileNumber(obj){
    var minValue=1000000000;
    var maxValue=9999999999;
    if(isNaN(obj.value)){alert('Mobile Number should be Numeric.');obj.value='';}
    else{
    	if(obj.value>=minValue && obj.value<=maxValue){
        	if(obj.value.indexOf('+')!==-1){alert('Mobile number should not contain a +.');obj.value='';}
		if (obj.value.indexOf('0')==0){alert('Mobile number should not start with 0.');obj.value='';}
      	}
    	else{alert('Mobile Number should be a valid 10 digit number.');obj.value='';}
    }
}

function validateDate(obj){
  if(isValidDate(obj.value)==false){obj.value='';alert('Invalid Date');obj.value='';}
}

function isValidDate(inputText){  
	var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; 
   	// Match the date format through regular expression 
        if(inputText.match(dateformat)){ 
            var opera1 = inputText.split('/');  
            var opera2 = inputText.split('-');  
            var lopera1 = opera1.length;  
            var lopera2 = opera2.length;  
            // Extract the string into month, date and year  
            if (lopera1>1){var pdate = inputText.split('/');}  
            else if (lopera2>1){var pdate = inputText.split('-');}  
            var dd = parseInt(pdate[0]);  
            var mm  = parseInt(pdate[1]);  
            var yy = parseInt(pdate[2]);  
            // Create list of days of a month [assume there is no leap year by default]  
            var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];  
            if (mm==1 || mm>2)  
            {  
                if (dd>ListofDays[mm-1])  
                    {   
                    return false;  
                    }  
            }  
            if (mm==2)  
            {  
                var lyear = false;  
                if ( (!(yy % 4) && yy % 100) || !(yy % 400))   
                {  
                    lyear = true;  
                }  
                if ((lyear==false) && (dd>=29))  
                {   
                return false;  
                }  
                if ((lyear==true) && (dd>29))  
                {    
                    return false;  
                }  
            }  
            return true
        }  
        else  
        {  
            return false;  
	}  
}
//===================================END VALIDATION FUNCTION==============================================
//===================LOADBAR ALERT CONFIRM Functions========================================================================

function showLoadBar(text){
  getE('loader').setAttribute('class','cover');
  getE('spinnerText').innerHTML=text;
  getE('dialog').setAttribute('class','hidden');
}

function closeLoadBar(){
  getE('loader').setAttribute('class','hidden');
  getE('container').setAttribute('class','container');
  getE('dialog').setAttribute('class','hidden');
}

//---global variables----

  //var screenOffsetX;
  //var screenOffsetY;
  
function alert(displayText,title){
  if (arguments.length==2){
    showAlert(displayText,title);
  }
  else{
    showAlert(displayText,"Message:");
  }
}

function jpConfirm(displayText,functionOK,functionCancel){
  
    showAlert(displayText,"Important!",functionOK,functionCancel);
}

function showAlert(displayText,title,functionOK,functionCancel){
  try{
      //screenOffsetX=window.pageXOffset;
      //screenOffsetY=window.pageYOffset;
      //getE('bodyContainer').style.display='none';
      var cover=createE('div');
      cover.setAttribute('id','cover');
      cover.setAttribute('class','cover');
      
      var alertBox=createE('div');
      alertBox.setAttribute('id','jpAlertWindowV1');
      alertBox.setAttribute('class','MessageBox');

    
      var alertTitle=createE('div');
      alertTitle.setAttribute('class','MessageTitle');

      alertTitle.innerHTML=title;
      
      var alertBody=createE('div');
      alertBody.setAttribute('class','MessageBody');
      alertBody.innerHTML=displayText;

    
      var alertFooter=createE('div');
      alertFooter.setAttribute('class','MessageFooter');

      if (arguments.length==4){
        var btn=createE('input');
        btn.type='button';
        btn.value="OK";
        //btn.addEventListener();
        btn.setAttribute('onclick','return '+functionOK);
        alertFooter.appendChild(btn);

        var btnC=createE('input');
        btnC.type='button';
        btnC.value="Cancel";
        btnC.setAttribute('onclick','return '+functionCancel);
        alertFooter.appendChild(btnC);
      }
      else{      
        var btn=createE('input');
        btn.type='button';
        btn.value="OK";
        btn.setAttribute('onclick','return closeAlert()');
        alertFooter.appendChild(btn);
      }
      
      alertBox.appendChild(alertTitle);
      alertBox.appendChild(alertBody);
      alertBox.appendChild(alertFooter);
      cover.appendChild(alertBox);
      document.body.appendChild(cover);
    }
    catch(e){
        window.alert(displayText);
    }
  }
  
  function closeAlert(){
      var cover=getE('cover');
      document.body.removeChild(cover);
      //getE('bodyContainer').style.display='block';  
      //window.scrollBy(screenOffsetX,screenOffsetY);
}

  
  function closeConfirm(){
      closeAlert();
  }

//===================END LOADBAR ALERT CONFIRM Functions========================================================================
