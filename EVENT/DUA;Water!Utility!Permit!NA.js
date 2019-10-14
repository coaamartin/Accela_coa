//SWAKIL
var docCatCertReprt = checkIfDocUploaded("Asset Numbering Plan");
if(docCatCertReprt != false) {
	updateAppStatus("Verify Testing","");
	activateTask("Verify Materials Testing");
} 
