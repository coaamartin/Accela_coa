script397_createPpbmpRecordBasedOnCustomListData();

function script397_createPpbmpRecordBasedOnCustomListData() {
    var tempASIT = loadASITable("POND TYPES");
		if (tempASIT != undefined && tempASIT == null) {
             for (var ea in tempASIT) {
                 var row = tempASIT[ea];
                    printObjProps(row)
    
    
                        // fv = "" + row[cName].fieldValue;
                        // cValue = "" + cValue;
                        // r = new RegExp("^" + cValue + "(.)*"); 
                
                
            }          
        }

}