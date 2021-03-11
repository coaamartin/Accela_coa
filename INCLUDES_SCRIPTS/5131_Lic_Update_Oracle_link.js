//Written by rprovinc   
//
//include("5131_Lic_Update_Oracle_link.js");

//*****************************************************************************
//Script ASA;Licenses!~!~!Application.js
//Record Types:	Licenses/~/~/Application 
//Event: 		ASA
//Desc:			Updating the Oracle link when application is submitted.
//
//Created By: Rprovinc
//******************************************************************************

//Below is code to create and then populate the oracle link when appliaction is submitted.
if (appMatch('Licenses/Liquor/*/*') || appMatch('Licenses/Supplemental/*/*')){
logDebug("Start of script 5131_Lic_Update_Oracle_link.js");
// get general business license number
var envParameters = aa.util.newHashMap();
var genBusinessNumber = AInfo["General Business License Number"];
var oracleURL = "http://doccity/cs/idcplg?IdcService=GET_SEARCH_RESULTS_FORCELOGIN&QueryText=" + genBusinessNumber;
logDebug("General Buiness Number: " + genBusinessNumber);
logDebug("Oracle Link: " + oracleURL);
//setCustomField(vFieldName,vFieldValue);
//setCustomField("Oracle Link", oracleURL);
editAppSpecific("Oracle Link", oracleURL);
var oracleLink = AInfo["Oracle Link"];
logDebug("Updated Oracle Link: " + oracleLink);
logDebug("End of script 5131_Lic_Update_Oracle_link.js");
}
//Record types for General business License
//Licenses/Business/*/*
//General Business license does not have a General Business number custom field and the Alt ID is the number.
else if(appMatch('Licenses/Business/*/*')){
logDebug("Start of script 5131_Lic_Update_Oracle_link.js");
// get general business license number
var envParameters = aa.util.newHashMap();
var genBusinessNumber = capId.getCustomID(); //pulling the record ALT ID number
var oracleURL = "http://doccity/cs/idcplg?IdcService=GET_SEARCH_RESULTS_FORCELOGIN&QueryText=" + genBusinessNumber;
logDebug("General Buiness Number: " + genBusinessNumber);
logDebug("Oracle Link: " + oracleURL);
//setCustomField(vFieldName,vFieldValue);
//setCustomField("Oracle Link", oracleURL);
editAppSpecific("Oracle Link", oracleURL);
var oracleLink = AInfo["Oracle Link"];
logDebug("Updated Oracle Link: " + oracleLink);
logDebug("End of script 5131_Lic_Update_Oracle_link.js");
}