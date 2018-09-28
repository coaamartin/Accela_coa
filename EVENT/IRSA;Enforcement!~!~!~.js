//ajm added for testing
//deleteCadRows();

function deleteCadRows()
{
	 var cadQuery = getRemovedCADAddresses();

        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(cadQuery);
		//sStmt.setString(1, 'APD Caution');
        var rSet = sStmt.executeQuery();
        var counter = 0;
        while (rSet.next()) {
			counter = counter + 1;
			var refAddrid = rSet.getString("b1_contact_type");
			var conId = rSet.getString("Organizationname");

			logDebug("The Contact is: " + refAddrid);			
			logDebug("The Organization is: " + conId);
			//aa.addressCondition.removeAddressCondition(refAddrid, conId);
        }
        sStmt.close();
        conn.close();
	    logDebug("Done with this:" + counter);
		sendEmailToApplicant();
}

//Get addresses to be remove(It was removed from CAD).
function getRemovedCADAddresses()
{
	var altId = capId.getCustomID();
	var cadQuery = "exec spreport_ch_people_buildingmanager_subreport '" + altId + "'";
	return cadQuery;
}

function sendEmailToApplicant(){
  var contacts = "Applicant";
  var template = "PW_UPDATE_PLANS_FOR_LICENSE_AGREEMENT";
  var lictype = "Adrianlictype" + ""; //force string
  var wireless = "Adrianwireless" + ""; //force string
  var flagpole = "Adrianflagpoles" + ""; //force string
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$PERMITID$$", lictype)
  emailparams.put("$$TASKCOMMENTS$$", wireless);
  emailparams.put("$$PERMITADDR$$", flagpole);
  emailparams.put("$$PERMITWRKDESC$$", flagpole); 
  emailContacts(contacts, template, emailparams, "", "", "N", "");
}
//end ajm add

logDebug("DONB 101 " + capId)

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
    enfProcessInspResult("Snow Initial Inspection", "Visit/Attempted Contact", "Snow Initial Inspection", "nextWorkDay", true, "Initial Investigation", "Visit/Attempted Contact");
    enfProcessInspResult("Snow Initial Inspection", "Refer to Other Department", null, null, false, "Initial Investigation", "Refer to Other Department");
    enfProcessInspResult("Snow Initial Inspection", "Skip to Summons", "Summons Issuance", "nextWorkDay", true, "Initial Investigation", "Skip to Summons");
    enfProcessInspResult("Snow Initial Inspection", "Skip to City Abatement", "City Abatement Order", "nextWorkDay", true, "Initial Investigation", "Skip to City Abatement");
}

if(inspType == "Snow Warning Inspection"){
    //Script 346
    enfProcessInspResult("Snow Warning Inspection", "Snow Fee Posted", null, null, false, "Snow Warning Re-Inspect", "Snow Fee Posted");
    enfProcessInspResult("Snow Warning Inspection", "Snow Fee Served", null, null, false, "Snow Warning Re-Inspect", "Snow Fee Served");
    enfProcessInspResult("Snow Warning Inspection", "Snow Compliance", null, null, false, "Snow Warning Re-Inspect", "Snow Compliance");
    enfProcessInspResult("Snow Warning Inspection", "New Snow Extension", "Snow Warning Inspection", "nextWorkDay", true, "Snow Warning Re-Inspect", "New Snow Extension");
}

if(inspType == "Snow Fee 1st Re-Inspection"){
    //Script 346
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Snow Fee Posted", null, null, false, "Snow Fee 1st Re-Inspect", "Snow Fee Posted");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Snow Fee Served", null, null, false, "Snow Fee 1st Re-Inspect", "Snow Fee Served");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Taken and Stored", "Snow Fee 2nd Re-Inspection", "nextWorkDay", true, "Snow Fee 1st Re-Inspect", "Taken and Stored");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "Snow Compliance", null, null, false, "Snow Fee 1st Re-Inspect", "Snow Compliance");
    enfProcessInspResult("Snow Fee 1st Re-Inspection", "New Snow Extension", "Snow Fee 1st Re-Inspection", "nextWorkDay", true, "Snow Fee 1st Re-Inspect", "New Snow Extension");
}

