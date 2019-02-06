// Renewal processing - testing to see if this works for CTRCA

logDebug ("About to prepareAppForRenewal");

prepareAppForRenewal();
include ("CONVERTTOREALCAPAFTER4RENEW");

//Begin script to assess late fees delinquent MJ renewal
//include("313_AddExpiredRenewalLateFeeMJ");
//End script to assess late fees delinquent MJ renewal