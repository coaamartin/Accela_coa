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
        colFilters: null //array of column values to filter by... null = all rows
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var rows = loadASITable(tableName, settings.capId),
        filter,
        matched,
        rtn = [];

    if (rows == undefined || rows == null) {
        return null;    //no table or rows
    }

    if(settings.colFilters != null && settings.colFilters.length > 0) {
        for(var idxRows in rows) {
            matched = true;
            for(var idxFilter in settings.colFilters) {
                filter = settings.colFilters[idxFilter];
                if(filter.colValue != rows[idxRows][filter.colName]) {
                    matched = false;
                }
            }
            if(matched) {
                rtn.push(rows[idxRows]);
            }
        }
        return rtn
    } 

    return rows;
}

