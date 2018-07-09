
if(inspType == "Zoning Initial Inspection"){
    //Script 346
    //                    Inspection to check for,    Insp result         New inspection                  Custom field to get date for new insp, copy failed GS, wfTask2Update, status for WF task
    //enfProcessInspResult("", "", "", "", bool, "", "");
    enfProcessInspResult("Zoning Initial Inspection", "Notice Posted", "Zoning Follow-Up Inspection", "Initial Investigation Re-Inspection Days", true, "Initial Investigation", "Notice Posted");
    enfProcessInspResult("Zoning Initial Inspection", "Notice Served", "Zoning Follow-Up Inspection", "Initial Investigation Re-Inspection Days", true, "Initial Investigation", "Notice Served");
    enfProcessInspResult("Zoning Initial Inspection", "Graffiti Notice Posted", "Graffiti Follow-Up Inspection", "Initial Investigation Re-Inspection Days", true, "Initial Investigation", "Graffiti Notice Posted");
    enfProcessInspResult("Zoning Initial Inspection", "Graffiti Notice Served", "Graffiti Follow-Up Inspection", "Initial Investigation Re-Inspection Days", true, "Initial Investigation", "Graffiti Notice Served");
    enfProcessInspResult("Zoning Initial Inspection", "No Violation Observed", null, null, false, "Initial Investigation", "No Violation Observed");
    enfProcessInspResult("Zoning Initial Inspection", "Visit/Attempted Contact", "Zoning Initial Inspection ", 1, true, "Initial Investigation", "Attempted Contact");
    enfProcessInspResult("Zoning Initial Inspection", "Refer to Other Department", null, null, false, "Initial Investigation", "Refer to Other Department");
    enfProcessInspResult("Zoning Initial Inspection", "Verbal w/ Follow-Up", "Zoning Follow-Up Inspection", "Initial Investigation Re-Inspection Days", true, "Initial Investigation", "Verbal w/ Follow-Up");
    enfProcessInspResult("Zoning Initial Inspection", "Already Under Notice", null, null, false, "Initial Investigation","Already Under Notice");
    enfProcessInspResult("Zoning Initial Inspection", "Refer to Forestry", null, null, false, "Initial Investigation", "Refer to Forestry");
    enfProcessInspResult("Zoning Initial Inspection", "Sign Removed", null, null, false, "Initial Investigation", "Sign Removed");
    enfProcessInspResult("Zoning Initial Inspection", "Board Up", "Board-Up Final Inspection", 1, true, "Initial Investigation", "Board Up");
    enfProcessInspResult("Zoning Initial Inspection", "Final Notice Posted", "Zoning Final Inspection", "Final Notice Reinspection Days", true, "Initial Investigation", "Final Notice Posted");
    enfProcessInspResult("Zoning Initial Inspection", "Final Notice Served", "Zoning Final Inspection", "Final Notice Reinspection Days", true, "Initial Investigation", "Final Notice Served");
    enfProcessInspResult("Zoning Initial Inspection", "Final Letter Sent", "Zoning Final Inspection", "Final Notice Reinspection Days", true, "Initial Investigation", "Final Letter Sent");
}

if(inspType == "Zoning Follow-Up Inspection"){
    //Script 346
    enfProcessInspResult("Zoning Follow-Up Inspection", "Ext Req on Re-Inspect", "Zoning Follow-Up Inspection", "Follow-Up Extension Date", true, "Follow-Up Investigation" ,"Ext Req on Re-Inspect");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Ext Req Phone", "Zoning Follow-Up Inspection", "Follow-Up Extension Date", true, "Follow-Up Investigation", "Ext Req Phone");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Compliance", null, null, false, "Follow-Up Investigation", "Compliance");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Unverifiable", null, null, false, "Follow-Up Investigation", "Unverifiable");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Refer to Forestry", null, null, false, "Follow-Up Investigation" ,"Refer to Forestry");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Final Notice Posted", "Zoning Final Inspection", "Final Notice Reinspection Days", true, "Follow-Up Investigation", "Final Notice Posted");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Final Notice Served", "Zoning Final Inspection", "Final Notice Reinspection Days", true, "Follow-Up Investigation", "Final Notice Served");
    enfProcessInspResult("Zoning Follow-Up Inspection", "Final Letter Sent", "Zoning Final Inspection", "Final Notice Reinspection Days", true, "Follow-Up Investigation", "Final Letter Sent");
}

