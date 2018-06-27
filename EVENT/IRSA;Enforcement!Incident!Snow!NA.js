// this scenario could not be added to the configurable script due to the backslash in the result

try {
	if(inspType == "Snow Initial Inspection" && inspResult == "Visit/Attempted Contact"){
		var inspector = getSameInspector();
		scheduleInspection ("Snow Fee 1st Reinspection", 1, inspector, "", "Scheduled via EMSE");
		updateTask("Initial Investigation","Visit/Attempted Contact","Updated via EMSE","");
	}
}catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
}

function getSameInspector(){
	var currInspector = null;
	if (inspId != null) {
		var inspResultObj = aa.inspection.getInspection(capId, inspId);
		if (inspResultObj.getSuccess()) {
			var currentInp = inspResultObj.getOutput();
			var inspUserObj = aa.person.getUser(currentInp.getInspector().getFirstName(), currentInp.getInspector().getMiddleName(), currentInp.getInspector().getLastName())
					.getOutput();
			currInspector = inspUserObj.getUserID();
			return currInspector;
		}
	}
}

//script 357
logDebug("Script 357 Starting");
if(ifTracer(inspResult == "Snow Warning Posted" || inspResult == "Snow Warning Served", "inspResult == Snow Warning Served or Posted")) {
	addrAddCondition(null, 'Potential Hazards', 'Applied', inspResult, 'Added per script 357', '', 'N');
}
