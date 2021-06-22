//IRSA:LICENSES/MARIJUANA/*/*
/*
Title : Auto schedule inspections based on inspection result and original schedule date (InspectionResultSubmitAfter) 
Purpose : check if specific inspection type, with specific result - reschedule same inspection, original scheduled date + n
Author: Erich von Trapp
Functional Area : Records

Note: "_" defines script internal functions and variables. 
*/

var vCapType;

if (appMatch("Licenses/Marijuana/*/Application")) {
	vCapType = "Application";
} else if (appMatch("Licenses/Marijuana/*/License")) {
	vCapType = "License";
} else {
	vCapType = null;
}
logDebug("vCapType: " + vCapType);

//check for failed MJ inspections
_failedMJInspectionAutomation(vCapType); 	

//check for passed MJ inspections
//passedMJInspectionAutomation(vCapType); 
_passedMJInspectionEmailNotification(vCapType);

//check for extension requests on MJ inspections
requestExtensionMJInspection(vCapType);

/*######################
Internal functions
########################*/
function _failedMJInspectionAutomation(vCapType){
	var daysToAdd;
	var inspDate = inspObj.getInspectionDate().getMonth() + "/" + inspObj.getInspectionDate().getDayOfMonth() + "/" + inspObj.getInspectionDate().getYear();
	
	//define number of days to schedule next inspection
	if (vCapType == "Application"){
		daysToAdd = 1;
	} else {
		daysToAdd = 7;
	}
	
	if (inspResult == "Failed") {
		var vInspector = getInspectorByInspID(inspId, capId);
		var vInspType = inspType;
		var vInspStatus = "Scheduled";
		//schedule new inspection daysToAdd number of days from inspection result date
		logDebug("Days to add: " + daysToAdd);
		var newInspSchedDate = dateAddHC3(inspDate, daysToAdd, "Y");
		scheduleInspectDate(vInspType, newInspSchedDate);
		
		//get sequence ID for most recently created inspection
		var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
		if (lastInspectionObj == null) {
			logDebug("Failed to find most recent inspection of type " + vInspType);
			//continue;
		}
		
		var lastInspectionSeq = lastInspectionObj.getIdNumber();
		
		//assign inspection to inspector
		assignInspection(lastInspectionSeq, vInspector);
		
		//copy checklist items from failed inspection to the new inspection
		copyGuideSheetItemsByStatus(inspId, lastInspectionSeq);
	
		//email params
		var emailTemplate = "LIC MJ INSPECTION CORRECTION REPORT # 231";
		var inspResultComment = inspObj.getInspection().getResultComment();
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

		var asiValues = new Array();
		loadAppSpecific(asiValues); 

		var lastIndex = inspType.lastIndexOf(" Inspection");
		var inspTypeSub = inspType.substring(0, lastIndex);

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		var tradeName = getAppName(capId);
		if (inspId) {
			addParameter(eParams, "$$inspId$$", inspId);
		}
		if (inspResult)
			addParameter(eParams, "$$inspResult$$", inspResult);
		if (inspResultDate)
			addParameter(eParams, "$$inspResultDate$$", inspResultDate);
		if (inspGroup)
			addParameter(eParams, "$$inspGroup$$", inspGroup);
		if (inspType)
			addParameter(eParams, "$$inspType$$", inspType);
		if (inspSchedDate)
			addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
		if (inspTypeSub)
			addParameter(eParams, "$$inspTypeSub$$", inspTypeSub.toUpperCase());
		if (inspResultComment)
			addParameter(eParams, "$$inspResultComment$$", inspResultComment);
		if (primaryAddress)
			addParameter(eParams, "$$FullAddress$$", primaryAddress);
		if (asiValues["State License Number"])
			addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		/*if (asiValues["Trade Name"])
			addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);*/
		if (tradeName)
			addParameter(eParams, "$$TradeName$$", tradeName);
		
		//Get ACA Url
		acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
		acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
		addParameter(eParams, "$$acaDocDownloadUrl$$", acaURL);
		logDebug("eParams: " + eParams);
		var reportTemplate = "MJ_Compliance_Corrections_Letter";
		var reportParams = aa.util.newHashtable();
		addParameter(reportParams, "InspActNumber", inspId);
		var inspectionEmail = "";
		if (vInspector == "jbeuthel") {
			inspectionEmail = "rprovinc@auroragov.org"
		} else {
			inspectionEmail = vInspector + "auroragov.org";
		}
		logDebug ("Inspection Email: " + inspectionEmail);
        var emails = _getContactEmailNoDupEmail(capId,"Inspection Contact");
		emails = emails.join(";");
		logDebug("Email send to: " + emails)
		var reportFiles = new Array();
        var report = _generateReportFile(reportTemplate, reportParams, aa.getServiceProviderCode());
		reportFiles.push(report);
        _sendNotification("noreply@auroragov.org", emails, inspectionEmail, emailTemplate, eParams, reportFiles);
	}

}

