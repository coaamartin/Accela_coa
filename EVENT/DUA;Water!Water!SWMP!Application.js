logDebug ("script 395 started")
var docCatCertReprt = checkIfDocUploaded("Certification Report");
var docCatPhotos = checkIfDocUploaded("Photos");

if(docCatCertReprt != false) {
	activateTask("Final Certification")
    updateTask("Final Certification", "Review Report", "", "");
} else if(docCatPhotos != false) {
    updateTask("Active Permit", "Review Mitigation Photos", "", "");
}

//SWAKIL
include("3001_Water_DocUpload");