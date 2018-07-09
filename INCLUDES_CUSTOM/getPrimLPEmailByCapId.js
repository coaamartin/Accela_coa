function getPrimLPEmailByCapId(itemCap){
    var capLps = getLicenseProfessional(itemCap);
    
    for(eachLp in capLps){
        var lp = capLps[eachLp];
        
        if(lp.getPrintFlag() == "Y") return lp.getEmail();
    }
    
    return eachLp[0].getEmail();
}