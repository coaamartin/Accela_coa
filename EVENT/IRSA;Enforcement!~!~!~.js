
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