if(inspType == "Snow Fee 2nd Re-Inspection"){
    //Script 346
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "Snow Compliance", null, null, false, "Snow Fee 2nd Re-Inspect", "Snow Compliance");
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "New Snow Extension", "Snow Fee 2nd Re-Inspection", "nextWorkDay", true, "Snow Fee 2nd Re-Inspect", "New Snow Extension");
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "Snow Abatement", null, null, false, "Snow Fee 2nd Re-Inspect", "Snow Abatement");
    enfProcessInspResult("Snow Fee 2nd Re-Inspection", "Snow Abate/Summons", null, null, false, "Snow Fee 2nd Re-Inspect", "Snow Abate/Summons");
}

if(inspType == "Initial Housing Inspection"){
    //Script 346
    enfProcessInspResult("Initial Housing Inspection", "Inspection Failed", "1st Housing Re-Inspection", "1st Re-Inspection Scheduled Date", false, "Initial Inspection", "Inspection Failed");
    enfProcessInspResult("Initial Housing Inspection", "Inspection Passed", null, null, false, "Initial Inspection", "Inspection Passed");
    enfProcessInspResult("Initial Housing Inspection", "Extension - Fee", "Initial Housing Inspection", "Initial Inspection Scheduled Date", false, "Initial Inspection", "Extension - Fee");
    enfProcessInspResult("Initial Housing Inspection", "Extension - No Fee", "Initial Housing Inspection", "Initial Inspection Scheduled Date", false, "Initial Inspection", "Extension - No Fee");
    enfProcessInspResult("Initial Housing Inspection", "No Show", "Initial Housing Inspection", "Initial Inspection Scheduled Date", false, "Initial Inspection", "No Show");
}

if(inspType == "1st Housing Re-Inspection"){
    //Script 346
    enfProcessInspResult("1st Housing Re-Inspection", "Inspection Failed", "2nd Housing Re-Inspection", "2nd Re-Inspection Scheduled Date", false, "1st Re-inspection","Inspection Failed");
    enfProcessInspResult("1st Housing Re-Inspection", "Inspection Passed", null, null, false, "1st Re-inspection","Inspection Passed");
    enfProcessInspResult("1st Housing Re-Inspection", "Extension - Fee", "1st Housing Re-Inspection", "1st Re-Inspection Scheduled Date", false, "1st Re-inspection","Extension - Fee");
    enfProcessInspResult("1st Housing Re-Inspection", "Extension - No Fee", "1st Housing Re-Inspection", "1st Re-Inspection Scheduled Date", false, "1st Re-inspection","Extension - No Fee");
}

if(inspType == "2nd Housing Re-Inspection"){
    //Script 346
    enfProcessInspResult("2nd Housing Re-Inspection", "Inspection Failed", "3rd Housing Re-Inspection", "3rd Re-Inspection Scheduled Date", false, "2nd Re-inspection", "Inspection Failed");
    enfProcessInspResult("2nd Housing Re-Inspection", "Inspection Passed", null, null, false, "2nd Re-inspection", "Inspection Passed");
    enfProcessInspResult("2nd Housing Re-Inspection", "Extension - Fee", "2nd Housing Re-Inspection", "2nd Re-Inspection Scheduled Date", false, "2nd Re-inspection", "Extension - Fee");
    enfProcessInspResult("2nd Housing Re-Inspection", "No Show", "2nd Housing Re-Inspection", "2nd Re-Inspection Scheduled Date", false, "2nd Re-inspection", "No Show");
}

