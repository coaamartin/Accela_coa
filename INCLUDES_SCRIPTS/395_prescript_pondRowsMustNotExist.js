
script395_prescript_pondRowsMustNotExist();

function script395_prescript_pondRowsMustNotExist() {
    logDebug('script395_prescript_pondRowsMustNotExist() starting');
    var rows = loadASITable('POND TYPES');
    if(rows) {
        cancelCfgExecution = true;
        var message = "Pond Type rows exist";
        comment("Pond Type rows exist");
        showMessage=true;
        return false;
    }
    return true; 
}