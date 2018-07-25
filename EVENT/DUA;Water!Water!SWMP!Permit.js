logDebug ("script 395 started")
var docCategory = checkIfDocUploaded("Certification Report");

if(docCategory != false) {
    updateTask("Final Certification", "Review Report", "", "");
}
