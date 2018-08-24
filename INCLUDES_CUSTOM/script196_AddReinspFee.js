/* -------------------------------------------------------------
script196_AddReinspFee
Record Types:	Water/Water/Lawn Irrigation/Permit
Event: IRSA - InspectionResultSubmitAfter
Desc: When an inspection status = “Fail”

		Status wf step Inspection = Re-inspection required,
		deactiate inspection wf task,
		activate Fee Processing wf task,
		add another inspection fee, 
		email the owner and applicant about needing to schedule another inspection.
		If the custom field “Type of Property” has a value of “Single Family Residential” 
			then add the re-inspection fee with an amount of $30.75 dollars(Fee code WAT_IP_03).
		If the custom field “Type of Property” has a value of “Other” 
			then add the re-inspection fee with an amount of $138 dollars(Fee code WAT_IP_03 ).

Created By: Silver Lining Solutions
------------------------------------------------------------ */
function script196_AddReinspFee() {
	
	logDebug("script196_AddReinspFee started.");
	try { 
		if (inspResult == "Fail") {
			updateTask("Inspection","Reinspection Required","updated by script","updated by script");
			deactivateTask("Inspection");
			activateTask("Fee Processing");


// set up email notification params
			var iCon = null; 
			var contactArray = new Array(); 
			var contactArray = getContactArray(); 
			var ApplEml = null;
			for (iCon in contactArray) {
				if ( contactArray[iCon].contactType == "Applicant" ) { 
				ApplEml = contactArray[iCon].email; break; }
			}
			capOwnerResult = aa.owner.getOwnerByCapId(capId);
			var OwnerEml = null;
			if (capOwnerResult.getSuccess()) {
				owner = capOwnerResult.getOutput();
				for (o in owner) {
					thisOwner = owner[o];
					if (thisOwner.getPrimaryOwner() == "Y") {
						OwnerEml = thisOwner.email;
						break;	
					}
				}
			}
			var emlTmplt = "IP LAWN IRRIGATION INSPECTION FAILED #160";
			var emailParameters = aa.util.newHashtable();
			emailParameters.put("$$ContactEmail$$", "");
			var acaUrl = "https://awebdev.aurora.city/CitizenAccess/";
			getRecordParams4Notification(emailParameters); getACARecordParam4Notification(emailParameters,acaUrl);
			var reportFile = [];
			var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
			emailParameters.put("$$ContactEmail$$", "");

// email the applicant and owner 
			if ( ApplEml != null && ApplEml.length() > 0 ) {
				emailParameters.put("$$ContactEmail$$",ApplEml);
				var sendResult = sendNotification("noreply@aurora.gov",ApplEml,"",emlTmplt,emailParameters,reportFile,capID4Email);
				if (!sendResult) { logDebug("script196: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
				else { logDebug("script196: Sent email notification that work order is complete to "+ApplEml)}
			}
			if ( OwnerEml != null && OwnerEml.length() > 0 ) {
				emailParameters.put("$$ContactEmail$$",OwnerEml);
				var sendResult = sendNotification("noreply@aurora.gov",OwnerEml,"",emlTmplt,emailParameters,reportFile,capID4Email);
				if (!sendResult) { logDebug("script196: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
				else { logDebug("script196: Sent email notification that work order is complete to "+OwnerEml)}
			}

// update or create fee
			if (AInfo["Type of Property"] == "Single Family Residential") {
				var thisFeeAmt = 30.75;
				updateFee("WAT_IP_03","WAT_IP","FINAL",thisFeeAmt,"Y");
			}
			if (AInfo["Type of Property"] == "Other") {
				var thisFeeAmt = 138.00;
				updateFee("WAT_IP_03","WAT_IP","FINAL",thisFeeAmt,"Y");
			}
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script196_AddReinspFee. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script196_AddReinspFee. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Water/Water/Lawn Irrigation/Permit 196: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script196_AddReinspFee ended.");
//	if function is used        	};//END IRSA:Water/Water/Lawn Irrigation/Permit;
}
