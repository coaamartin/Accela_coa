
/**
 * Link latest uploaded documents fromCap toCap
 * @param fromCapId src cap
 * @param toCapId dest cap
 * @param {Array} docTypesArray document types to link
 */
function linkDocuments(fromCapId, toCapId, docTypesArray) {
	var docsArray = aa.document.getCapDocumentList(fromCapId, aa.getAuditID()).getOutput();
	var latestUploadedDoc = null;
	for (t in docTypesArray) {
		for (d in docsArray) {
			var documentModel = docsArray[d];
			if (docTypesArray[t] == documentModel.getDocCategory()) {
				reqDocModel = documentModel;
				if (latestUploadedDoc == null) {
					latestUploadedDoc = documentModel;
				} else {
					var docModelUploadDate = aa.util.formatDate(documentModel.getFileUpLoadDate(), "MM/dd/YYYY");
					var latestUploadDate = aa.util.formatDate(latestUploadedDoc.getFileUpLoadDate(), "MM/dd/YYYY");
					if (dateDiff(docModelUploadDate, latestUploadDate) < 0) {
						latestUploadedDoc = documentModel;
					}
				}
			}//doc type match
		}//for all docs
		if (latestUploadedDoc != null) {
			aa.document.createDocumentAssociation(latestUploadedDoc, toCapId, "CAP");
			latestUploadedDoc = null;
		}
	}//for all types required
}