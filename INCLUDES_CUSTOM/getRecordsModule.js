function getRecordsModule(vCapId) {
	var vCap = aa.cap.getCap(vCapId);
	var vModule = "";
	if (vCap.getSuccess()) {
		vCap = vCap.getOutput();
		vModule = vCap.getCapModel().getModuleName();
	}
	return vModule;
}