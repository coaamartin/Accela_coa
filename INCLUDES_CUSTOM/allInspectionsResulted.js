function allInspectionsResulted(typeArray, statusArray) {
    logDebug("---------------------> In the allInspectionsResulted function");       
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();
        var processedInspTypes = [];

        for (xx in inspList) {
            if(exists(inspList[xx].getInspectionType(), typeArray)){
                if(exists(inspList[xx].getInspectionStatus(), statusArray)){
                    processedInspTypes.push(inspList[xx].getInspectionType());  
                }else{
                    logDebug(inspList[xx].getInspectionType() + " is statused: "+inspList[xx].getInspectionStatus());
                    return false;
                }
            }else{
                logDebug("Insp not on required list: "+inspList[xx].getInspectionType()+" >>Skipping");
            }
        }

        for (yy in typeArray){
            if (!exists(typeArray[yy], processedInspTypes)){
                logDebug(typeArray[yy] + " is not in the inspection List");
                return false; 
            }
        }
       return true;
    }else{
        return false;
        
    }
    return false;
}