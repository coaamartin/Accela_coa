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
    var emseParameters = {};
    emseParameters.LICENSE_TYPE = "Primary Inspection";
    emseParameters.LICENSE_SUBTYPE = "NA";
    emseParameters.AGENCY = "AURORACO";

    var dataSet = getRecordsArray(emseParameters);
    if (dataSet != false || dataSet.length > 0) aa.print("**INFO total records=" + dataSet.length);
    if (dataSet != false || dataSet.length > 0) 
    for (var i in dataSet) {
        var queryResult = dataSet[i];
        aa.print(queryResult.B1_PER_ID1 + "-" + queryResult.B1_PER_ID2 + "-" + queryResult.B1_PER_ID3 +  " (" + queryResult.ALTID + ")" );

        var capIdResult = aa.cap.getCapID(queryResult.ALTID);
        if ( ! capIdResult.getSuccess())
        {
            logDebug("getCapID error: " + capIdResult.getErrorMessage());
            continue;
        }
        
        var capId = capIdResult.getOutput();
        capId = aa.cap.getCapID(capId.ID1, capId.ID2, capId.ID3).getOutput();
        aa.print(capId);
        aa.print("<br>#######################");
        aa.print("<br>**INFO Working on capId=" + capId.getId() + ", altId= " + capId.getCustomID());
        var olduseAppSpecificGroupName = useAppSpecificGroupName;
        useAppSpecificGroupName = false;

        //sample value for inspectionMonth asi [01 January]
        var inspectionMonth = getAppSpecific("Inspection Month");
        if (inspectionMonth == null || inspectionMonth == "") {
            aa.print("<br>Inspection Month is null, SKIP...");
            continue;
        }

        //the inspection is next month
        if (inspectionMonth.indexOf(nextMonthNumber.toString()) != -1) {
            //values [12 months], [24 months]
            var inspectionFrequency = getAppSpecific("Inspection Frequency");

            if (inspectionFrequency == null || inspectionFrequency == "") {
                aa.print("<br>**WARN Inspection Frequency is null, SKIP...");
                continue;
            }

            inspectionFrequency = inspectionFrequency.split(" ")[0];
            inspectionFrequency = parseInt(inspectionFrequency);

            aa.print("<br>**INFO inspectionFrequency = " + inspectionFrequency + " // inspectionMonth = " + inspectionMonth);

            //Get last ScheduledDate
            var inspecs = aa.inspection.getInspections(capId);
            inspecs = inspecs.getOutput();
            if (inspecs == null || inspecs.length == 0) {
                aa.print("<br>**WARN no old inspections were found, SKIP...");
                continue;
            }

            var lastSchedDate = null;
            //commenting out references to lastSchedType - AuroraCO wants the inspection type to always be "FD Primary Inspection" from this batch job 
            //var lastSchedType = null;
            var inspSchedType = "FD Primary Inspection";

            for (i in inspecs) {
                if (inspecs[i].getScheduledDate() == null) {
                    continue;
                }
                if (lastSchedDate == null) {
                    lastSchedDate = inspecs[i].getScheduledDate();
                    //lastSchedType = inspecs[i].getInspectionType();
                } else {
                    if (dateDiff(inspecs[i].getScheduledDate(), lastSchedDate) < 0) {
                        lastSchedDate = inspecs[i].getScheduledDate();
                        //lastSchedType = inspecs[i].getInspectionType();
                    }
                }
            }//for all inspections

            if (lastSchedDate == null) {
                aa.print("<br>**WARN could not find lastSchedDate, SKIP...");
            }

            lastSchedDate = convertDate(lastSchedDate);
            
            //we calc dateDiff using nextMonth (which is due date, not current month)
            var diff = dateDiff(nextMonthDate, lastSchedDate); // in minus if lastSchedDate is in past
            diff = Math.ceil(diff / 30);
            aa.print("<br>**INFO lastSchedDate=" + lastSchedDate + " MonthsDiff=" + diff);

            //diff > 0 means in future
            if (diff > 0 || Math.abs(diff) < inspectionFrequency) {
                aa.print("<br>**INFO next inspection could be already scheduled, SKIP...");
                continue;
            }

            //schedule same inspection, on date (lastSchedDate + inspectionFrequency)
            var nextSchedDate = dateAddMonths(lastSchedDate, inspectionFrequency);
            //change to script 20 - scheduling inspection for user assigned to record rather than inspector who completed previous inspection
            //var lastInspectorId = getLastInspector(lastSchedType);
            var inspectorId = getAssignedStaff(capId);
            nextSchedDate = dateAdd(nextSchedDate, -1);
            nextSchedDate = nextWorkDay(nextSchedDate);
            aa.print("<br>**INFO need to sched inspection " + inspSchedType + " On " + nextSchedDate);
            try {
                if(inspectorId) {
                    aa.print("<br>Scheduling with inspector assignment");
                    scheduleInspectDate(inspSchedType, nextSchedDate, inspectorId);
                } else {
                    aa.print("<br>Scheduling without inspector assignment");
                    scheduleInspectDate(inspSchedType, nextSchedDate);
                }
            } catch (ex) {
                aa.print("<br>ERR scheduleInspectDate : " + ex);
            }
        }//inspection is next month

        useAppSpecificGroupName = olduseAppSpecificGroupName;
    }
}

function getAssignedStaff(capId) {
    try {
        var assignedStaff = "";
        var cdScriptObjResult = aa.cap.getCapDetail(capId);
        if (!cdScriptObjResult.getSuccess()) {
            aa.print("<br>**ERROR: No cap detail script object : ",
                    cdScriptObjResult.getErrorMessage());
            return false;
        }

        var cdScriptObj = cdScriptObjResult.getOutput();
        if (!cdScriptObj) {
            aa.print("<br>**ERROR: No cap detail script object", "");
            return false;
        }
        cd = cdScriptObj.getCapDetailModel();
        assignedStaff = cd.getAsgnStaff();

        return assignedStaff;

    } catch (e) {
        aa.print("getAssignedStaff ", e);
        return false;
    }
}

function getRecordsArray(emseParameters){
    var sql = 
            "select b.SERV_PROV_CODE,b.B1_PER_ID1, b.B1_PER_ID2, b.B1_PER_ID3, b.b1_alt_id AS ALTID \
            from B1PERMIT b \
            where b.b1_per_type =  '" +emseParameters.LICENSE_TYPE+"' \
            and b.b1_per_sub_type = '" +emseParameters.LICENSE_SUBTYPE+"' \
            and b.REC_STATUS = 'A' \
            and b.serv_prov_code = '" +emseParameters.AGENCY+"' ";

            //aa.print(sql);

            var arr = doSQL(sql);
            return arr;
}

function doSQL(sql) {

    try {
        var array = [];
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(sql);

        if (sql.toUpperCase().indexOf("SELECT") == 0) {
            var rSet = sStmt.executeQuery();
            while (rSet.next()) {
                var obj = {};
                var md = rSet.getMetaData();
                var columns = md.getColumnCount();
                for (i = 1; i <= columns; i++) {
                    obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
                }
                obj.count = rSet.getRow();
                array.push(obj);
            }
            rSet.close();
            sStmt.close();
            conn.close();
            return array;
        }
    } catch (err) {
        aa.print(err.message);
    }
}
