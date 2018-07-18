/*
* WRAPPER AROUND loadASITable - RETURNS NULL OR ARRAY
    colFilters = [
        { colName: 'Abatement #', colValue: capIDString },
        { colnName: 'Type', colValue: AInfo['Abatement Type'] }
    ]
*/
function getAsiTableRows(tableName, options) {
    var settings = {
        capId: capId,
        colFilters: null //array of column values to filter by or null
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var rows = loadASITable(tableName, settings.capId),
        filter;

    if (asitArray == undefined || asitArray == null) {
        return null;    //no table or rows
    }

    printObjProps(rows);

    // if(settings.colFilters != null && settings.colFilters.length > 0) {
    //     for(var idxRows in rows) {
    //         printObjProps(rows[idxRows]);
    //         // for(var idxFilter in settings.colFilters) {
    //         //     filter = settings.colFilters[idxFilter];
    //         //    // if(filter.colName == rows[ ])
    //         // }
    //     }
    // } 

    return rows;
}

