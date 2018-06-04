//script381_UpdatCustomFieldPermitExpirationDates
//Record Types:	Building/Permit/New Construction/NA; Building/Permit/Plans/NA; Building/Permit/No Plans/NABuilding/Permit/*/* (EXCEPT Building/Permit/Master/NA)
//Event: PRA - PaymentReceivedAfter
//Desc: Payment Recieved After, update the Custom Field ‘Permit Expiration Date’ with Today's date + 180 days  

//Created By: Silver Lining Solutions

function script381_UpdatCustomFieldPermitExpirationDates(){
	
	logDebug("script381_UpdatCustomFieldPermitExpirationDates  started.");
	try{
		if (!appMatch("Building/Permit/Master/NA")) {
				editAppSpecific("Permit Issued Date",dateAdd(null,0));		
				editAppSpecific("Permit Expiration Date",dateAdd(null,180));
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script381_UpdatCustomFieldPermitExpirationDates . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script381_UpdatCustomFieldPermitExpirationDates . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: PRA:Building/Permit/*/* 381: " + err.message); 
		logDebug(err.stack)
	}
	logDebug("script381_UpdatCustomFieldPermitExpirationDates  ended.");
//	if function is used        };//END PRA:Building/Permit/*/* ;

}