
function passedMJInspectionAutomation(vCapType) {
	var emailTemplate = "LIC MJ COMPLIANCE #232";
	var inspResultComment = inspObj.getInspection().getResultComment();
	//check for passed application inspections and email inspection contact with report
	if (vCapType == "Application") {
		if (inspResult == "Passed" || inspResult == "Passed - Minor Violations") {
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

            var lastIndex = inspType.lastIndexOf(" Inspections");
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
	           
			var reportTemplate = "MJ_Compliance_Corrections_Letter";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", inspId);
			
			//send email with report attachment		
			emailContactsWithReportLinkASync("Inspection Contact", emailTemplate, eParams, reportTemplate, reportParams, "N", "");
		}
	} 
}
