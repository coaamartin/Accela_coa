//Start - 224 MJ Retail License Creation/Update Script 

if (wfTask == "License Issuance" && wfStatus == "Issued") {
	var vParentArry;
	var vLicenseID;
	var tmpCap;
	var vParentLicType;
	var vParentLicTypeString;
	var vLicenseObj;
	var vExpDate;
	var vExpDateString;
	var vLicExp_mm;
	var vLicExp_dd;
	var vLicExp_yyyy
	var vToday;
	var vToday_mm;
	var vToday_dd;
	var vToday_yyyy;
	var vTodayString;
	var vDateAddString;
	var vDateDiff;
	var vEndOfMonth;
	var vGoLive;

	//If the current record is an application record and the parent license
	//record does not exist or the current record is a renewal record and
	//the parent license does exist then update the license records info
	if (appTypeArray[3] == "Application" && (vParentArry == null || vParentArry == "")) {
		//Copy Parcels from child to license
		copyParcels(capId, vLicenseID);

		//Copy addresses from child to license
		copyAddress(capId, vLicenseID);

		//Copy ASI from child to license
		copyASIInfo(capId, vLicenseID);

		//Copy ASIT from child to license
		copyASITables(capId, vLicenseID);

		//Copy Contacts from child to license
		copyContacts3_0(capId, vLicenseID);

		//Copy Work Description from child to license
		aa.cap.copyCapWorkDesInfo(capId, vLicenseID);

		//Copy application name from child to license
		editAppName(getAppName(capId), vLicenseID);

		//Update License Workflow
		tmpCap = capId;
		capId = vLicenseID;
		updateTask("License Status", "Active", "Updated by Script 224_CreateMJRetailLicense", "Update by Script 224_CreateMJRetailLicense");
		capId = tmpCap;

		//Generate license report and email
		var vEmailTemplate;
		var vReportTemplate;

		if (appMatch("Licenses/Marijuana/Retail Store/License", vLicenseID)&& (wfStatus == "Issued")) {
				vEmailTemplate = "LIC MJ APPROVAL OF LICENSE #226 - 230";
				vReportTemplate = "MJ_License";
			    scheduleInspection ("MJ AMED Inspection",77, "SLCLARK"," ", "Scheduled by Script 224");
				scheduleInspection ("MJ Building Inspections - Plumbing",77, "SLCLARK", " ", "Scheduled by Script 224");
				scheduleInspection ("MJ Building Inspections - Electrical",77, "SLCLARK"," ", "Scheduled by Script 224"); 
				scheduleInspection ("MJ Building Inspections - Mechanical",77, "SLCLARK"," ", "Scheduled by Script 224");
				scheduleInspection ("MJ Building Inspections - Life Safety",77, "SLCLARK"," ", "Scheduled by Script 224"); 
				scheduleInspection ("MJ Security Inspections - 3rd Party",77, "SLCLARK"," ", "Scheduled by Script 224");
				scheduleInspection ("MJ Building Inspections - Structural",77, "SLCLARK"," ", "Scheduled by Script 224"); 				
		}
		
		//are these the parameters used in the email or report?  
		var vEParams = aa.util.newHashtable();
		addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
		addParameter(vEParams, "$$ExpirationDate$$", vLicenseObj.b1ExpDate);
		addParameter(vEParams, "$$ApplicationID$$", vLicenseID.getCustomID());
		//addParameter(vEParams, "$$Record_ID$$", vLicenseID.getCustomID);
			
		var vRParams = aa.util.newHashtable();
		addParameter(vRParams, "p1Value", vLicenseID.getCustomID());

		//does $$acadocdownloadurl$$ need to be added here?
		tmpCap = capId;
		capId = vLicenseID;
		emailContacts("All", vEmailTemplate, vEParams, vReportTemplate, vRParams);
		capId = tmpCap;


}
}
//End - MJ Retail License Creation/Update Script
