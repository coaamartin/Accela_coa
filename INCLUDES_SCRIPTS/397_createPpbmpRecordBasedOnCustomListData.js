script397_createPpbmpRecordBasedOnCustomListData();

function script397_createPpbmpRecordBasedOnCustomListData() {
    var tempASIT = loadASITable("POND TYPES");

		if (tempASIT != undefined && tempASIT != null) {
             for (var ea in tempASIT) {
                 var row = tempASIT[ea];

                    createTempChildGeneric('Water', 'Water', 'PPBMP', 'NA', {
                        appName: row['Pond Type'] + " - " + row['Pond Number'],
                        accessByACA: true,
                        copyParcels: true,
                        copyAddresses: true,
                        copyOwner: true,
                        copyContacts: true
                    });
                
            }          
        }

}