function _passedMJInspectionEmailNotification(vCapType){
	
	if ((inspResult == "Passed" || inspResult == "Passed - Minor Violations") && (!(vCapType.equals("License") && inspType.indexOf("MJ Building Inspections") != -1)) ) {
		var emailTemplate = "LIC MJ COMPLIANCE #232";
		var inspResultComment = inspObj.getInspection().getResultComment();
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

		var asiValues = new Array();
		loadAppSpecific(asiValues); 

		var lastIndex = inspType.lastIndexOf(" Inspection");
		var inspTypeSub = inspType.substring(0, lastIndex);

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		var tradeName = getAppName(capId);
		if (inspId) {
			addParameter(eParams, "$$inspId$$", inspId);
		}
		if (inspResult)
			addParameter(eParams, "$$inspResult$$", inspResult);
		if (inspResultDate)
			addParameter(eParams, "$$inspResultDate$$", inspResultDate);
		if (inspGroup)
			addParameter(eParams, "$$inspGroup$$", inspGroup);
		if (inspType)
			addParameter(eParams, "$$inspType$$", inspType);
		if (inspSchedDate)
			addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
		if (inspTypeSub)
			addParameter(eParams, "$$inspTypeSub$$", inspTypeSub.toUpperCase());
		if (inspResultComment)
			addParameter(eParams, "$$inspResultComment$$", inspResultComment);
		if (primaryAddress)
			addParameter(eParams, "$$FullAddress$$", primaryAddress);
		if (asiValues["State License Number"])
			addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		/*if (asiValues["Trade Name"])
			addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);*/
		if (tradeName)
			addParameter(eParams, "$$TradeName$$", tradeName);
		//Get ACA Url
		acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
		acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
		addParameter(eParams, "$$acaDocDownloadUrl$$", acaURL);
		 logDebug("eParams: " + eParams);
		var reportTemplate = "MJ_Compliance_Corrections_Letter";
		var reportParams = aa.util.newHashtable();
		addParameter(reportParams, "InspActNumber", inspId);
		inspectionEmail = "";
		if (vInspector == "jbeuthel") {
			inspectionEmail = "rprovinc@auroragov.org"
		} else {
			inspectionEmail = vInspector + "auroragov.org";
		}
		logDebug ("Inspection Email: " + inspectionEmail);
		//send email with report attachment     
        var emails = _getContactEmailNoDupEmail(capId,"Inspection Contact");
		emails = emails.join(";");
		logDebug("Email send to: " + emails)
		var reportFiles = new Array();
        var report = _generateReportFile(reportTemplate, reportParams, aa.getServiceProviderCode());
		reportFiles.push(report);
        _sendNotification("noreply@auroragov.org", emails, inspectionEmail, emailTemplate, eParams, reportFiles);
	}

}

function _generateReportFile(aaReportName,parameters,rModule) 
{
    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();


    report.setModule(rModule);
    report.setCapId(capId);
    report.setReportParameters(parameters);
    //Added
    vAltId = capId.getCustomID();
    report.getEDMSEntityIdModel().setAltId(vAltId);
    var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
    logDebug("Report successfully ran: "+permit.getOutput().booleanValue());
    if(permit.getOutput().booleanValue()) 
    {
        var reportResult = aa.reportManager.getReportResult(report);

        if(reportResult) 
        {
            reportResult = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportResult);
            //logDebug("Report Result: "+ reportResult);
            reportFile = reportFile.getOutput();
			logDebug("Report Result: "+ reportFile);
            return reportFile
        } else 
        {
            logDebug("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else 
    {
        logDebug("No permission to report: "+ reportName + " for Admin" + systemUserObj);
        return false; 
    }
}

function _getContactEmailNoDupEmail(vcapId, vconType){
	var thisItem = arguments[0];
	var searchConType = arguments[1];
	var conEmailArray = [];
	var vConObjArry;
	if(searchConType.toUpperCase()=="ALL"){
		vConObjArry = getContactObjsByCap(thisItem);
	}else{
		vConObjArry = getContactObjsByCap(thisItem,searchConType);
	}
	//return valid email addressses and only one address for multiple contacts with same email
	for(eachCont in vConObjArry){
		var vConObj = vConObjArry[eachCont];
		//Get contact email
		if (vConObj) {
			var conEmail = vConObj.people.getEmail();	
			var conType = vConObj.people.getContactType();
			if (conEmail && conEmail != null && conEmail != "" && conEmail.indexOf("@") > 0) {
				if(!exists(conEmail,conEmailArray) ){
					conEmailArray.push(conEmail);
					logDebug("Returning email for :" + conType )
					logDebug('Email: ' + conEmail)
					
				}
				
			}
		}
	}
	return conEmailArray;
	
}
 
function _sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)
{
	var capIDScriptModel = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
	var result = null;
	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
	if(result.getSuccess())
	{
		logDebug("Sent email successfully!");
		return true;
	}
	else
	{
		logDebug("Failed to send mail. - " + result.getErrorType());
		var itemCap = capId;
	
		var id1 = itemCap.ID1;
		var id2 = itemCap.ID2;
		var id3 = itemCap.ID3;
		var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
		result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
		if(result.getSuccess())
		{
			logDebug("2nd Attempt... Sent email successfully!");
			return true;
		}
		else
		{
			logDebug("2nd Attempt Failed to send mail. - " + result.getErrorType());
			return false;
		}
	}
}
 