if(inspType == "3rd Housing Re-Inspection"){
    //Script 346
    enfProcessInspResult("3rd Housing Re-Inspection", "Inspection Failed", "4th Housing Re-Inspection", "4th Re-Inspection Scheduled Date", false, "3rd Re-inspection", "Inspection Failed");
    enfProcessInspResult("3rd Housing Re-Inspection", "Inspection Passed", null, null, false, "3rd Re-inspection", "Inspection Passed");
    enfProcessInspResult("3rd Housing Re-Inspection", "Extension - Fee", "3rd Housing Re-Inspection", "3rd Re-Inspection Scheduled Date", false, "3rd Re-inspection", "Extension - Fee");
    enfProcessInspResult("3rd Housing Re-Inspection", "Extension - No Fee", "3rd Housing Re-Inspection", "3rd Re-Inspection Scheduled Date", false, "3rd Re-inspection", "Extension - No Fee");
}

if(inspType == "4th Housing Re-Inspection"){
    //Script 346
    enfProcessInspResult("4th Housing Re-Inspection", "Inspection Failed", null, null, false, "4th Re-inspection", "Inspection Failed");
    enfProcessInspResult("4th Housing Re-Inspection", "Inspection Passed", null, null, false, "4th Re-inspection", "Inspection Passed");
    enfProcessInspResult("4th Housing Re-Inspection", "Extension - Fee", "4th Housing Re-Inspection", "4th Re-Inspection Scheduled Date", false, "4th Re-inspection", "Extension - Fee");
    enfProcessInspResult("4th Housing Re-Inspection", "Extension - No Fee", "4th Housing Re-Inspection", "4th Re-Inspection Scheduled Date", false, "4th Re-inspection", "Extension - No Fee");
}

if(inspType == "Summons Issuance"){
    //Script 346
    enfProcessInspResult("Summons Issuance", "Taken and Stored - Summons", null, null, false, "Pre Summons Photos", "Taken and Stored - Summons");
    enfProcessInspResult("Summons Issuance", "Visit/Attempted Contact", null, null, false, "Summons Issuance", "Visit/Attempted Contact");
    enfProcessInspResult("Summons Issuance", "Personal Service", "Pre Court Action", 0, false, "Summons Issuance", "Personal Service");
    enfProcessInspResult("Summons Issuance", "Letter to be Sent", "Pre Court Action", 0, false, "Summons Issuance", "Letter to be Sent");
    enfProcessInspResult("Summons Issuance", "Compliance", null, null, false, "Summons Issuance", "Compliance");
    enfProcessInspResult("Summons Issuance", "Cancelled", null, null, false, "Summons Issuance", "Cancelled");
    enfProcessInspResult("Summons Issuance", "Taken and Stored - Citation", "Pre Court Action", "Pre Court Action", false, "Pre Summons Photos", "Taken and Stored - Citation");
    
    if(inspResult == "Taken and Stored - Citation" || inspResult == "Personal Service"){
        deactivateTask("Mail Summons");
    }
}

if(inspType == "Pre Court Action"){
    //Script 346
    enfProcessInspResult("Pre Court Action", "1 - Create Summons File", null, null, false, "Pre Court Action","1 - Create Summons File");
    enfProcessInspResult("Pre Court Action", "2 - Summons to Court Liaison", null, null, false, "Pre Court Action","2 - Summons to Court Liaison");
    enfProcessInspResult("Pre Court Action", "3 - File to Court Liaison", null, null, false, "Pre Court Action","3 - File to Court Liaison");
    enfProcessInspResult("Pre Court Action", "4 - Summons to Docketing", null, null, false, "Pre Court Action","4 - Summons to Docketing");
    enfProcessInspResult("Pre Court Action", "5 - Summons File to CA", "Pre Court Investigation", 0, false, "Pre Court Action","5 - Summons File to CA");
    enfProcessInspResult("Pre Court Action", "6 - Citation File to Liaison", null, null, false, "Pre Court Action","6 - Citation File to Liaison");
    enfProcessInspResult("Pre Court Action", "7 - Citation File to CA", "Pre Court Investigation", 0, false, "Pre Court Action","7 - Citation File to CA");
}

