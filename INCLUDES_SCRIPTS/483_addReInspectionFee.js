//Script 483 - SWAKIL

var typeArray = ["Meter Set Inspection"];
var statusArray = ["Fail"];
inspCount = inspectionStatusCheck(typeArray, statusArray);

if(inspCount >=3){
	var thisFeeAmt = 138.00;
	updateFee("WAT_IP_03","WAT_IP","FINAL",thisFeeAmt,"Y");
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
