(function() {
    var idxDocs,
        docListArray,
        doc,
        docCat,
        group,
        idxAsiGrps;

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

})(); 