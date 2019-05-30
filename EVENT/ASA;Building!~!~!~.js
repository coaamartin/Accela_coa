logDebug("Adding Fee");
//updated 5/29/19 Keith - OTC permits should not be getting this Base Fee.
if(!appMatch("Building/Permit/New Building/NA") && !appMatch("Building/Permit/OTC/*"))
    addFee("BLD_PNP_06","BLD_PNP","FINAL",1,"Y");

// 5/29/19 Kieth - Why are we setting Debug to false here?? I should only be done in one place in the EMSE globals!
//if (matches(currentUserID,"ADMIN")) {
//showDebug = false;
//showMessage= false;
//}

include("EMSE:SETCONTACTRELATIONSHIPTOCONTACTTYPE");
if (matches(currentUserID,"PUBLICUSER122")) {
include("TESTDRIVE_ASA");
}
editAppSpecific("Application Expiration Date",dateAdd(fileDate,180));

//script16_FillApplicationNameWhenEmpty();

script185_UpdateAppExpDate180Days();
