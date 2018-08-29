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
        var userID = getAssignedStaff();
        var userDept = getAssignedDept();
        if (userID == null){
            if(userDept == null)
                throw "Record not Assigned to User. Please enter on the Record tab";
            else{
                switch(userDept + ""){
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS1":
                        userID = "FIRE STATION 01";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS2":
                        userID = "FIRE STATION 02";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS3":
                        userID = "FIRE STATION 03";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS4":
                        userID = "FIRE STATION 04";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS5":
                        userID = "FIRE STATION 05";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS6":
                        userID = "FIRE STATION 06";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS7":
                        userID = "FIRE STATION 07";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS8":
                        userID = "FIRE STATION 08";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS9":
                        userID = "FIRE STATION 09";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS10":
                        userID = "FIRE STATION 10";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS11":
                        userID = "FIRE STATION 11";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS12":
                        userID = "FIRE STATION 12";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS13":
                        userID = "FIRE STATION 13";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS14":
                        userID = "FIRE STATION 14";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS15":
                        userID = "FIRE STATION 15";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS16":
                        userID = "FIRE STATION 16";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS17":
                        userID = "FIRE STATION 17";
                        break;
                    default:
                        break;
                }
            }
            
            if(userID != null)
                assignInspection(inspId,userID);
        }
    }
    catch(err){
        logDebug("Error on script281_AssignScheduledFireInspection(). Please contact administrator. Err: " + err);
    }
    logDebug("script281_AssignScheduledFireInspection() ended.");
};//END script281_AssignScheduledFireInspection