if(inspType == "Pre Court Inspection"){
    //Script 346
    enfProcessInspResult("Pre Court Inspection", "Compliance", null, null, false, "Pre Court Investigation", "Compliance");
    enfProcessInspResult("Pre Court Inspection", "Non-Compliance", null, null, false, "Pre Court Investigation", "Non-Compliance");
    enfProcessInspResult("Pre Court Inspection", "Unverifiable", null, null, false, "Pre Court Investigation", "Unverifiable");
}

if(inspType == "Legal Resolution"){
    //Script 346
    enfProcessInspResult("Legal Resolution", "Complete", null, null, false, "Legal Resolution", "Complete");
}

if(inspType == "NOV Recordation Photos"){
    //Script 346
    enfProcessInspResult("NOV Recordation Photos", "Taken and Stored ", null, null, false, "Recordation Photos", "Taken and Stored");
}

if(inspType == "NOV Release Inspection"){
    //Script 346
    enfProcessInspResult("NOV Release Inspection", "Compliance", null, null, false, "NOV Release Inspection", "Compliance");
    enfProcessInspResult("NOV Release Inspection", "Failed", "NOV Release Inspection", 90, false, "NOV Release Inspection", "Failed");
    enfProcessInspResult("NOV Release Inspection", "New Owner", null, null, false, "NOV Release Inspection", "New Owner");
}

if(inspType == "Board-Up Abatement Order"){
    //Script 346
    enfProcessInspResult("Board-Up Abatement Order", "Called In Service Request", null, null, false, "Abatement Request", "Called Service Request");
    enfProcessInspResult("Board-Up Abatement Order", "Taken and Stored", "Post Abatement Inspection", "nextWorkDay", false, "Pre Abatement Photos", "Taken and Stored");
}

if(inspType == "Graffiti Abatement Order"){
    //Script 346
    enfProcessInspResult("Graffiti Abatement Order", "Completed Service Request", null, null, false, "Abatement Request", "Completed Service Request");
    enfProcessInspResult("Graffiti Abatement Order", "Taken and Stored", "Post Abatement Inspection - Graffiti Only", 0, false, "Pre Abatement Photos", "Taken and Stored");
}

if(inspType == "Post Abatement Inspection"){
    //Script 346
    enfProcessInspResult("Post Abatement Inspection", "Rescheduled Upon Re-Inspect", null, null, false, "Post Abatement Photos", "Rescheduled upon Re-Inspect");
    enfProcessInspResult("Post Abatement Inspection", "Rescheduled", null, null, false, "Post Abatement Photos", "Rescheduled");
    enfProcessInspResult("Post Abatement Inspection", "Canceled", null, null, false, "Post Abatement Photos", "Canceled");
    
    if(inspResult == "Taken and Stored"){
        resultWorkflowTask("Post Abatement Photos", "Taken and Stored");
        var currDate = aa.util.parseDate(dateAdd(null, 0));
        var next3Days = aa.util.parseDate(dateAdd(null, 3));
        var inspDays = days_between(currDate, next3Days);
        scheduleInspection("Abatement Approval", inspDays);
    }
}

if(inspType == "Post Abatement Inspection - Graffiti Only"){
    //Script 
    enfProcessInspResult("Post Abatement Inspection - Graffiti Only", "Taken and Stored", "Abatement Approval", 0, false, "Post Abatement Photos", "Taken and Stored");
    enfProcessInspResult("Post Abatement Inspection - Graffiti Only", "Cancelled", null, null, false, "Post Abatement Photos", "Canceled");
}

