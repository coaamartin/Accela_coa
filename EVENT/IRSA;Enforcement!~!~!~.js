
if(inspType == "Zoning Initial Inspection"){
    //Script 346
	enfProcessInspResult("Zoning Initial Inspection", "Notice Posted", "Zoning Follow-Up Inspection", "Initial Investigation Re-Inspection Days", true, "Initial Investigation", "Notice Posted");
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
//script 343 		Create Child Summons to Court Record
//
//Record Types:		Enforcement/*/*/*
//Event: 			IRSA
//Desc:				Create Child Record and schedule same day inspection when the inspection is resulted 
// 					"Skip to Summons" Enforcement/Incident/Zoning/NA Enforcement/Incident/Snow/NA 
//					Enforcement/Incident/Housing/NA SEE ATTACHMENT FOR SCRIPT SPECIFICATIONS
//
//Created By: 		Silver Lining Solutions
//*********************************************************************************************************
logDebug("Script 343 START");
if (inspResult == "Skip to Summons")
{
	logDebug("Script 343: criteria met");
	var appName = "Summons created for Record Type " + capName + " and Record Number " + capId;
	var newChild = createChild('Enforcement','Incident','Summons','NA',appName);
	var appHierarchy = aa.cap.createAppHierarchy(capId, newChild);
	copyRecordDetailsLocal(capId, newChild);
	copyContacts(capId, newChild);
	copyAddresses(capId, newChild);
	copyParcels(capId, newChild);
	copyOwner(capId, newChild);

}			
logDebug("Script 343 END");