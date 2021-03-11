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

logDebug("Start of script 5131_Lic_Update_Oracle_link.js");
// get general business license number
var envParameters = aa.util.newHashMap();
var genBusinessNumber = AInfo["General Business License Number"];
var oracleURL = link("http://doccity/cs/idcplg?IdcService=GET_SEARCH_RESULTS_FORCELOGIN&QueryText=" + genBusinessNumber);
logDebug("General Buiness Number: " + genBusinessNumber);
logDebug("Oracle Link: " + oracleURL);
//setCustomField(vFieldName,vFieldValue);
//setCustomField("Oracle Link", oracleURL);
editAppSpecific("Oracle Link", oracleURL);
var oracleLink = AInfo["Oracle Link"];
logDebug("Updated Oracle Link: " + oracleLink);
logDebug("End of script 5131_Lic_Update_Oracle_link.js");