// SCRIPTNUMBER: 5106
// SCRIPTFILENAME: 5106_VacantMasterCTRCA.js
// PURPOSE: Called when Enforcement Vacant Master record submitted from ACA.  Populates application name with address.
// DATECREATED: 04/18/2019
// BY: amartin
// CHANGELOG: 

logDebug("---------------------> At start of 5106 CTRCA");

var adResult = aa.address.getPrimaryAddressByCapID(capId,"Y");
addressLine = adResult.getOutput().getAddressModel();
logDebug("---------------------> addressLine " + addressLine);	

editAppName(addressLine,capId);


logDebug("---------------------> At end of 5106 CTRCA");
aa.sendMail("amartin@auroragov.org", "amartin@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);