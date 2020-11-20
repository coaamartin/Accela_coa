//Running 2059_TmpPermitExpirationDate
if (appMatch("Licensing/Supplemental/Seasonal License/License")){
logDebug("Starting Script to Set Temporary Expiration Date");
updateShortNotes(AInfo['Type of License']);
include("2059_TmpPermitExpirationDate");
logDebug("End of 2059_TmpPermitExpirationDate script");
}