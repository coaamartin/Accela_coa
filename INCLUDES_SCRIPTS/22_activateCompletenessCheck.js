(function() {
    var idx,
        docListArray,
        doc,
        docCat;


logDebug("one");
    docListArray = getDocumentList();
    for (var idx in docListArray) {
        doc = docListArray[idx];
        docCat = doc.docCategory;
        logDebug(docCat);
        printObjProperties(doc);
    }
})(); 