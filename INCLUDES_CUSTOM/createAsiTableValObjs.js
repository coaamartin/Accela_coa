/*
* EASY WAY TO CREATE AsiTableValObjs
    row = createAsiTableValObjs([
        { columnName: 'Abatement #', fieldValue: capIDString, readOnly: 'N' },
        { columnName: 'Type', fieldValue: AInfo['Abatement Type'], readOnly: 'N' }
    ]);)
*/
function createAsiTableValObjs(columnArray) {
    var asiCols = [];
    for(var idx in columnArray) {
        asiCols[columnArray[idx].columnName] = new asiTableValObj(
            columnArray[idx].columnName, 
            columnArray[idx].fieldValue, 
            columnArray[idx].readOnly
        ); 
    }
    return asiCols
}

