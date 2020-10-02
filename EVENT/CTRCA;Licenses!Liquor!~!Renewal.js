//Run script to set ALTID for child renewal record.
include("2054_CreateLicenseRenewal");
logDebug("Starting License Fees for Liquor License");
include("2057_LicenseFees");
logDebug("Ending License Fees for Liquor License");