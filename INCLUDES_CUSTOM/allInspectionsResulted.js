function allInspectionsResulted(typeArray, statusArray) {
    logDebug("---------------------> In the allInspectionsResulted function"); 
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();
        var processedInspTypes = [];

        for (xx in inspList) {
            if(exists(inspList[xx].getInspectionType(), typeArray) && exists(inspList[xx].getInspectionStatus(), statusArray)){
                    processedInspTypes.push(inspList[xx].getInspectionType());      
            }
        }

        for(kk in typeArray){
            if(!exists(typeArray[kk], processedInspTypes)){
                return false;
            }
        }
        return true;
    }
}