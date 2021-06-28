//ISB:WATER/WATER/SWMP/APPLICATION

try{
    if (InspectionType == "Initial Inspection"){
       //check ECKO inspection
       var inspection2Check = "ECKO and Initial Inspection"
        var result=checkInspectionTypeAndStatus(inspection2Check);
            if (result==null) {
                throw "There must be an ECKO initial inspection schedule and completed"
            }else if (result==false){
                throw "ECKO Initial Inspection must be completed prior to scheduling " + InspectionType ;
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
                    return null;
                }
              
            }
        }
           
        if(!inspectionFoundFlag){
                return "";
        }
    }
}
