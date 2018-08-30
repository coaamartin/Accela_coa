// Script 421
if ("Zoning Initial Inspection".equals(inspType) && "Citation/Summons".equals(inspResult)) {
	//var holdId = capId;
	var r = getRelatedCapsByAddress("Enforcement/Incident/Summons/NA");
	if (r && r.length > 0) {
		for (var i in r) {
			recCapId = aa.cap.getCapID(r[i].getID1(), r[i].getID2(), r[i].getID3()).getOutput();
			var thisCap = aa.cap.getCapBasicInfo(recCapId).getOutput();
			logDebug("related summons address: " + recCapId.getCustomID() + " has status " + thisCap.getCapStatus());
			if ("NFZV - 1 Year".equals(thisCap.getCapStatus())) {
				activateTask("Pre Summons Photos");
				updateAppStatus("Pending Citation", "Updated by Script 421");
				var thisInsp = scheduleInspectionCustom4CapId(recCapId, "Summons Issuance", 0, currentUserID);
				logDebug("inspection is " + thisInsp);
			}
		}
	}
	//capId = holdId;
}
// End Script 421

//*********************************************************************************************************
//script 73 		Create Child Forestry/Enforcement Records
//
//Record Types:		Enforcement/Incident/Zoning/NA
//Event: 			IRSA
//Desc:				
//IRSA
//		Criteria:  	if Insp Type = ZII, ZFUI, ZFI && status ‘ Refer to Forestry’
//		Action:		Update wfTask based on the inspection type (either II, FUI, FFUI) to status ‘Refer to Forestry’
//					Create child and copy data
//
//					Checklists – Landscaping & Trees
//						If any of the status for the checklist items is set to ‘Refer to Forestry’
//
//					If ALL checklist items are resulted to ‘N/A’ or ‘Refer to Forestry’
//						Deactivate the WF task
//						Result Inspection (“Referred to Forestry”)
//						Update App Status “Referred to Forestry”
//					If not ALL 
//						Do nothing!
//
//Created By: 		Silver Lining Solutions
//*********************************************************************************************************
logDebug("Script 73 START");
logDebug("Script 73 capId = " + capId); 
if(	(inspResult == "Refer to Forestry" || inspResult == "Referred to Forestry" ) 
	&& (inspType == "Zoning Initial Inspection" || inspType == "Zoning Follow-Up Inspection" || inspType == "Zoning Final Inspection" ))
{
	logDebug("Script 73 criteria met");
	
	// update the correct task with the status
	if (inspType == "Zoning Initial Inspection")
		{ updateTask("Initial Investigation","Refer to Forestry","auto updated by script","auto updated by script");	}
	if (inspType == "Zoning Follow-Up Inspection" )
		{ updateTask("Follow-Up Investigation","Refer to Forestry","auto updated by script","auto updated by script");	}
	if (inspType == "Zoning Final Inspection" )
		{ updateTask("Final Follow-Up Investigation","Refer to Forestry","auto updated by script","auto updated by script"); }
	
	// create child record and copy info
	var currentCapId = capId;
	var appName = "Forestry created for Record Number " + capId.customID ;
	var appName = "Created from Zoninig Incident";
	var newChild = createChild('Forestry','Request','Citizen','NA',appName);
	var appHierarchy = aa.cap.createAppHierarchy(capId, newChild);
	copyRecordDetailsLocal(capId, newChild);
	copyContacts(capId, newChild);
	copyAddresses(capId, newChild);
	copyParcels(capId, newChild);
	copyOwner(capId, newChild);
	
	// need to get the record detail description info and concatenate this with the comments to forestryComments
	var workDescResult = aa.cap.getCapWorkDesByPK(capId);
	var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
	var details = workDesObj.getDescription();
	var forestryComments = getAppSpecific("Comments to Forestry");
	var childDescString = details + " | " + forestryComments;
	logDebug("childDescString = " + childDescString);
	
	// now place the new detail desc in the child rec detail description
	var workDescResult = aa.cap.getCapWorkDesByPK(newChild);
	if (workDescResult.getSuccess()) {
		var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
		workDesObj.setDescription(childDescString);
		aa.cap.editCapWorkDes(workDesObj);
	}
	
	// check guide sheets to see if we need to deactivate the tasks and update the rec status
	guideSheetArray = getGuideSheetObjects(inspId);
	
	var needToRefer = true;
	for (var x in guideSheetArray)
	{
		gsItem = guideSheetArray[x];
		logDebug("x = " + x + " | status = " + gsItem.status );
		if (gsItem.status != "Refer to Forestry" && gsItem.status != "N/A" )
			{ needToRefer = false;}
	}
	logDebug("Script 73: need to refer = " + needToRefer);
	if (needToRefer)
	{
		logDebug("Script 73: going to refer - inspType = " + inspType);
		updateAppStatus("Referred to Forestry","");
		
		if (inspType == "Zoning Initial Inspection")
			{ deactivateTask("Initial Investigation");	}
		if (inspType == "Zoning Follow-Up Inspection" )
			{ deactivateTask("Follow-Up Investigation");	}
		if (inspType == "Zoning Final Inspection" )
			{ deactivateTask("Final Follow-Up Investigation"); }
		
		if(inspType == "Zoning Initial Inspection") 
			{ logDebug("Script 73: ZII ");
			forceResultInspection("Zoning Initial Inspection","Referred to Forestry","07/12/2018",""); }	
		if(inspType == "Zoning Follow-Up Inspection") 
			{ forceResultInspection("Zoning Follow-Up Inspection","Referred to Forestry","07/12/2018",""); }
		if(inspType == "Zoning Final Inspection" )
			{ forceResultInspection("Zoning Final Inspection","Referred to Forestry","07/12/2018",""); }
	}
}
logDebug("Script 73 END");
logDebug("Script 73 capId = " + capId); 

function forceResultInspection(inspType, inspStatus, resultDate, resultComment) //optional capId
{
	var itemCap = capId
		if (arguments.length > 4)
			itemCap = arguments[4]; // use cap ID specified in args

		var foundID;
	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(inspType).equals(inspList[xx].getInspectionType()))
				foundID = inspList[xx].getIdNumber();
	}

	if (foundID) {
		resultResult = aa.inspection.resultInspection(itemCap, foundID, inspStatus, resultDate, resultComment, currentUserID)

			if (resultResult.getSuccess()) {
				logDebug("Successfully resulted inspection: " + inspType + " to Status: " + inspStatus)
			} else {
				logDebug("**WARNING could not result inspection : " + inspType + ", " + resultResult.getErrorMessage());
			}
	} else {
		logDebug("Could not result inspection : " + inspType + ", not scheduled");
	}

}
