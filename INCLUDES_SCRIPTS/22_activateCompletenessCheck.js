(function() {
    var idxDocs,
        docListArray,
        doc,
        docCat,
        asiGroups,
        idxAsiGrps;


//     docListArray = getDocumentList();
//     for (idxDocs in docListArray) {
//         doc = docListArray[idxDocs];
//         docCat = doc.docCategory;
//         logDebug(docCat);
//  //       printObjProps(doc);
//     }

//printObjProps(capId);
// printObjProps(cap);
// printObjProps(cap.capModel);

//var capModel =  aa.cap.getCap(capId).getOutput().getCapModel();

    asiGroups = cap.capModel.getAppSpecificInfoGroups()
    for (idxAsiGrps in asiGroups) {
       // doc = docListArray[idxAsiGrps];
      //  docCat = doc.docCategory;
    //    logDebug(docListArray[idxAsiGrps]);
        printObjProps(docListArray[idxAsiGrps]);
    }

    var idxAsiGrps= cap.capModel.getAppSpecificInfoGroups().iterator();
    while (i.hasNext())
    {
        var group = i.next();
        printObjProps(group);

    }
})(); 