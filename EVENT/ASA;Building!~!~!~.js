logDebug("Adding Fee");
if(!appMatch("Building/Permit/New Building/NA"))
    addFee("BLD_PNP_06","BLD_PNP","FINAL",1,"Y");


if (matches(currentUserID,"ADMIN")) {
showDebug = false;
showMessage= false;
}
include("EMSE:SETCONTACTRELATIONSHIPTOCONTACTTYPE");
if (matches(currentUserID,"PUBLICUSER122")) {
include("TESTDRIVE_ASA");
}
editAppSpecific("Application Expiration Date",dateAdd(fileDate,180));

script16_FillApplicationNameWhenEmpty();
script185_UpdateAppExpDate180Days();
