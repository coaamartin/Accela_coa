// SCRIPTNUMBER: 5085
// SCRIPTFILENAME: 5085_HandleMiscServicesMasterWTUA.js
// PURPOSE: Called when master record has task update
// DATECREATED: 02/11/2019
// BY: amartin
// CHANGELOG: 

logDebug("At start of 5085_HandleMiscServicesMasterWTUA.js");	 
if (wfTask == "Email GIS" && wfStatus == "Email Sent") {
logDebug("5085 sending Email to GIS");	 

		//sendEmailToGIS();
}

function sendEmailToGIS(){
emailAsync2("", "MISC NA MASTER GIS REFERRAL", "");
}
	logDebug("5085_HandleMiscServicesMasterWTUA.js ended.");
