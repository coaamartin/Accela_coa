//Script 483 - SWAKIL

var typeArray = ["Meter Set Inspection"];
var statusArray = ["Fail"];
inspCount = inspectionStatusCheck(typeArray, statusArray);

if(inspCount >=3){
	var thisFeeAmt = 138.00;
	addFee("WAT_IP_03","WAT_IP","FINAL",thisFeeAmt,"Y");
    updateAppStatus("Payment Pending", "Updated via script");

    include("490_Email_Tap_Invoice");
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
