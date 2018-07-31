//*********************************************************************************************************
//script 186 & 187	Schedule Fire Inspection on submission
//
//Record Types:		Fire/Complaint/*/*
//Event: 			CTRCA
//Desc:				
//IRSA
//	 	criteria:	If the record is submitted from ACA
//		Action:		Schedule the inspection type “Fire Complaint” for the date that the record is submitted 
//					and assign to the proper inspector based on the inspection map settings using GIS for 
//					the districts. 
//
//Created By: 		Silver Lining Solutions
//*********************************************************************************************************

logDebug("Script 186/187 START");

var x = new Array;
inspUserObj = null;
x = getGISBufferInfo("AURORACO","Fire Response Zones Run Order","0.01","BATTALION_FIRSTDUE");
logDebug("x =" + x);
if (x && x.length > 0) {
	logDebug(x[0]["BATTALION_FIRSTDUE"]);
	var refUser = x[0]["BATTALION_FIRSTDUE"];
	var user = lookup("FIRE STATION", refUser);
	if (user != null && user != "")
	{
		scheduleInspection("Fire Complaint",0, user);
		assignCap(user);
	}
	else{
		comment("Inspector not found via GIS.  Inspection scheduled but not assigned to Inspector.");
		scheduleInspection("Fire Complaint",0);
	}
}
else{
	comment("Inspector not found via GIS.  Inspection scheduled but not assigned to Inspector.");
	scheduleInspection("Fire Complaint",0);
}

logDebug("Script 186 END");
aa.sendMail("eric@esilverliningsolutions.com", "eric@esilverliningsolutions.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);