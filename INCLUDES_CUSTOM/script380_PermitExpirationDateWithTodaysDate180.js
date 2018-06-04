//script380_UpdatCustomFieldPermitExpirationDates
//Record Types:	Building/Permit/New Construction/NA; Building/Permit/Plans/NA; Building/Permit/No Plans/NABuilding/Permit/*/* (EXCEPT Building/Permit/Master/NA)
//Event: IRSA - PaymentReceivedAfter
//Desc: Payment Recieved After, update the Custom Field ‘Permit Expiration Date’ with Today's date + 180 days  

//Created By: Silver Lining Solutions

function script380_PermitExpirationDateWithTodaysDate180(){
	
	logDebug("script380_PermitExpirationDateWithTodaysDate180  started.");
	try{
		
		if (inspResult !="Canceled") {
				editAppSpecific("Permit Expiration Date",dateAdd(null,180));
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script380_PermitExpirationDateWithTodaysDate180 . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script380_PermitExpirationDateWithTodaysDate180 . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: IRSA:Building/Permit/*/* 380: " + err.message); 
		logDebug(err.stack)
	}
	logDebug("script380_PermitExpirationDateWithTodaysDate180  ended.");
//	if function is used        };//END PRA:Building/Permit/*/* ;

}
