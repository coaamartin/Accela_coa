//Start Core Renewal Functionality
if (parentCapId == "undefined" || parentCapId == null) {
	parentCapId = aa.env.getValue("ParentCapID");
}

var vGoodToRenew;
var vOrgCapId;

//Setup/Check renewal
vGoodToRenew = prepareRenewal();
if (parentCapId != null && vGoodToRenew) {
		
	//Copy Parcels from license to renewal
	copyParcels(parentCapId,capId);
	
	//Copy addresses from license to renewal
	copyAddress(parentCapId,capId);
	
	//copy ASI Info from license to renewal
	copyASIInfo(parentCapId,capId);

	//Copy ASIT from license to renewal
	copyASITables(parentCapId,capId);

	//Copy Contacts from license to renewal
	copyContacts3_0(parentCapId,capId);
	
	//Copy Work Description from license to renewal
	aa.cap.copyCapWorkDesInfo(parentCapId,capId);

	//Copy application name from license to renewal
	editAppName(getAppName(parentCapId),capId);
}
//End Core Renewal Functionality
