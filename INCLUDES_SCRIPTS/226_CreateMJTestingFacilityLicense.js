//Start - 226 MJ Testing Facility License Creation
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

	vParentLicTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "License";
	vParentLicType = "License";

	//Check if the record already has a parent of the correct type.
	//The correct type has the same top three levels of the record type
	//hierarchy as the current record but the fourth level is
	//'License' instead of 'Application'.
	//If no license exists create one.
	//
	vParentArry = getParents(vParentLicTypeString);
	if (vParentArry != null && vParentArry != "") {
		vLicenseID = vParentArry[0];
	} else if (appTypeArray[3] == "Application") {
		vLicenseID = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], vParentLicType, getAppName(capId));
	}

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

		//Activate the license records expiration cycle
		vLicenseObj = new licenseObject(null, vLicenseID);
		vLicenseObj.setStatus("Active");
		thisLicExpOb = vLicenseObj.b1Exp
		expUnit = thisLicExpOb.getExpUnit()
		expInt = thisLicExpOb.getExpInterval()
		if (expUnit == "MONTHS") {
			newExpDate = dateAddMonths(null, expInt);
			} 
		vLicenseObj.setExpiration(newExpDate);
		
		//Update License Workflow
		tmpCap = capId;
		capId = vLicenseID;
		updateTask("License Status", "Active", "Updated by Script 226_CreateMJTestingFacilityLicense", "Update by Script 226_CreateMJTestingFacilityLicense");
		capId = tmpCap;

		//Generate license report and email
		var vEmailTemplate;
		var vReportTemplate;

		if (appMatch("Licenses/Marijuana/Testing Facility/License", vLicenseID) && (wfStatus == "Issued")) {
			vEmailTemplate = "LIC MJ APPROVAL OF LICENSE #226 - 230";
			vReportTemplate = "MJ_License";
			tmpCap = capId;
			capId = vLicenseID;
			scheduleInspection("MJ AMED Inspection", 77, "DALLEN", " ", "Scheduled by Script 226");
			scheduleInspection("MJ Building Inspections - Plumbing", 77, "SLCLARK", " ", "Scheduled by Script 226");
			scheduleInspection("MJ Building Inspections - Electrical", 77, "SLCLARK", " ", "Scheduled by Script 226");
			scheduleInspection("MJ Building Inspections - Mechanical", 77, "SLCLARK", " ", "Scheduled by Script 226");
			scheduleInspection("MJ Building Inspections - Life Safety", 77, "SLCLARK", " ", "Scheduled by Script 226");
			scheduleInspection("MJ Security Inspections - 3rd Party", 77, "DALLEN", " ", "Scheduled by Script 226");
			scheduleInspection("MJ Building Inspections - Structural", 77, "SLCLARK", " ", "Scheduled by Script 226");
			capId = tmpCap;
		}

		//are these the parameters used in the email or report?
		
		var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
        var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
        var recordDeepUrl = getACARecordURL(subStrIndex)
                

		var vEParams = aa.util.newHashtable();
		addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
		addParameter(vEParams, "$$ExpirationDate$$", vLicenseObj.b1ExpDate);
		addParameter(vEParams, "$$ApplicationID$$", vLicenseID.getCustomID());
		//addParameter(vEParams, "$$Record_ID$$", vLicenseID.getCustomID);
		//addParameter(vEParams, "$$recordDeepUrl$$", recordACAUrl);

		var vRParams = aa.util.newHashtable();
		addParameter(vRParams, "Record_ID", vLicenseID.getCustomID());

		// Generate report/email and save to new License record
		tmpCap = capId;
		capId = vLicenseID;
		emailContacts("All", vEmailTemplate, vEParams, vReportTemplate, vRParams);
		capId = tmpCap;

	}
}
//End - MJ Testing Facility License Creation
