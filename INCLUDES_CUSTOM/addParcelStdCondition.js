function addParcelStdCondition(prclNum,cType,cDesc){
    var foundCondition = false;
    
    cStatus = "Applied";
    if (arguments.length > 3)
        cStatus = arguments[3]; // use condition status in args
        
    if (!aa.capCondition.getStandardConditions){
        logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
    }
    else{
        standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
        for(i = 0; i<standardConditions.length;i++)
            if(standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
            {
                standardCondition = standardConditions[i]; // add the last one found
            
                foundCondition = true;
        
                if (!prclNum) // add to all reference address on the current capId
                {
                    var capPrclResult = aa.parcel.getParcelByCapId(capId, null);
                    if (capPrclResult.getSuccess()){
                        var Prcl = capPrclResult.getOutput().toArray();
                        for (zz in Prcl){
                            var parcel = Prcl[zz]
                            var parcelNumber = parcel.getParcelNumber();
                            if (parcelNumber){
                                var addPrclCondResult = aa.parcelCondition.addParcelCondition(parcelNumber,standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null,null, standardCondition.getImpactCode(),cStatus,sysDate, null, sysDate, null, systemUserObj, systemUserObj)
                        
                                if (addPrclCondResult.getSuccess()){
                                    logDebug("Successfully added condition to reference Parcel " + parcelNumber + " " + cDesc);
                                }
                                else{
                                    logDebug( "**ERROR: adding condition to reference Parcel " + parcelNumber + " " + addPrclCondResult.getErrorMessage());
                                }
                            }
                        }
                    }
                }
                else{
                    var addPrclCondResult = aa.parcelCondition.addParcelCondition(prclNum,standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null,null, standardCondition.getImpactCode(),cStatus,sysDate, null, sysDate, null, systemUserObj, systemUserObj)

                    if (addPrclCondResult.getSuccess()){
                        logDebug("Successfully added condition to Parcel " + prclNum + " " + cDesc);
                    }
                    else{
                        logDebug( "**ERROR: adding condition to Parcel " + prclNum + " " + addPrclCondResult.getErrorMessage());
                    }
                }
            }
    }
        
    if (!foundCondition) logDebug( "**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
}