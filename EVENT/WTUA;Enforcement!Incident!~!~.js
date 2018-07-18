
//script 4323
logDebug("Script 423 Starting");
if (matchARecordType([
    "Enforcement/Incident/Abatement/NA"
], appTypeString)) {
    if (ifTracer(wfTask == "Invoicing" && wfStatus == "Invoiced", "wfTask == Invoicing && wfStatus == Invoiced")) {
        include("423_AccessInvoiceSnowAndAbatementFees");
    }
}

//script 426
logDebug("Script 426 Starting");
if (matchARecordType([
    "Enforcement/Incident/Abatement/NA",
    "Enforcement/Incident/Summons/NA",
    "Enforcement/Incident/Record with County/NA"
], appTypeString)) {
    include("426_UpdateParentEnfCaseCustomListAndStatus");
}

//CVM - 7/6/2018 - found this stuff on server when deploying (not in source code repository)
disableTokens = true;
holdCapId = capId;
parentArray = getParents("*/*/*/*");
if(wfTask == "Initial Investigation" && wfStatus == "No Violation" ){
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
if(wfTask == "Follow-Up Investigation" && wfStatus == "Violation Corrected"){
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
if(wfTask == "Follow-Up Investigation" && wfStatus == "Violation Abated"){
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
if(wfTask == "Issue Citation" && wfStatus == "Violation Corrected"){
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
if(wfTask == "Issue Citation" && wfStatus == "Violation Abated"){
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
if(wfTask == "Route to Legal" && wfStatus == "Decision Made"){
closeTask("Case Closed","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Legal Decision","","");
capId = holdCapId;
}
}
if(wfTask == "Route to Legal" && wfStatus == "Violation Abated"){
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
if(wfTask == "Incident Status" && wfStatus == "No Violation"){
closeTask("Incident Status","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","No Violation Found","","");
capId = holdCapId;
}
}
if(wfTask == "Incident Status" && wfStatus == "Violation Corrected"){
closeTask("Incident Status","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Corrected","","");
capId = holdCapId;
}
}
if(wfTask == "Incident Status" && wfStatus == "Violation Abated"){
closeTask("Incident Status","Closed","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Corrected","","");
capId = holdCapId;
}
}
if(wfTask == "Incident Status" && wfStatus == "Duplicate"){
closeTask("Incident Status","Duplicate","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Duplicate","","");
capId = holdCapId;
}
}
if(wfTask == "Incident Status" && wfStatus == "Referred"){
closeTask("Incident Status","Referred","","");
if (parentArray && parentArray.length > 0)
for (thisParent in parentArray)
if (parentArray[thisParent])
{
capId = parentArray[thisParent];
closeTask("Investigation","Referred","","");
capId = holdCapId;
}
}
disableTokens = false;
//END - CVM - 7/6/2018 - found this stuff on server when deploying (not in source code repository)