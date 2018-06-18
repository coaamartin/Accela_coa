(function() {
    var idxDocs,
        docListArray,
        doc,
        docCat,
        group,
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

    // asiGroups = cap.capModel.getAppSpecificInfoGroups()
    // for (idxAsiGrps in asiGroups) {
    //    // doc = docListArray[idxAsiGrps];
    //   //  docCat = doc.docCategory;
    // //    logDebug(docListArray[idxAsiGrps]);
    //     printObjProps(docListArray[idxAsiGrps]);
    // }

    var idxAsiGrps= cap.capModel.getAppSpecificInfoGroups().iterator();
    while (idxAsiGrps.hasNext())
    {
        var group = idxAsiGrps.next();
        if(group.groupName.toUpperCase().indexOf('SUPPORTING DOCUMENT') > -1 ) {
            printObjProps(group);
            var fields = group.getFields();
            if (fields != null)
	        {
                var iteFields = fields.iterator();
                while (iteFields.hasNext())
                {
                    var field = iteFields.next();
                    logDebug(field);
                }
            }
        }
    }

    // var arr = [];
    // loadAppSpecific(arr)
    // for (var idx in arr) {
    //     printObjProps(arr[idx]);
    // }


 

})(); 