
logDebug("Starting Script 404: MJ Application Automation");

var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
var vInspType;
var vInspGroup;
var vInspector;

//determine inspection group based on application type
if (appMatch("Licenses/Marijuana/Testing Facility/Application") {
	vInspGroup = "LIC_MJ_TST";
} else if (appMatch("Licenses/Marijuana/Retail Transporter/Application") {
	vInspGroup = "LIC_MJ_TRANS ";
} else if (appMatch("Licenses/Marijuana/Retail Store/Application") {
	vInspGroup = "LIC_MJ_RST";
} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Application") {
	vInspGroup = "LIC_MJ_RPM";
} else if (appMatch( "Licenses/Marijuana/Retail Cultivation/Application") {
	vInspGroup = "LIC_MJ_RC";
} else {
	logDebug("Error: No match for application type");
	return false;
}

//loop through array to schedule each type of inspection
for (i in inspectionTypesAry) {
	vInspType = inspectionTypesAry[i];
	
	//assign inspector based on inspection type
	if (vInspType != null && (vInspType == "MJ AMED Inspections" || vInspType == "MJ Security Inspections - Police")) {
		vInspector = "DALLEN";
	} else {
		vInspector = "SLCLARK";
	}
	
	//create inspection
	createPendingInspection(vInspGroup, vInspTypeType);

	//get sequence ID for most recently created inspection
	var lastInspectionObj = getLastCreatedInspection(capId, vInspType);
	if (lastInspectionObj == null) {
		logDebug("Failed to find most recent inspection of type " + vInspType);
		continue;
	}
	
	var lastInspectionSeq = lastInspectionObj.getIdNumber();

	//assign inspection to inspector
	assignInspection(lastInspectionSeq, vInspector);
}

//returns object of most recently scheduled inspection
function getLastCreatedInspection(capId, inspectionType) {
	//get inspections for this cap (of type inspectionType)
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		return false;
	}
	capInspections = capInspections.getOutput();

	var schedInspWithMaxId = null;
	//find last one (we created)
	for (i in capInspections) {
		if (capInspections[i].getInspectionType() == inspectionType && formatDateX(capInspections[i].getScheduledDate()) == nextInspectionDate && capInspections[i].getInspectionStatus() == "Pending") {

			//if multiple scheduled of same type, make sure to get last one (maxID)
			//this effects calculating WorkLoad (assignSameInspector method)
			if (schedInspWithMaxId == null || schedInspWithMaxId.getIdNumber() < capInspections[i].getIdNumber()) {
				schedInspWithMaxId = capInspections[i];
			}
		}
	}
	return schedInspWithMaxId;
}

//formats date in MM/DD/YYYY format
function formatDateX(scriptDate) {
	if(scriptDate != null) {
		var ret = "";
		ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
		ret += "/";
		ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
		ret += "/";
		ret += scriptDate.getYear();
		return ret;
	}
}