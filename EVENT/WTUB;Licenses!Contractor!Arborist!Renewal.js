if(ifTracer(wfTask == "License Renewal" && wfStatus == "Renewed", 'wfTask == "License Renewal" && wfStatus == "Renewed"')){
    //Script 147
    if(balanceDue > 0){
        cancel = true;
        showMessage = true;
        comment("All fees need to be paid before issuing renewal");
    }
}