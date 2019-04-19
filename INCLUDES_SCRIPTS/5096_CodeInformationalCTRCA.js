// SCRIPTNUMBER: 5096
// SCRIPTFILENAME: 5096_CodeInformationalCTRCA.js
// PURPOSE: Called when Enforcement Informational record submitted from ACA.  Attempts to assign the first task to the code officer.
// DATECREATED: 04/18/2019
// BY: amartin
// CHANGELOG: 

logDebug("---------------------> At start of 5096 CTRCA");

var staffAdmin = "dfoxen";

function assignOfficer(codeDistrict) {			
var inspOfficer = lookup("CODE_OFFICER_AREA#", codeDistrict);
	if (!inspOfficer) {
		logDebug("<br>**INFO could not retrieve Code Officer Name from CODE_OFFICER_AREA# USING JJKING AS ALTERNATE NAME.");
		return "jjking";
	} else {
		return inspOfficer;
	}
}

try{
	var codeDistrict = new Array;
	codeDistrict = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","CODE_NUMBER")
	if(codeDistrict && codeDistrict.length > 0){
	var inspOfficer = assignOfficer(codeDistrict);
	}
	if (inspOfficer) {
		var inspRes = aa.person.getUser(inspOfficer);
		if (inspRes.getSuccess())
		{var inspectorObj = inspRes.getOutput();}
	}				
} catch (err) {
	logDebug("Failed to retrieve code area for code officer assignment: " + err.stack);
};

//var x = new Array;
//inspUserObj = null;
//x = getGISBufferInfo("AURORACO","Fire Response Zones Run Order","0.01","FIRSTDUE");
//x = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","CODE_NUMBER");
//logDebug("x =" + x);
//if (x && x.length > 0) {
//	logDebug(x[0]["CODE_NUMBER"]);
//	var refUser = x[0]["CODE_NUMBER"];
//	logDebug("refuser =" + refUser);
//	var user = lookup("CODE_OFFICER_AREA#", refUser);
//	logDebug("refuser =" + user);
if (inspectorObj != null && inspectorObj != "")
{
	logDebug("inside if =" + inspectorObj);
	//scheduleInspection("Reinspection 1",0, user);
	//scheduleInspection("Pictures",0, user);	
	assignCap(inspectorObj);
	assignTask("Issue Classification", inspectorObj);
	//closeTask("Assign Complaint", "Complete", "Completed by Script 187", "");
	//activateTask("Review Application");
	//assignTask("Inspection", user);
}
else{
	comment("Inspector not found via GIS.  Task assigned to Admin.");	
	assignCap(staffAdmin);
	assignTask("Issue Classification", staffAdmin);		
	//comment("Inspector not found via GIS.  Inspection scheduled but not assigned to Inspector.");
	//scheduleInspection("Reinspection 1",0);
}


logDebug("---------------------> At end of 5096 CTRCA");
aa.sendMail("amartin@auroragov.org", "amartin@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);