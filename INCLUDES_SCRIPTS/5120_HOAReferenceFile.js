// SCRIPTNUMBER: 5120
// SCRIPTFILENAME: 5120_HOAReferenceFile.js
// PURPOSE: Called when HOA record has been created.  This will auto increment the Reference File number.
// DATECREATED: 06/11/2020
// BY: rprovinc
// CHANGELOG: 06/11/2020: created

logDebug("At start of 5120");
//Need to add logic to pull SQL data for highest Reference File number and increment by one.	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("Starting email communication");	 
logDebug("Script 5120_HOAReferenceFile.js")
	// send the email
	var envParameters = aa.util.newHashMap();
    var hoaName = AInfo["Name of HOA"];
    var refNum = AInfo["Refrence Number"];
    //Below will be incrementing the number by one.
    var refNumNew = (refNum + 1);
    //Below need to add the number to Reference file number to the record. 
        //May need to create an insert statement here.
        var insertStatement = "test";



	// envParameters.put("capId", capId);
	// envParameters.put("cap", cap);
	// envParameters.put("AGENCYID", "AURORACO");
	// envParameters.put("HOANAME", hoaName);
	// var vAsyncScript = "SEND_HOA_RENEW_EMAIL";
	// aa.runAsyncScript(vAsyncScript, envParameters)
	logDebug("CapID info: " + envParameters);
	logDebug("Name of HOA: " + hoaName);
	logDebug("End of Script 5120_HOAReferenceFile.js");

}