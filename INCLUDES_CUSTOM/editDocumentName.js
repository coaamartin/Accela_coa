//Edit document name locally
function editDocumentName(vOrgDocumentName, vNewDocumentName) {
	var vDocumentList;
	var y;
	var vDocumentModel;
	var vDocumentName;
	var vSaveResult;
	
	vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
	if (vDocumentList != null) {
		vDocumentList = vDocumentList.getOutput();
	}
	else {
		return false;
	}

	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentName = vDocumentModel.getFileName();
			if (vDocumentName == vOrgDocumentName) {
				//edit document name in accela
				vDocumentModel.setFileName(vNewDocumentName);
				vSaveResult = aa.document.updateDocument(vDocumentModel);
				if (vSaveResult.getSuccess()) {
					logDebug("Renamed document " + vDocumentName + " to " + vNewDocumentName + vFileExtension);					
					return true;
				} else {
					logDebug("Failed to update report name");
					logDebug("Error: " + vSaveResult.getErrorMessage());
					return false;
				}
			}
		}
	}
	return false;
}