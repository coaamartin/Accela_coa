(function() {
    var idx,
        doc,
        docCat;

    for (var idx in documentModelArray) {
        doc = documentModelArray[idx];
        docCat = doc.getDocCategory();
 logDebug(docCat);
    }
})(); 