if(inspType == "Snow Abatement Order"){
    //Script 346
    enfProcessInspResult("Snow Abatement Order", "Completed Service Request", null, null, false, "Abatement Request", "Completed Service Request");
    
    if(inspResult == "Taken and Stored"){
		
		
        var currDate = aa.util.parseDate(dateAdd(null, 0));
		var nextWD = nextWorkDay(dateAdd(null, 2 - 1));
        numOfDays4Insp = days_between(currDate, aa.util.parseDate(nextWD));
        scheduleInspection("Post Abatement Inspection", numOfDays4Insp);
        resultWorkflowTask("Pre Abatement Photos", "Taken and Stored");
    }
}

if(inspType == "Abatement Approval"){
    //Script 346
    enfProcessInspResult("Abatement Approval", "Bill and Photo Denied", "Abatement Approval", "nextWorkDay", false, "Abatement Approval", "Bill and Photo Denied");
    enfProcessInspResult("Abatement Approval", "Invoice Approved", null, null, false, "Abatement Approval", "Invoice Approved");
    enfProcessInspResult("Abatement Approval", "Invoice Denied", "Abatement Approval", "nextWorkDay", false, "Abatement Approval", "Invoice Denied");
    enfProcessInspResult("Abatement Approval", "Graffiti Abatement Redo", "Post Abatement Inspection - Graffiti Only", 0, false, "Abatement Approval", "Graffiti Abatement Redo");
    
    if(inspResult == "Bill and Photo Approved"){
		resultWorkflowTask("Abatement Approval", "Bill and Photo Approved");
        var currDate = aa.util.parseDate(dateAdd(null, 0));
        var next10Days = aa.util.parseDate(nextWorkDay(dateAdd(null, 9)));
        var inspDays = days_between(currDate, next10Days);
        //scheduleInspection("Abatement Approval", inspDays);
        var iObjResult = aa.inspection.getInspection(capId, inspId);
        if(!iObjResult.getSuccess()) logDebug("Unable to get inspection object to update schedule date");
        else {
            var iObj = iObjResult.getOutput();
            iObj.setScheduledDate(aa.date.parseDate(dateAdd(null, inspDays)));
            aa.inspection.editInspection(iObj)
        }
    }
}

if(inspType == "City Abatement Order"){
    //Script 346
    enfProcessInspResult("City Abatement Order", "Completed Service Request", null, null, false, "Abatement Request", "Completed Service Request");
    enfProcessInspResult("City Abatement Order", "Called in Service Request", null, null, false, "Abatement Request", "Called in Service Request");
    
    if(inspResult == "Taken and Stored"){
        var inspDays = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(dateAdd(null, 3, true)));
        scheduleInspection("Post Abatement Inspection", inspDays);
        var wfTsk = "Pre Abatement Photos";
        var wfSts = "Taken and Stored";
        if(!isTaskActive(wfTsk)) activateTask(wfTsk);
            resultWorkflowTask(wfTsk, wfSts, "", "");
    }
}

if(inspType == "Regular Abatement Order"){
    //Script 346
    enfProcessInspResult("Regular Abatement Order", "Completed Service Request", null, null, false, "Abatement Request", "Completed Service Request");
    enfProcessInspResult("Regular Abatement Order", "Called in Service Request", null, null, false, "Abatement Request", "Called in Service Request");
    
    if(inspResult == "Taken and Stored"){
        var inspDays = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(dateAdd(null, 3, true)));
        scheduleInspection("Post Abatement Inspection", inspDays);
        var wfTsk = "Pre Abatement Photos";
        var wfSts = "Taken and Stored";
        if(!isTaskActive(wfTsk)) activateTask(wfTsk);
        resultWorkflowTask(wfTsk, wfSts, "", "");
    }
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
    closeTaskByCapId("Investigation","No Violation Found","","",parentArray[thisParent]);
    }
}
if (inspType == "Initial Investigation" && inspResult == "In Violation") 
    {
    closeTask("Initial Investigation","In Violation","Updated by Inspection Result","Note");
    }
