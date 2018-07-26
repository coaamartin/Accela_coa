logDebug ("script 395 started")
var docCatCertReprt = checkIfDocUploaded("Certification Report");
var docCatPhotos = checkIfDocUploaded("Photos");

if(docCatCertReprt != false) {
    updateTask("Final Certification", "Review Report", "", "");
} else if(docCatPhotos != false) {
    updateTask("Active Permit", "Review Mitigation Photos", "", "");
}