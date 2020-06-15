//Script 281
//Record Types: Fire/*/*/*
//Event:        ISA
//Desc:         Event InspectionScheduleAfter 
//
//              Criteria: Any Fire Inspection being scheduled 
//
//              Action: When an Inspection is Scheduled update the Inspector 
//              to the assigned user on the record detail
//
//Created By: Silver Lining Solutions

function script281_AssignScheduledFireInspection(){
    logDebug("script281_AssignScheduledFireInspection() started.");
    try
    {
        // first get the user that has been assigned to the Record
        // if there is no user this may need to be an error
        //var userID = getAssignedStaff();
        //var userDept = getAssignedDept();
        
        //var fireStation = getRefAddressAttributeValue("FIRESTATION")
        var fireStation = getRefAddressAttributeValue("FIRE Inspectors")
        
        if(fireStation == null)
            throw "Record Address not Assigned to FIRE STATION.";
        else{
            switch(fireStation + ""){
                case "1":
                    userID = "NMENDOZA";
                    break;
                case "2":
                    userID = "GTAETS";
                    break;
                case "3":
                    userID = "NMENDOZA";
                    break;
                case "4":
                    userID = "HVINDUSK";
                    break;
                case "5":
                    userID = "JMGONZAL";
                    break;
                case "6":
                    userID = "EKIRCHER";
                    break;
                case "7":
                    userID = "EKIRCHER";
                    break;
                case "8":
                    userID = "GTAETS";
                    break;
                case "9":
                    userID = "EKIRCHER";
                    break;
                case "10":
                    userID = "RLANHAM";
                    break;
                case "11":
                    userID = "HVINDUSK";
                    break;
                case "12":
                    userID = "JMGONZAL";
                    break;
                case "13":
                    userID = "RLANHAM";
                    break;
                case "14":
                    userID = "RLANHAM";
                    break;
                case "15":
                    userID = "JMGONZAL";
                    break;
                case "16":
                    userID = "NMENDOZA";
                    break;
                case "17":
                    userID = "FIRE STATION 17";
                    break;
                default:
                    break;
            }
        }
        
        
        if(userID != null)
            assignInspection(inspId,userID);
    }
    catch(err){
        logDebug("Error on script281_AssignScheduledFireInspection(). Please contact administrator. Err: " + err);
    }
    logDebug("script281_AssignScheduledFireInspection() ended.");
};


function getRefAddressAttributeValue(attrName){
    var capAddResult = aa.address.getAddressByCapId(capId);
    if (capAddResult.getSuccess())
    {
        var Adds = capAddResult.getOutput();
        for (zz in Adds)
        {
            var fcapAddressObj = Adds[zz];
            var addRefId = fcapAddressObj.getRefAddressId();
            var searchResult = aa.address.getRefAddressByPK(addRefId).getOutput();
            var addressAttr = searchResult.getRefAddressModel().getAttributes();
            addressAttrObj = addressAttr.toArray();
            for (z in addressAttrObj){
                if(addressAttrObj[z].getName().equals(attrName)){
                    return addressAttrObj[z].getValue()
                }
            }
        }
    }
    return false;
}
//END script281_AssignScheduledFireInspection