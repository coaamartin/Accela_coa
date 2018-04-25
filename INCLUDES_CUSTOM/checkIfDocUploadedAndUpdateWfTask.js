/**
 * checks if the document of type @DocumentType is uploaded and then updates the wf tasks with Status "Resubmittal Requested" to the new status @newStatus and activate it
 * @Param DocumentType {string}
 * @Param newStatus {string}
 */
function checkIfDocUploadedAndUpdateWfTask(DocumentType,newStatus){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory!=null && documentCategory.equals(DocumentType)){
			 setWFStatusAndActivate(newStatus);
			 break;
	      }
	}
}