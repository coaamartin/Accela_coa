function matchARecordType() {
    var appTypeArray,
        valTypeArray = valTypeString.split("/"),
        idx,
        key;

    if (valTypeArray.length != 4) { return false; } //invalid
    for (idx in appTypeStringArray) {
        appTypeArray = appTypeStringArray[idx].split('/');
        if (appTypeArray.length != 4) { break; } //invalid

        for (key in appTypeArray) {
            if (appTypeArray[key].toUpperCase() != valTypeArray[key].toUpperCase() && appTypeArray[key] != '*') {
                break;
            } else if (key == appTypeArray.length-1) {
                return true; //its a match (all 4 elements)
            }
        }
    }
    return false;
}