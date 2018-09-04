/*
Title : Update custom field and schedule inspection (Batch)

Purpose : Run 7 days before the beginning of each month. Get Fire Records(Fire/{*}/{*}/{*})and Custom Field "Month and year".
Update the year to the next year. ie; if 2017 then update to 2018 If the records custom field "Inspection Month" is the
next month from current date and the custom field "Inspection Frequency" is the frequency from the last
inspection(example the inspection frequency is 12 months and the last inspection listed on the inspection tab is 12 months
then schedule the same inspection with the frequency from the last inspection found).

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters: NONE

Notes:
    - A record with no inspections at all will be skipped (as we don't have inspection type to use, and no last date to add freq to)
    - ASI (Month and year) not updated, no ASI with specified name exist.
*/

function getScriptText(e) {
    var t = aa.getServiceProviderCode();
    if (arguments.length > 1)
        t = arguments[1];
    e = e.toUpperCase();
    var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var r = n.getScriptByPK(t, e, "ADMIN");
        return r.getScriptText() + ""
    } catch (i) {
        return ""
    }
}

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

var capId = null;

try {
    updateCustomFieldAndScheduleInspection();
} catch (ex) {
    aa.print("**ERROR batch failed, error: " + ex);
}

/**
 * get last scheduled inspection, check if next inspection should be scheduled, based on ASIs
 */
function updateCustomFieldAndScheduleInspection() {
    var capTypeModel = aa.cap.getCapTypeModel().getOutput();
    capTypeModel.setGroup("Fire");

    var capModel = aa.cap.getCapModel().getOutput();
    capModel.setCapType(capTypeModel);
    var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
    aa.print("**INFO total records=" + capIdScriptModelList.length);

    var now = new Date();
    var nextMonthDate = dateAddMonths(now, 1);
    var nextMonthNumber = convertDate(nextMonthDate);
    nextMonthNumber = nextMonthNumber.getMonth() + 1;// +1 in Date() months are 0 based

    if (parseInt(nextMonthNumber) < 10) {
        nextMonthNumber = "0" + nextMonthNumber;
    }
    aa.print("**INFO nextMonthDate=" + nextMonthDate + " // nextMonthNumber=" + nextMonthNumber);

    for (r in capIdScriptModelList) {
        capId = capIdScriptModelList[r].getCapID();
        capId = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();
        aa.print("<br>#######################<br>");
        var olduseAppSpecificGroupName = useAppSpecificGroupName;
        useAppSpecificGroupName = false;

        //sample value for inspectionMonth asi [01 January]
        var inspectionMonth = getAppSpecific("Inspection Month");
        if (inspectionMonth == null || inspectionMonth == "") {
            aa.print("**INFO Working on capId=" + capId.getId() + ", altId= " + capId.getCustomID() + " Inspection Month is null, SKIP...");
            continue;
        }

        //the inspection is next month
        if (inspectionMonth.indexOf(nextMonthNumber) != -1) {
            //values [12 months], [24 months]
            var inspectionFrequency = getAppSpecific("Inspection Frequency");

            if (inspectionFrequency == null || inspectionFrequency == "") {
                aa.print("**WARN Working on capId=" + capId.getId() + ", altId= " + capId.getCustomID() + "Inspection Frequency is null, SKIP...");
                continue;
            }

            inspectionFrequency = inspectionFrequency.split(" ")[0];
            inspectionFrequency = parseInt(inspectionFrequency);

            aa.print("**INFO Working on capId=" + capId.getId() + ", altId= " + capId.getCustomID() + " // inspectionFrequency=" + inspectionFrequency + " // inspectionMonth=" + inspectionMonth);

            //Get last ScheduledDate
            var inspecs = aa.inspection.getInspections(capId);
            inspecs = inspecs.getOutput();
            if (inspecs == null || inspecs.length == 0) {
                aa.print("**WARN no old inspections were found, SKIP...");
                continue;
            }

            var lastSchedDate = null;
            var lastSchedType = null;

            for (i in inspecs) {
                if (inspecs[i].getScheduledDate() == null) {
                    continue;
                }
                if (lastSchedDate == null) {
                    lastSchedDate = inspecs[i].getScheduledDate();
                    lastSchedType = inspecs[i].getInspectionType();
                } else {
                    if (dateDiff(inspecs[i].getScheduledDate(), lastSchedDate) < 0) {
                        lastSchedDate = inspecs[i].getScheduledDate();
                        lastSchedType = inspecs[i].getInspectionType();
                    }
                }
            }//for all inspections

            if (lastSchedDate == null) {
                aa.print("**WARN could not find lastSchedDate, SKIP...");
            }

            lastSchedDate = convertDate(lastSchedDate);
            //we calc dateDiff using nextMonth (which is due date, not current month)
            var diff = dateDiff(nextMonthDate, lastSchedDate); // in minus if lastSchedDate is in past
            diff = Math.ceil(diff / 30);
            aa.print("**INFO lastSchedDate=" + lastSchedDate + " MonthsDiff=" + diff);

            //diff > 0 means in future
            if (diff > 0 || Math.abs(diff) < inspectionFrequency) {
                aa.print("**INFO next inspection could be already scheduled, SKIP...");
                continue;
            }

            //schedule same inspection, on date (lastSchedDate + inspectionFrequency)
            var nextSchedDate = dateAddMonths(lastSchedDate, inspectionFrequency);
            nextSchedDate = dateAdd(nextSchedDate, -1);
            nextSchedDate = nextWorkDay(nextSchedDate);
            aa.print("**INFO need to sched inspection " + lastSchedType + " On " + nextSchedDate);
            try {
                if(getAssignedStaff(capId))
                    scheduleInspectDate(lastSchedType, nextSchedDate, getAssignedStaff(capId));
                else
                    scheduleInspectDate(lastSchedType, nextSchedDate);
            } catch (ex) {
                aa.print("ERR scheduleInspectDate : " + ex);
            }
        }//inspection is next month

        useAppSpecificGroupName = olduseAppSpecificGroupName;
    }//for all caps
}

function getAssignedStaff(capId) {
    try {
        var assignedStaff = "";
        var cdScriptObjResult = aa.cap.getCapDetail(capId);
        if (!cdScriptObjResult.getSuccess()) {
            aa.debug("**ERROR: No cap detail script object : ",
                    cdScriptObjResult.getErrorMessage());
            return false;
        }

        var cdScriptObj = cdScriptObjResult.getOutput();
        if (!cdScriptObj) {
            aa.debug("**ERROR: No cap detail script object", "");
            return false;
        }
        cd = cdScriptObj.getCapDetailModel();
        assignedStaff = cd.getAsgnStaff();

        return assignedStaff

    } catch (e) {
        aa.debug("getAssignedStaff ", e);
        return false;
    }
}