if(inspType == "Graffiti Follow-Up Inspection"){
    //Script 346
    enfProcessInspResult("Graffiti Follow-Up Inspection", "Ext Req on Re-Inspect", "Graffiti Final Inspection", "Follow-Up Extension Date", true, "Follow-Up Investigation", "Ext Req on Re-Inspect");
    enfProcessInspResult("Graffiti Follow-Up Inspection", "Ext Req Phone", "Graffiti Final Inspection", "Follow-Up Extension Date", true, "Follow-Up Investigation", "Ext Req Phone");
    enfProcessInspResult("Graffiti Follow-Up Inspection", "Compliance", null, null, false, "Follow-Up Investigation", "Compliance");
    enfProcessInspResult("Graffiti Follow-Up Inspection", "Final Notice Posted", "Graffiti Final Inspection", "Final Notice Reinspection Days", true, "Follow-Up Investigation", "Final Notice Posted");
    enfProcessInspResult("Graffiti Follow-Up Inspection", "Final Notice Served", "Graffiti Final Inspection", "Final Notice Reinspection Days", true, "Follow-Up Investigation", "Final Notice Served");
    enfProcessInspResult("Graffiti Follow-Up Inspection", "Final Letter Sent", "Graffiti Final Inspection", "Final Notice Reinspection Days", true, "Follow-Up Investigation", "Final Letter Sent");
}

if(inspType == "Zoning Final Inspection"){
    //Script 346
    enfProcessInspResult("Zoning Final Inspection", "Ext Req on Re-Inspect", "Zoning Final Inspection", "Final Inspection Extension Date", true, "Final Follow-Up Investigation", "Ext Req on Re-Inspect");
    enfProcessInspResult("Zoning Final Inspection", "Ext Req Phone", "Zoning Final Inspection", "Final Inspection Extension Date", true, "Final Follow-Up Investigation", "Ext Req Phone");
    enfProcessInspResult("Zoning Final Inspection", "Compliance", null, null, false, "Final Follow-Up Investigation", "Compliance");
    enfProcessInspResult("Zoning Final Inspection", "Unverifiable", null, null, false, "Final Follow-Up Investigation", "Unverifiable");
    enfProcessInspResult("Zoning Final Inspection", "Refer to Forestry", null, null, false, "Final Follow-Up Investigation", "Refer to Forestry");
    enfProcessInspResult("Zoning Final Inspection", "Record with County", null, null, false, "Final Follow-Up Investigation", "Record with County");
}

if(inspType == "Board-Up Final Inspection"){
    //Script 346
    enfProcessInspResult("Board-Up Final Inspection", "Ext Req on Re-Inspect", "Board-Up Final Inspection", "Final Inspection Extension Date", true, "Final Follow-Up Investigation", "Ext Req on Re-Inspect");
    enfProcessInspResult("Board-Up Final Inspection", "Ext Req Phone", "Board-Up Final Inspection", "Final Inspection Extension Date", true, "Final Follow-Up Investigation", "Ext Req Phone");
    enfProcessInspResult("Board-Up Final Inspection", "Compliance", null, null, false, "Final Follow-Up Investigation", "Compliance");
    enfProcessInspResult("Board-Up Final Inspection", "Unverifiable", null, null, false, "Final Follow-Up Investigation", "Unverifiable");
    enfProcessInspResult("Board-Up Final Inspection", "Refer to Forestry", null, null, false, "Final Follow-Up Investigation", "Refer to Forestry");
    enfProcessInspResult("Board-Up Final Inspection", "Record with County", null, null, false, "Final Follow-Up Investigation", "Record with County");
}

if(inspType == "Graffiti Final Inspection"){
    //Script 346
    enfProcessInspResult("Graffiti Final Inspection", "Ext Req on Re-Inspect", "Graffiti Final Inspection", "Final Inspection Extension Date", true, "Final Follow-Up Investigation", "Ext Req on Re-Inspect");
    enfProcessInspResult("Graffiti Final Inspection", "Ext Req Phone", "Graffiti Final Inspection", "Final Inspection Extension Date", true, "Final Follow-Up Investigation", "Ext Req Phone");
    enfProcessInspResult("Graffiti Final Inspection", "Compliance", null, null, false, "Final Follow-Up Investigation", "Compliance");
}

