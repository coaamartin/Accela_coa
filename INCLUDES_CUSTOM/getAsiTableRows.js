/*
* WRAPPER AROUND loadASITable - RETURNS FALSE OR ARRAY
    row = createAsiTableValObjs([
        { columnName: 'Abatement #', fieldValue: capIDString, readOnly: 'N' },
        { columnName: 'Type', fieldValue: AInfo['Abatement Type'], readOnly: 'N' }
    ]);)
*/
function getAsiTableRows(tableName, options) {
    var settings = {
        capId: capId,
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var asitArray = loadASITable(tableName, settings.capId);
    if (asitArray == undefined || asitArray == null) return false;
    return asitArray;
}

