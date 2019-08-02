logDebug("493_Add_SWMP_Inspection_Fee");
if ("ECKO and Initial Inspection".equals(inspType) && "Failed".equals(inspResult))
{
    //SWAKIL
    //add fee everytime after 3rd fail
    var typeArray = ["ECKO and Initial Inspection"];
    var statusArray = ["Failed"];
    inspCount = inspectionStatusCheck(typeArray, statusArray);

    if(inspCount >=3){
        addFee("WAT_SWMP_28","WAT_SWMP_APP","FINAL", 1, "Y");
        updateAppStatus("Payment Pending", "Updated via script");
    }
}

function inspectionStatusCheck(typeArray, statusArray) {
    var count = 0;
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();
        var processedInspTypes = [];

        for (xx in inspList) {
            if(exists(inspList[xx].getInspectionType(), typeArray) && exists(inspList[xx].getInspectionStatus(), statusArray)){
                processedInspTypes.push(inspList[xx].getInspectionType());      
            }
        }
        count = processedInspTypes.length;
    }
    return count;
}