if (inspType == "Initial Investigation" && inspResult == "Citation") 
    {
    loopTask("Initial Investigation","Recommend Citation","Updated by Inspection Result","Note");
    }
if(inspType == "Follow-Up Investigation" && inspResult == "Compliant")
    {
    branchTask("Follow-Up Investigation","Violation Corrected","Updated by Inspection Result","Note");
    closeTask("Case Closed","Closed","","");
    if (parentArray && parentArray.length > 0)
        {
        for (thisParent in parentArray)
            if (parentArray[thisParent])
            {
            closeTaskByCapId("Investigation","Corrected","","",parentArray[thisParent]);
            }
        }
    }
if (inspType == "Follow-Up Investigation" && inspResult == "Citation") 
    {
    closeTask("Follow-Up Investigation","Recommend Citation","Updated by Inspection Result","Note");
    }
if(inspType == "Follow-Up Investigation" && inspResult == "Abated")
    {
    branchTask("Follow-Up Investigation","Violation Abated","Updated by Inspection Result","Note");
    closeTask("Case Closed","Closed","","");
    if (parentArray && parentArray.length > 0)
        {
        for (thisParent in parentArray)
            {
            if (parentArray[thisParent])
                {
                closeTaskByCapId("Investigation","Corrected","","",parentArray[thisParent]);
                }
            }
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
if (inspResult == "Skip to Summons" || inspResult == "Snow Abate/Summons" || inspResult == "Abate/Summons" ||
    inspResult == "Issue Summons" || inspResult == "Citation/Summons")
{
    logDebug("Script 343: criteria met");
    
    // get the inspector from GIS and assign the rec to this user
    inspUserObj = null;
    x = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","OFFICER_NAME");
    if(x[0]){
        logDebug(x[0]["OFFICER_NAME"]);
        
        var offFullName = x[0]["OFFICER_NAME"];
        
        var offFname = offFullName.substr(0,offFullName.indexOf(' '));
        logDebug(offFname);
        
        var offLname = offFullName.substr(offFullName.indexOf(' ')+1);
        logDebug(offLname);
        
        inspUserObj = aa.person.getUser(offFname,null,offLname).getOutput();
    }
    
    //var currentCapId = capId;
    var appName = "Summons created for Record Number " + capId.customID;
    var newChildCapId = createChild('Enforcement','Incident','Summons','NA',appName);
    var appHierarchy = aa.cap.createAppHierarchy(capId, newChildCapId);
    copyRecordDetailsLocal(capId, newChildCapId);
    
    copyAddresses(capId, newChildCapId);
    copyParcels(capId, newChildCapId);
    copyOwner(capId, newChildCapId);
    
    if(inspUserObj != null) 
        assignCap(inspUserObj.getUserID(), newChildCapId);
    
    var newInspId = scheduleInspectionCustom4CapId(newChildCapId, "Summons Issuance",0, currentUserID);
    
    if(newInspId) {
        var clItemStatus2Copy = ['Summons', 'Abate/Summons', 'Record/Summons', 'Citation/Summons'];
        
        if(clItemStatus2Copy.length > 0) copyCheckListByItemStatus(inspId, newInspId, clItemStatus2Copy, capId, newChildCapId);
    }
}           
logDebug("Script 343 END");

//*********************************************************************************************************
//script 344        Create Child Abatement
//
//Record Types:     Enforcement/*/*/*
//Event:            IRSA
//Desc:             Create Child Record and schedule same day inspection when the inspection is resulted 
//                  "Skip to Summons" Enforcement/Incident/Zoning/NA Enforcement/Incident/Snow/NA 
//                  Enforcement/Incident/Housing/NA SEE ATTACHMENT FOR SCRIPT SPECIFICATIONS
//
//Created By:       Silver Lining Solutions
//*********************************************************************************************************
logDebug("Script 344 START");

createChildAbatement("Zoning Initial Inspection",       "Skip to City Abatement",   "City Abatement Order",     "City");
createChildAbatement("Zoning Follow-Up Inspection",     "Skip to City Abatement",   "City Abatement Order",     "City");
createChildAbatement("Graffiti Follow-Up Inspection",   "Skip to City Abatement",   "City Abatement Order",     "City");

createChildAbatement("Zoning Final Inspection",         "Abate/Record",             "Regular Abatement Order",  "Regular");
createChildAbatement("Zoning Final Inspection",         "Abate/Summons",            "Regular Abatement Order",  "Regular");
createChildAbatement("Zoning Final Inspection",         "Abatement",                "Regular Abatement Order",  "Regular");

createChildAbatement("Board-Up Final Inspection",       "Abate/Record",             "Board-Up Abatement Order", "Board-Up");
createChildAbatement("Board-Up Final Inspection",       "Abate/Summons",            "Board-Up Abatement Order", "Board-Up");
createChildAbatement("Board-Up Final Inspection",       "Abatement",                "Board-Up Abatement Order", "Board-Up");

createChildAbatement("Graffiti Final Inspection",       "Abate/Summons",            "Graffiti Abatement Order", "Graffiti");
createChildAbatement("Graffiti Final Inspection",       "Abatement",                "Graffiti Abatement Order", "Graffiti");

createChildAbatement("Snow Initial Inspection",         "Skip to City Abatement",   "City Abatement Order",     "City");
createChildAbatement("Snow Fee 2nd Re-Inspection",      "Snow Abate/Summons",       "Snow Abatement Order",     "Snow");
createChildAbatement("Snow Fee 2nd Re-Inspection",      "Snow Abatement",           "Snow Abatement Order",     "Snow");
          
logDebug("Script 344 END");

//*********************************************************************************************************
//script 345        Create Recordation Child
//
//Record Types:     Enforcement/*/*/*
//Event:            IRSA
//Desc:             Create Child Recordation
//
//Created By:       Silver Lining Solutions
//*********************************************************************************************************
logDebug("Script 345 START");
if (inspResult == "Abate/Record" || inspResult == "Record with County" )
{
    logDebug("Script 345: criteria met");
    
    // get the inspector from GIS and assign the rec to this user
    inspUserObj = null;
    x = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","OFFICER_NAME");
    if(x[0]){
        logDebug(x[0]["OFFICER_NAME"]);
        
        var offFullName = x[0]["OFFICER_NAME"];
        
        var offFname = offFullName.substr(0,offFullName.indexOf(' '));
        logDebug(offFname);
        
        var offLname = offFullName.substr(offFullName.indexOf(' ')+1);
        logDebug(offLname);
        
        inspUserObj = aa.person.getUser(offFname,null,offLname).getOutput();
    }
    
    var appName = "Recordation created for Record Number " + capId.customID;
    var newChildCapId = createChild('Enforcement','Incident','Record with County','NA',appName);
    var appHierarchy = aa.cap.createAppHierarchy(capId, newChildCapId);
    copyRecordDetailsLocal(capId, newChildCapId);
    copyContacts(capId, newChildCapId);
    copyAddresses(capId, newChildCapId);
    copyParcels(capId, newChildCapId);
    copyOwner(capId, newChildCapId);
    
    if(inspUserObj != null) 
        assignCap(inspUserObj.getUserID(), newChildCapId);
    
    var newInspId = scheduleInspectionCustom4CapId(newChildCapId, "NOV Recordation Photos",0, currentUserID);
    
    if(newInspId) {
        var clItemStatus2Copy = ["Abate/Record", "Record/Summons", "Record"];
        
        if(clItemStatus2Copy.length > 0) copyCheckListByItemStatus(inspId, newInspId, clItemStatus2Copy, capId, newChildCapId);
    }
}           
logDebug("Script 345 END");