if(inspType == "Snow Initial Inspection"){
    //Script 346
    enfProcessInspResult("Snow Initial Inspection", "Snow Warning Posted", "Snow Warning Inspection", "nextWorkDay", true, "Initial Investigation", "Snow Warning Posted");
    enfProcessInspResult("Snow Initial Inspection", "Snow Warning Served", "Snow Warning Inspection", "nextWorkDay", true, "Initial Investigation", "Snow Warning Served");
    enfProcessInspResult("Snow Initial Inspection", "Snow Fee Posted", null, null, false, "Initial Investigation", "Snow Fee Served");
    enfProcessInspResult("Snow Initial Inspection", "Snow Fee Served", null, null, false, "Initial Investigation", "Taken and Stored");
    enfProcessInspResult("Snow Initial Inspection", "Taken and Stored", "Snow Fee 1st Re-Inspection", "nextWorkDay", true, "Initial Investigation", "Taken and Stored");
    enfProcessInspResult("Snow Initial Inspection", "No Violation Observed", null, null, false, "Initial Investigation", "No Violation Observed");
    enfProcessInspResult("Snow Initial Inspection", "Visit/Attempted Contact", "Snow Warning Inspection", "nextWorkDay", true, "Initial Investigation", "Attempted Contact");
    enfProcessInspResult("Snow Initial Inspection", "Refer to Other Department", null, null, false, "Initial Investigation", "Refer to Other Department");
    enfProcessInspResult("Snow Initial Inspection", "Skip to Summons", null, null, false, "Initial Investigation", "Skip to Summons");
    enfProcessInspResult("Snow Initial Inspection", "Skip to City Abatement", null, null, false, "Initial Investigation", "Skip to Abatement");
}

if(inspType == "Snow Warning Inspection"){
    //Script 346
    enfProcessInspResult("Snow Warning Inspection", "Snow Fee Posted", null, null, false, "Snow Warning Reinspect", "Snow Fee Posted");
    enfProcessInspResult("Snow Warning Inspection", "Snow Fee Served", null, null, false, "Snow Warning Reinspect", "Snow Fee Served");
    enfProcessInspResult("Snow Warning Inspection", "Snow Compliance", null, null, false, "Snow Warning Reinspect", "Snow Compliance");
    enfProcessInspResult("Snow Warning Inspection", "New Snow Extension", "Snow Warning Inspection", "nextWorkDay", true, "Snow Warning Reinspect", "New Snow Extension");
}

if(inspType == "Snow Fee 1st Re-Inspection"){
    //Script 346
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Snow Fee Posted", null, null, false, "Snow Fee 1st Reinspect", "Snow Fee Posted");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Snow Fee Served", null, null, false, "Snow Fee 1st Reinspect", "Snow Fee Served");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Taken and Stored", "Snow Fee 2nd Re-Inspection", "nextWorkDay", true, "Snow Fee 1st Reinspect", "Taken and Stored");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Snow Compliance", null, null, false, "Snow Fee 1st Reinspect", "Snow Compliance");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "New Snow Extension", "Snow Fee 1st Re-Inspection", "nextWorkDay", true, "Snow Fee 1st Reinspect", "New Snow Extension");
}

if(inspType == "Snow Fee 2nd Re-Inspection"){
    //Script 346
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "Snow Compliance", null, null, false, "Snow Fee 2nd Reinspect", "Snow Compliance");
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "New Snow Extension", "Snow Fee 2nd Re-Inspection", "nextWorkDay", true, "Snow Fee 2nd Reinspect", "New Snow Extension");
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "Snow Abatement", null, null, false, "Snow Fee 2nd Reinspect", "Snow Abatement");
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "Snow Abate/Summons", null, null, false, "Snow Fee 2nd Reinspect", "Snow Abate/Summons");
}

