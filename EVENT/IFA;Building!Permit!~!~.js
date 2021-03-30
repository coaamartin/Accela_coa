/*
Invoice Fee After
*/


//jmain 06-01-2018  
if(!appMatch("Building/Permit/DonationBin/*") && !appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*")) {
include("5043_BuildingEmailnvoicedFees");
}