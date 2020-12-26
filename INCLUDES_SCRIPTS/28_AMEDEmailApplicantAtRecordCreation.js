//28_AMEDEmailApplicantAtRecordCreation
//written by JMAIN
//Email the MJ Applicant on application submission

//get a couple ASI fields
/*
var preappdate = getAppSpecific("Pre Application Meeting Date") + ""; //force string
var preapptime = getAppSpecific("Pre Application Meeting Time") + ""; //force string

logDebug(preappdate);
logDebug(preapptime);

//what contact types should get an email - comma delimited string of contact types
var allowedcontacttypes = "Applicant";
	
//send email to all contacts with the apropriate template and report
var emailtemplate = "JD_TEST_TEMPLATE";

//populate the email parameters not already included for "free" - must examine the template to know
var joke = "Not a joke but the preapp date and time: " + preappdate + " - " + preapptime;
var emailparams = aa.util.newHashtable();
emailparams.put("$$Joke$$", joke);

//call Emmett's emailContacts function - this runs asynchronously - puts "deep link" to report in email
emailContacts(allowedcontacttypes, emailtemplate, emailparams, "", "", "N", "");

logDebug("Did it work?");
*/

var emailTemplate= "MJ APPLICATION SUBMITTAL";
	var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    var recordDeepUrl = getACARecordURL(acaURLDefault);
   	var asiValues = new Array();
	loadAppSpecific(asiValues);
  
	var files = new Array();
	
	// use the correct parameters related to the email template provided + wfComment
	var adResult = aa.address.getAddressByCapId(capId).getOutput(); 
			for(x in adResult)
			{
				var adType = adResult[x].getAddressType(); 
				var stNum = adResult[x].getHouseNumberStart();
				var preDir =adResult[x].getStreetDirection();
				var stName = adResult[x].getStreetName(); 
				var stType = adResult[x].getStreetSuffix();
				var city = adResult[x].getCity();
				var state = adResult[x].getState();
				var zip = adResult[x].getZip();
			}
	
	var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
	var appName = cap.getSpecialText();
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear(); 
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$todayDate$$",thisDate );
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$acaRecordUrl$$", recordDeepUrl);
	addParameter(eParams, "$$FullAddress$$", primaryAddress);
	addParameter(eParams, "$$ApplicationName$$", appName);
	addParameter(eParams, "$$TradeName$$", appName);
   //addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
   addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
   var emailTo = _getAllContactsEmailsNoDupEmail();
   logDebug("email to: " + emailTo);
   logDebug(eParams)
   if(emailTo.length>0){
	//send email to applicant, no report included
	//emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplate, eParams, "", "", "N", "");
	sendNotification("noreply@auroragov.org", emailTo.join(";"), "", emailTemplate, eParams, null);
   }


//function
function _getAllContactsEmailsNoDupEmail(){
	var conEmailArray = [];
	var vConObjArry = getContactObjsByCap(capId);
	for(eachCont in vConObjArry){
		var vConObj = vConObjArry[eachCont];
		//Get contact email
		if (vConObj) {
			var conEmail = vConObj.people.getEmail();
			var conType = vConObj.people.getContactType();
			if(conType!="Inspection Contact"){
				if (conEmail && conEmail != null && conEmail != "" ) {
					if(!exists(conEmail,conEmailArray) && conEmail.indexOf("@") > 0){
						conEmailArray.push(conEmail);
					}
					
				}
			}
		}
	}
	return conEmailArray;
	
}