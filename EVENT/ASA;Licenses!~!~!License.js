//Running 2059_TmpPermitExpirationDate
if (appMatch("Licenses/Supplemental/Seasonal License/License")){
logDebug("Starting Script to Set Temporary Expiration Date");
updateShortNotes(AInfo['Type of License']);
include("2059_TmpPermitExpirationDate");
logDebug("End of 2059_TmpPermitExpirationDate script");
}