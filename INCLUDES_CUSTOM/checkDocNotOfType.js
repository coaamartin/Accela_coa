/* check if at least one document is not of document type */
function checkDocNotOfType(DocumentType){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory != null && !documentCategory.equals(DocumentType)){
			//logDebug("DocumentType " + documentCategory);
			 return true;
	    }
		else 
		    return false;
	}
}