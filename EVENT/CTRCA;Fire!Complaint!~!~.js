//*********************************************************************************************************
//script 186 		Schedule Fire Inspection on submission
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

logDebug("Script 186 START");

var x = new Array;
inspUserObj = null;
x = getGISBufferInfo("AURORACO","Fire Response Zones Run Order","0.01","BATTALION_FIRSTDUE");
logDebug("x =" + x);
scheduleInspection("Fire Complaint",0);


logDebug("Script 186 END");
aa.sendMail("eric@esilverliningsolutions.com", "eric@esilverliningsolutions.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);