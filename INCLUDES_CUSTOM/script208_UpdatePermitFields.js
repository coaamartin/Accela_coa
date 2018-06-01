//script208_UpdatePermitFields
//Record Types:	Building/Permit/*/* (EXCEPT Building/Permit/Master/NA)
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: If wfTask = Permit Issuance and wfStatus = “Issued”, then insert the current date into the permit issue date custom field 
//		and current date + 180 days into the permit expiration date field.  
//Created By: Silver Lining Solutions

function script208_UpdatePermitFields() {
	
	logDebug("script208_UpdatePermitFields  started.");
	try{
		if (!appMatch("Building/Permit/Master/NA")) {
			logDebug("script208_not a Master Rec Type.");
			if (wfTask==("Permit Issuance") && wfStatus ==("Issued")) {
				logDebug("script208_correct Task/Status.");
				var sysDateYYYYMMDD = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"YYYY-MM-DD");
				editAppSpecific("Permit Issued Date",sysDateYYYYMMDD);
				editAppSpecific("Permit Expiration Date",dateAdd(null,180));
				logDebug("script208_Updating asi fields.");
			}
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script208_UpdatePermitFields . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script208_UpdatePermitFields . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Building/Permit/*/* 208: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script208_UpdatePermitFields  ended.");
//	if function is used        };//END WTUA:Building/Permit/*/* ;

}