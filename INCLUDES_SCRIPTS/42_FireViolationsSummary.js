var inspId = aa.env.getValue("InspectionId");
var gso = getGuideSheetObjects(inspId);

for (gsos in gso) {
    var guidesheetItem = gso[gsos];
    var guideItemASITs = gso[gsos].item.getItemASITableSubgroupList();
    infoTables = getASITTable(guideItemASITs, "FIRE VIOLATIONS")
    
    for (var infotable in infoTables) {
        var rows = infoTables[infotable];
        for (var row in rows) {
            var cols = rows[row];

            var row = new Array();
            
            row['Sort Order'] = cols['Sort Order'];
            row['Violation'] = cols['Violation'];
            row['Comment'] = cols['Comment'];
            row['Violation Status'] = cols['Violation Status'];
            addToASITable('FIRE VIOLATIONS', row, capId);
        }
    }
}


function getASITTable(guideItemASITs, asitName) {
    var infoTables = new Array();
    if (guideItemASITs != null) {
        for (var j = 0; j < guideItemASITs.size() ; j++) {
            var tableArr = new Array();
            var tablename = guideItemASITs.get(j).getTableName();
            var guideItemASIT = guideItemASITs.get(j);

            var columnList = guideItemASIT.getColumnList();
            if (guideItemASIT.tableName == asitName) {
                for (var k = 0; k < columnList.size() ; k++) {
                    var column = columnList.get(k);
                    var columnname = column.getColumnName();
                    var values = column.getValueMap().values();
                    var iteValues = values.iterator();
                    while (iteValues.hasNext()) {
                        var cellindex = iteValues.next();
                        var columnvalue = cellindex.getAttributeValue();
                        var zeroBasedRowIndex = cellindex.getRowIndex() - 1;

                        if (tableArr[zeroBasedRowIndex] == null) tableArr[zeroBasedRowIndex] = new Array();
                        tableArr[zeroBasedRowIndex][columnname] = columnvalue;
                    }
                }
                infoTables["" + tablename] = tableArr;
            }
        }
    }
    return infoTables;
}