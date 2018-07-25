if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wfTask == "License Issuance" && wfStatus == "Issued"')){
    //Script 147
    if(balanceDue > 0){
        cancel = true;
        showMessage = true;
        comment("All fees need to be paid before issuing application");
    }
}