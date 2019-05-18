var typeArray = ["MJ AMED Inspections",
                "MJ Building Inspections",
                "MJ Code Enforcement Inspections",
                "MJ Planning Inspections",
                "MJ Security Inspections - Police"
                ];

var statusArray = ["Passed", "Passed - Minor Violations"]             
allInspectionsResulted(typeArray, statusArray);
if(resulted){
    closeTask("Inspection Phase", "Complete", "Set via script", "Set via Script");
}


function allInspectionsResulted(typeArray, statusArray) {
    logDebug("---------------------> In the allInspectionsResulted function");       
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();
        var processedInspTypes = [];

        for (xx in inspList) {
            if(exists(inspList[xx].getInspectionType(), typeArray) && exists(inspList[xx].getInspectionStatus(), statusArray)){
                processedInspTypes.push(inspList[xx].getInspectionType());  
            }else{
                return false;
            }
        }
        for (yy in typeArray){
            if (!exists(typeArray[yy], processedInspTypes)){
               return false; 
            }
        }
       return true;
    }else{
        return false;
    }
    return false;
}