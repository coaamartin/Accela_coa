
function checkIfDocUploaded(DocumentType){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory!=null && documentCategory.equals(DocumentType)){
			//logDebug("DocumentType " + documentCategory);
			 return documentCategory;
	      }
		  else 
		  return false;
	}
}