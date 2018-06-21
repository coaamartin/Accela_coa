script395_prescript_pondRowsMustExist();

function script395_prescript_pondRowsMustExist() {
    var rows = loadASITable('Pond Types');
    if(!rows) {
        cancelCfgExecution = true;
        var message = "No Pond Type rows exist";
        cancel = true;
        showMessage=true;
    }
}