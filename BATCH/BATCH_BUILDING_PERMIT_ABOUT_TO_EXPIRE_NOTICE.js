/*------------------------------------------------------------------------------------------------------/
| Program		: BATCH_BUILDING_PERMIT_ABOUT_TO_EXPIRE_NOTICE.js
| Event			: 
|
| Usage			:Building/Permit : About to Expire Notice 	    
| Notes			:Record types does not have "Permit Expiration Date" Custom field
|				example: "Building/Permit/Master/NA","Building/Permit/Master/Amendment","Building/Permit/No Plans/Amendment"
|				*************************************************
|				excluded records with statues (Withdrawn,Expired,Complete,Unapproved) 
|				*************************************************
|				Temporary EmailTemplate is used "MESSAGE_NOTICE_LICENSE_EXPIRED" ,
|			    this must be replaced with the correct template name , the correct params must be used instead of the existing in function sendEmailNotification
| Created by	: ISRAA
| Created at	: 30/01/2018 16:08:35
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

try{
	var afterThirtyDays=dateAdd(null,30);
	useAppSpecificGroupName=false;
	var capListResult = aa.cap.getByAppType("Building", "Permit", null,null);
	var capList = capListResult.getOutput();
	var emailTemplate="BLD ABOUT TO EXPIRE #5";
	for (xx in capList) {
		var capId = capList[xx].getCapID();
		logDebug("ALT ID is : "+ capId.getCustomID());
	    // if permit already expired or closed or rejected then no need to check the expiration date
		if( capList[xx].getCapStatus()=="Expired" ||  capList[xx].getCapStatus()=="Withdrawn" || capList[xx].getCapStatus()=="Complete" || capList[xx].getCapStatus()=="Unapproved") continue;
		var permitExpDate=getAppSpecific('Permit Expiration Date',capId);
		logDebug("Expiration Date is : " + permitExpDate);
		if (typeof(permitExpDate)!= "undefined" && permitExpDate!=null){
			if (dateDiff(permitExpDate,afterThirtyDays) < 30){
					sendEmailNotification(capId,emailTemplate);
			}
		}
	}
}
catch (err){
	logDebug("error : stopped batch processing BATCH_BUILDING_PERMIT_ABOUT_TO_EXPIRE_NOTICE" + err);
}

function sendEmailNotification(itemCapId,emailTemplate){
	var recordApplicant = getContactByType("Applicant", itemCapId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
				logDebug("**WARN no applicant or applicant has no email, capId=" + itemCapId);
	} else {
		applicantEmail = recordApplicant.getEmail();
		var files = new Array();
		var eParams = aa.util.newHashtable();
		//addParameter(eParams, "$$altID$$", itemCapId.getCustomID());
		var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	}//applicant OK
}
