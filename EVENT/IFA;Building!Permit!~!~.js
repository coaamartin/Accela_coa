/*
Invoice Fee After
*/

//jmain 06-01-2018  
if(appMatch("Building/Permit/OTC/*")) {
logDubug("IFA event for Building Permits OTC")
include("5043_BuildingEmailnvoicedFees");

}