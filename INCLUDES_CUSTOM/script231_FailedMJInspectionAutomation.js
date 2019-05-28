function failedMJInspectionAutomation(vCapType) {

	var daysToAdd;
	var inspDate = inspObj.getInspectionDate().getMonth() + "/" + inspObj.getInspectionDate().getDayOfMonth() + "/" + inspObj.getInspectionDate().getYear();
	var inspResultComment = inspObj.getInspection().getResultComment();
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	
	//define number of days to schedule next inspection
	if (vCapType == "Application"){
		daysToAdd = 1;
	} else {
		daysToAdd = 7;
	}
	var emailTemplateName = "LIC MJ INSPECTION CORRECTION REPORT # 231";		
			
	//check for failed inspections, schedule new inspection, and email applicant with report
	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && inspResult == "Failed") {
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

			var vInspector = getInspectorByInspID(inspId, capId);
			var vInspType = inspType;
			var vInspStatus = "Scheduled";
			
			var lastIndex = inspType.lastIndexOf(" Inspections");
            var inspTypeSub = inspType.substring(0, lastIndex);

			//schedule new inspection daysToAdd number of days from inspection result date
			logDebug("Days to add: " + daysToAdd);
			var newInspSchedDate = dateAddHC3(inspDate, daysToAdd, "Y");
			scheduleInspectDate(vInspType, newInspSchedDate);
			
			//get sequence ID for most recently created inspection
			var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
			if (lastInspectionObj == null) {
				logDebug("Failed to find most recent inspection of type " + vInspType);
				continue;
			}
			
			var lastInspectionSeq = lastInspectionObj.getIdNumber();
			
			//assign inspection to inspector
			assignInspection(lastInspectionSeq, vInspector);
			
			//copy checklist items from failed inspection to the new inspection
			copyGuideSheetItemsByStatus(inspId, lastInspectionSeq);

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

			var reportTemplate = "MJ_Compliance_Corrections_Letter";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", inspId);
			
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
			if (inspResultComment)
				addParameter(eParams, "$$inspResultComment$$", inspResultComment);
			if (inspTypeSub)
                addParameter(eParams, "$$inspTypeSub$$", inspTypeSub.toUpperCase());
            if (primaryAddress)
                addParameter(eParams, "$$FullAddress$$", primaryAddress);
            if (asiValues["State License Number"])
                addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
            if (asiValues["Trade Name"])
                addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
			
			//send email with report attachment
			emailContactsWithReportLinkASync("Inspection Contact", emailTemplateName, eParams, reportTemplate, reportParams, "N", "");

			return true;
		}
	}
	return false;
}
