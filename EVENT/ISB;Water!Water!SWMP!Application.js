//ISB:WATER/WATER/SWMP/APPLICATION

try{
    if (InspectionType == "Initial Inspection"){
       //check ECKO inspection
       var inspection2Check = "ECKO and Initial Inspection"
        var result=checkInspectionTypeAndStatus(inspection2Check);
            if (result==null) {
                throw "An ECKO must be completed before an Initial Inspection can be scheduled"
            }else if (result==false){
                throw inspection2Check + " must be completed prior to scheduling " + InspectionType ;
            }		
       
    }

}catch(e){
    cancel = true;
    showDebug = false;
    showMessage = true;
    comment(e);
}


function checkInspectionTypeAndStatus(insp2Check){
    var inspectionFoundFlag = false;
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess())
    {
        inspList = inspResultObj.getOutput();
        for (xx in inspList){
            var inspType=inspList[xx].getInspectionType(); 
            if(insp2Check==inspType){
                inspectionFoundFlag = true;
                var inspectionStatus = inspList[xx].getInspectionStatus();
                if(inspectionStatus.indexOf("Complete")>-1){
                    //all good
                    return true;
                }
                else{
                    return false;
                }
              
            }
        }
           
        if(!inspectionFoundFlag){
                return null;
        }
    }
}
