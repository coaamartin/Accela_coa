if (wfTask == "Certificate of Occupancy" && wfStatus == "Complete"){
	logDebug("Starting Script 404: MJ Application Automation");

	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	var vInspType;
	var vInspGroup;
	var vInspector;
	var vLastInspStatus = "Pending";

	//determine inspection group based on application type
	if (appMatch("Licenses/Marijuana/Testing Facility/Application")) {
		vInspGroup = "LIC_MJ_TST";
	} else if (appMatch("Licenses/Marijuana/Retail Transporter/Application")) {
		vInspGroup = "LIC_MJ_TRANS";
	} else if (appMatch("Licenses/Marijuana/Retail Store/Application")) {
		vInspGroup = "LIC_MJ_RST";
	} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Application")) {
		vInspGroup = "LIC_MJ_RPM";
	} else if (appMatch("Licenses/Marijuana/Retail Cultivation/Application")) {
		vInspGroup = "LIC_MJ_RC";
	} else {
		logDebug("Error: No match for application type");
	}

	//loop through array to schedule each type of inspection
	for (i in inspectionTypesAry) {
		vInspType = inspectionTypesAry[i];
		
		//assign inspector based on inspection type
		if (vInspType != null && (vInspType == "MJ AMED Inspections")) {
			vInspector = "DALLEN";
		} else if (vInspType != null && (vInspType == "MJ Planning Inspections")) {
			vInspector = "DALLEN";
		} else if (vInspType != null && (vInspType == "MJ Code Enforcement Inspections")) {
			vInspector = "DALLEN";
		} else if (vInspType != null && (vInspType == "MJ Security Inspections - Police")) {
			vInspector = "DALLEN";
		} else if (vInspType != null && vInspType.indexOf("MJ Building Inspections") != -1) {
        	vInspector = "";
        } else {
			vInspector = "DALLEN";
		}
		
		//create inspection
		createPendingInspection(vInspGroup, vInspType, capId);

		//get sequence ID for most recently created inspection
		var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vLastInspStatus);
		if (lastInspectionObj == null) {
			logDebug("Failed to find most recent inspection of type " + vInspType);
			continue;
		}
		
		var lastInspectionSeq = lastInspectionObj.getIdNumber();
		
		if (vInspType != null && vInspType.indexOf("MJ Building Inspections") != -1) {
	        assignInspectionDepartment("BUILDING/NA/NA/NA/NA/BI", vInspType);
	    }else{
	        //assign inspection to inspector
	        assignInspection(lastInspectionSeq, vInspector);
	    }
	}

	logDebug("Ending Script 404: MJ Application Automation");
}