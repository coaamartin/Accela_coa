function getDocModel4Link(dCategory){
    var vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
    if (vDocumentList != null) {
        vDocumentList = vDocumentList.getOutput();
    }
    if (vDocumentList != null) {
        for (y = 0; y < vDocumentList.size(); y++) {
            vDocumentModel = vDocumentList.get(y);
            vDocumentName = vDocumentModel.getFileName();
            vDocumentCat  = vDocumentModel.getDocCategory();
            if (vDocumentCat == dCategory) {
                return vDocumentModel;
            }
        }
    }
    
    return null;
}