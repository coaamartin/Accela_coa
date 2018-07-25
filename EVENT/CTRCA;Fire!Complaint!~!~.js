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

    // get the inspector from GIS and assign the rec to this user
    inspUserObj = null;
    x = getGISBufferInfo("AURORACO","Fire Response Zones Run Order","0.01","BATTALION_FIRSTDUE");
    logDebug(x[0]["BATTALION_FIRSTDUE"]);
   
    var offFullName = x[0]["OFFICER_NAME"];
    
    var offFname = offFullName.substr(0,offFullName.indexOf(' '));
    logDebug("first name = " + offFname);
    
    var offLname = offFullName.substr(offFullName.indexOf(' ')+1);
    logDebug("last name = " + offLname);
    
    inspUserObj = aa.person.getUser(offFname,null,offLname).getOutput();
	
	if(inspUserObj != null)
		{scheduleInspection("Fire Complaint",0, inspUserID);}
	else{
		comment("Inspector not found via GIS.  Inspection scheduled but not assigned to Inspector.");
		scheduleInspection("Fire Complaint",0);
		}

logDebug("Script 186 END");