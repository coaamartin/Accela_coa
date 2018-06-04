//Script 31
//Record Types:	Planning/Special Request/Zoning Inquiry/NA
//Event: 		CTRCA(ACA) or ASA(Civic Platform)
//Desc:			For Planning/Special Request/Zoning Inquiry/NA Calculate Custom Field 
//				Expiration Date at 30 working days from date application is submitted.
//				Action:	on ASA set ASI field Expiration Date today+30.
//Created By: Silver Lining Solutions

function script31_CalcCustomExpDate() {
	logDebug("script31_CalcCustomExpDate() started.");
	try{
//		logDebug("today is: "+sysDateMMDDYYYY);
//		logDebug("and adding 30 working days makes it: "+ dateAddHC(sysDateMMDDYYYY, 30, 'Y'));
		editAppSpecific("Expiration Date", dateAddHC(sysDateMMDDYYYY, 30, 'Y'));		
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script31_CalcCustomExpDate(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script31_CalcCustomExpDate(). Please contact administrator. Err: " + err);
	}
	logDebug("script31_CalcCustomExpDate() ended.");
}//END script31_CalcCustomExpDate()
