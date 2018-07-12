// Script 421
if ("Zoning Initial Inspection".equals(inspType) && "Citation/Summons".equals(inspResult)) {
	var holdId = capId;
	var r = getRelatedCapsByAddress("Enforcement/Incident/Summons/NA");
	if (r && r.length > 0) {
		for (var i in r) {
			capId = aa.cap.getCapID(r[i].getID1(), r[i].getID2(), r[i].getID3()).getOutput();
			var thisCap = aa.cap.getCapBasicInfo(capId).getOutput();
			logDebug("related summons address: " + capId.getCustomID() + " has status " + thisCap.getCapStatus());
			if ("NFZV - 1 Year".equals(thisCap.getCapStatus())) {
				activateTask("Pre Summons Photos");
				updateAppStatus("Pending Citation", "Updated by Script 421");
				var thisInsp = scheduleInspectionCustom("Summons Issuance", dateAdd(null, 0));
				logDebug("inspection is " + thisInsp);
			}
		}

	}
	capId = holdId;
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
if(inspResult == "Refer to Forestry" && (inspType == "Zoning Initial Inspection" || 
										 inspType == "Zoning Follow-Up Inspection" ||
										 inspType == "Zoning Final Inspection" ))
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
	
	var forestryComments = getAppSpecific("Comments to Forestry");
	
	var workDescResult = aa.cap.getCapWorkDesByPK(newChild);
	if (workDescResult.getSuccess()) {
		var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
		workDesObj.setDescription(forestryComments);
		aa.cap.editCapWorkDes(workDesObj);
	}
	
	// check guide sheets to see if we need to deactivate the tasks and update the rec status
	guideSheetArray = getGuideSheetObjects(inspId);
	
	var needToRefer = false;
	for (x in guideSheetArray)
	{
		gsItem = guideSheetArray[x];
		if (gsItem.status != "Refer to Forestry" && gsItem.status != "N/A" )
			{
			logDebug("x = " + x + " | status = " + gsItem.status );
			needToRefer = true;}
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
			resultInspection("Zoning Initial Inspection","Referred to Forestry","07/12/2018",""); }	
		if(inspType == "Zoning Follow-Up Inspection") 
			{ resultInspection("Zoning Follow-Up Inspection","Referred to Forestry","07/12/2018",""); }
		if(inspType == "Zoning Final Inspection" )
			{ resultInspection("Zoning Final Inspection","Referred to Forestry","07/12/2018",""); }
	}
}
logDebug("Script 73 END");
logDebug("Script 73 capId = " + capId); 
