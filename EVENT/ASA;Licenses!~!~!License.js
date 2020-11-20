//Running 2059_TmpPermitExpirationDate
if (appMatch("Licenses/Supplemental/Seasonal Licenses/License")){
logDebug("Starting Script to Set Temporary Expiration Date");
updateShortNotes(AInfo['Type of License']);
include("2059_TmpPermitExpiraitionDate");
logDebug("End of 2059_TmpPermitExpirationDate script");
}