disableTokens = true;
holdCapId = capId;
parentArray = getParents("*/*/*/*");
if(inspType == "Initial Investigation" && inspResult == "Compliant"){
branchTask("Initial Investigation","No Violation","Updated by Inspection Result","Note");
closeTask("Case Closed","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","No Violation Found","","");
capId = holdCapId;
}
}
if (inspType == "Initial Investigation" && inspResult == "In Violation") {
closeTask("Initial Investigation","In Violation","Updated by Inspection Result","Note");
}
if (inspType == "Initial Investigation" && inspResult == "Citation") {
loopTask("Initial Investigation","Recommend Citation","Updated by Inspection Result","Note");
}
if(inspType == "Follow-Up Investigation" && inspResult == "Compliant"){
branchTask("Follow-Up Investigation","Violation Corrected","Updated by Inspection Result","Note");
closeTask("Case Closed","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Corrected","","");
capId = holdCapId;
}
}
if (inspType == "Follow-Up Investigation" && inspResult == "Citation") {
closeTask("Follow-Up Investigation","Recommend Citation","Updated by Inspection Result","Note");
}
if(inspType == "Follow-Up Investigation" && inspResult == "Abated"){
branchTask("Follow-Up Investigation","Violation Abated","Updated by Inspection Result","Note");
closeTask("Case Closed","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Corrected","","");
capId = holdCapId;
}
}
if (inspType == "Initial Investigation" && inspResult == "Compliant") {
updateTask("Incident Status","No Violation","Updated by Inspection Result","Note");
closeTask("Incident Status","Closed","","");
}
if (inspType == "Initial Investigation" && inspResult == "In Violation") {
updateTask("Incident Status","In Violation","Updated by Inspection Result","Note");
}
if (inspType == "Initial Investigation" && inspResult == "Citation") {
updateTask("Incident Status","Citation Issued","Updated by Inspection Result","Note");
}
if (inspType == "Follow-Up Investigation" && inspResult == "Compliant") {
updateTask("Incident Status","Violation Corrected","Updated by Inspection Result","Note");
closeTask("Incident Status","Closed","","");
}
if (inspType == "Follow-Up Investigation" && inspResult == "Citation") {
updateTask("Incident Status","Citation Issued","Updated by Inspection Result","Note");
}
if (inspType == "Follow-Up Investigation" && inspResult == "Abated") {
updateTask("Incident Status","Violation Abated","Updated by Inspection Result","Note");
closeTask("Incident Status","Closed","","");
}

//*********************************************************************************************************
//script 343        Create Child Summons to Court Record
//
//Record Types:     Enforcement/*/*/*
//Event:            IRSA
//Desc:             Create Child Record and schedule same day inspection when the inspection is resulted 
//                  "Skip to Summons" Enforcement/Incident/Zoning/NA Enforcement/Incident/Snow/NA 
//                  Enforcement/Incident/Housing/NA SEE ATTACHMENT FOR SCRIPT SPECIFICATIONS
//
//Created By:       Silver Lining Solutions
//*********************************************************************************************************
logDebug("Script 343 START");
if (inspResult == "Skip to Summons")
{
    logDebug("Script 343: criteria met");
    var currentCapId = capId;
    var appName = "Summons created for Record Number " + capId.customID;
    var newChild = createChild('Enforcement','Incident','Summons','NA',appName);
    var appHierarchy = aa.cap.createAppHierarchy(capId, newChild);
    copyRecordDetailsLocal(capId, newChild);
    copyContacts(capId, newChild);
    copyAddresses(capId, newChild);
    copyParcels(capId, newChild);
    copyOwner(capId, newChild);
    
    //createPendingInspection("ENF_SUMMON","Pre Trial Inspection",newChild);
    capId = newChild;
    scheduleInspection("Pre Trial Inspection",0);
    capId = currentCapId;

}           
logDebug("Script 343 END");

//*********************************************************************************************************
//script 344 		Create Child Abatement
//
//Record Types:		Enforcement/*/*/*
//Event: 			IRSA
//Desc:				Create Child Record and schedule same day inspection when the inspection is resulted 
// 					"Skip to Summons" Enforcement/Incident/Zoning/NA Enforcement/Incident/Snow/NA 
//					Enforcement/Incident/Housing/NA SEE ATTACHMENT FOR SCRIPT SPECIFICATIONS
//
//Created By: 		Silver Lining Solutions
//*********************************************************************************************************
logDebug("Script 344 START");
if (inspResult == "Skip to Abatement" || inspResult == "Skip to City Abatement")
{
	logDebug("Script 344: criteria met");
	var currentCapId = capId;
	var appName = "Abatement created for Record Number " + capId.customID;
	var newChild = createChild('Enforcement','Incident','Abatement','NA',appName);
	var appHierarchy = aa.cap.createAppHierarchy(capId, newChild);
	copyRecordDetailsLocal(capId, newChild);
	copyContacts(capId, newChild);
	copyAddresses(capId, newChild);
	copyParcels(capId, newChild);
	copyOwner(capId, newChild);
	
	capId = newChild;
	scheduleInspection("Post Abatement Inspection",0);
	capId = currentCapId;
	
	if (inspResult == "Skip to City Abatement")
		{ editAppSpecific("Abatement Type", "City", newChild); }

}			
logDebug("Script 344 END");