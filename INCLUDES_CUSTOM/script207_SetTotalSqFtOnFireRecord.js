//Script 207
//Record Types:	Building/Permit/New Building/NA 
//Event: 		WTUA
//Desc:	 
//
//              Criteria wfTask = = Certificate of Occupancy status = Final CO Issued or Not Required 
//             			and If custom field “Single Family Detached home” = “No” 
//
//              Action then auto generate the record “Fire/Primary Inspection/NA/NA” 
//              		
//              2nd Criteria workflow status is "Final CO Issued” on the building record
//              2nd Action populate the custom field “Building Square Footage” from 
//						the Building/Permit/New Building/NA record  
//
//Created By: Silver Lining Solutions

function script207_SetTotalSqFtOnFireRecord() {
	logDebug("script207_SetTotalSqFtOnFireRecord() started.");
	try {
		var SFDHome = getAppSpecific("Single Family Detached home");
		logDebug("SFDHome =" + SFDHome);
		if( SFDHome == "No" && wfTask == "Certificate of Occupancy" && (wfStatus == "Final CO Issued" || wfStatus == "Not Required"))
			{
			logDebug("script207_SetTotalSqFtOnFireRecord() passed test.");
			var cCapId = createChild("Fire", "Primary Inspection", "NA", "NA", ""); 
			if (cCapId != null) {
				if (wfStatus == "Final CO Issued") 
					{
					//JMAIN updated this because it wasn't building in the EMSE tool.
					//editAppSpecific("Building Square Footage", {Total Finished Area Sq Ft}, cCapId);
					var totalfinishedarea = getAppSpecific("Total Finished Area Sq Ft");
					editAppSpecific("Building Square Footage", totalfinishedarea, cCapId);

					logDebug("script207_SetTotalSqFtOnFireRecord() updated ASI.");
					}
			}
		}
	}
	catch (err) {
		comment("Error on custom function script207_SetTotalSqFtOnFireRecord(). Please contact administrator. Err: " + err);
	}

};//END script207_SetTotalSqFtOnFireRecord
