/*
Title : Auto schedule inspections based on inspection result and original schedule date (InspectionResultSubmitAfter) 
Purpose : check if specific inspection type, with specific result - reschedule same inspection, original scheduled date + n
Author: Erich von Trapp
Functional Area : Records
*/

var vCapType;

if (appMatch("Licenses/Marijuana/*/Application")) {
	vCapType = "Application";
} else if (appMatch("Licenses/Marijuana/*/License")) {
	vCapType = "License";
} else {
	vCapType = null;
}

//check for failed MJ inspections
//SW Commented - Since the same function is getting
// triggered via IRSA;Licenses!Marijuana!~!~.js
//failedMJInspectionAutomation(vCapType);	

//check for passed MJ inspections
//passedMJInspectionAutomation(); //tries to send email to inspection contacts (contact doesn't exist on record)
passedMJInspectionEmailNotification();

//check for extension requests on MJ inspections
requestExtensionMJInspection(vCapType);


//SW ID 430
include("430_allInspectionsResulted");



/*######################
Internal functions
########################*/
function passedMJInspectionEmailNotification(){
	if (inspResult == "Passed" || inspResult == "Passed - Minor Violations") {
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
		if (asiValues["Trade Name"])
			addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		
		//Get ACA Url
		acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
		acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
		addParameter(eParams, "$$acaDocDownloadUrl$$", acaURL);
		   
		var reportTemplate = "MJ_Compliance_Corrections_Letter";
		var reportParams = aa.util.newHashtable();
		addParameter(reportParams, "InspActNumber", inspId);
		
		//send email with report attachment     
        var recordApplicant = getContactByType("Applicant", capId);
        var emailA = recordApplicant.getEmail();
        var recordRP = getContactByType("Responsible Party", capId);
        var emailRP = recordRP.getEmail();
        var emails = emailA +","+emailRP;

        var report = generateReportFile(reportTemplate, reportParams, aa.getServiceProviderCode());
        sendNotification("noreply@aurora.gov", emails, "", emailTemplate, eParams, [report]);
	}

}


function generateReportFile(aaReportName,parameters,rModule) 
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
    aa.print("---"+permit.getOutput().booleanValue());
    if(permit.getOutput().booleanValue()) 
    {
        var reportResult = aa.reportManager.getReportResult(report);

        if(reportResult) 
        {
            reportResult = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportResult);
            logMessage("Report Result: "+ reportResult);
            reportFile = reportFile.getOutput();
            return reportFile
        } else 
        {
            logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else 
    {
        logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
        return false; 
    }
}