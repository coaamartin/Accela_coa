//500 - OTC prototype - Code from TruePoint from Keith to test new record type

    //#3
    if (ifTracer(!matched, '!matched')) {
        logDebug("match #3");
        recTypesAry = new Array();
//Keith Added OTC here (next 2 lines)for test on 2-2-19
        recTypesAry = [ "Building/Permit/No Plans/NA","Building/Permit/OTC/AC Only" ];
        if((appMatch("Building/Permit/No Plans/NA") || appMatch("Building/Permit/OTC/*")) && bldScript2_noContractorCheck() && validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved"))
    