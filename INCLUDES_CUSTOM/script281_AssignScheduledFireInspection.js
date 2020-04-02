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
        
        var fireStation = getRefAddressAttributeValue("FIRESTATION")
        
        if(fireStation == null)
            throw "Record Address not Assigned to FIRE STATION.";
        else{
            switch(fireStation + ""){
                case "1":
                    userID = "FIRE STATION 01";
                    break;
                case "2":
                    userID = "FIRE STATION 02";
                    break;
                case "3":
                    userID = "FIRE STATION 03";
                    break;
                case "4":
                    userID = "FIRE STATION 04";
                    break;
                case "5":
                    userID = "FIRE STATION 05";
                    break;
                case "6":
                    userID = "FIRE STATION 06";
                    break;
                case "7":
                    userID = "FIRE STATION 07";
                    break;
                case "8":
                    userID = "FIRE STATION 08";
                    break;
                case "9":
                    userID = "FIRE STATION 09";
                    break;
                case "10":
                    userID = "FIRE STATION 10";
                    break;
                case "11":
                    userID = "FIRE STATION 11";
                    break;
                case "12":
                    userID = "FIRE STATION 12";
                    break;
                case "13":
                    userID = "FIRE STATION 13";
                    break;
                case "14":
                    userID = "FIRE STATION 14";
                    break;
                case "15":
                    userID = "FIRE STATION 15";
                    break;
                case "16":
                    userID = "FIRE STATION 16";
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
};//END script281_AssignScheduledFireInspection


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
    ​
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