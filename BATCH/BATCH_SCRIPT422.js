/*
Script 422
Batch:  Daily batch to update all "NFZV - 1 year" conditions on parcels to "Condition Met",
that were applied equal or greater than 365 days ago.
Also update the record status of the "Summons Case" from "NFZV -1 Year" to "Compliance".
Frequency of Batch - Nightly
7/7/18 JHS

There are no EMSE APIs to retrieve non-std parcel conditions, so we need to use SQL to obtain
 */

var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var conditionName = "NFZV - 1 Year";
var oneYearAgo = new Date();
oneYearAgo.setYear(oneYearAgo.getYear() - 1);
var sql = "select L1_PARCEL_NBR,L1_CON_NBR FROM L1CONDIT LC WHERE LC.L1_CON_DES = '" + conditionName + "' " +
    " AND lc.L1_CON_ISS_DD < '" + (oneYearAgo.getMonth() + 1) + "/" + (oneYearAgo.getDate()) + "/" + (oneYearAgo.getFullYear() + 1900) + "' " +
    " AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
    " AND REC_STATUS = 'A'";

var condArray = doSQL(sql);

if (condArray) {
    for (var i in condArray) {
        aa.print("------------------------------------------");
        aa.print("Removing Condition " + condArray[i].L1_CON_NBR + " from parcel : " + condArray[i].L1_PARCEL_NBR + " ");
        var removeCondRes = aa.parcelCondition.removeParcelCondition(condArray[i].L1_CON_NBR, condArray[i].L1_PARCEL_NBR);
        if(removeCondRes.getSuccess()) aa.print("Condition successfully removed on parcel " + condArray[i].L1_PARCEL_NBR);
        else {aa.print("Unable to remove condition on parcel " + condArray[i].L1_PARCEL_NBR + ". Error: " + removeCondRes.getErrorMessage())}
                
        var capListRes = aa.cap.getCapListByParcelID(condArray[i].L1_PARCEL_NBR, null);
        
        if(capListRes.getSuccess()){
            var capList = capListRes.getOutput();
            for(each in capList){
                var capIdModel = capList[each];
                var capId = aa.cap.getCapID(capIdModel.getID1(), capIdModel.getID2(), capIdModel.getID3()).getOutput();
                var altId = capIdModel.getCustomID();
                var cap = aa.cap.getCap(capId).getOutput();
                var appTypeString = cap.getCapType().toString();
                var capStatus = cap.getCapStatus();
                
                if (appTypeString == "Enforcement/Incident/Summons/NA" && "NFZV - 1 Year".equals(capStatus)) {
                    aa.print("Summons Record with 'NFZV - 1 Year' Status: " + altId);
                    updateAppStatus("Compliance", "Updated by Script 422", capId);
                }
            }
        }
        else{
            aa.print("Error getting caps for parcel id " + condArray[i].L1_PARCEL_NBR + ". Error: " + capListForPrcl.getErrorMessage());
        }
    }
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

function appMatch(ats, matchArray) {

    var isMatch = true;
    var ata = ats.split("/");
    if (ata.length != 4)
        aa.print("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
    else
        for (xx in ata)
            if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
                isMatch = false;
    return isMatch;
}

function updateAppStatus(stat, cmt, itemCap) // optional cap id
{

    var updateStatusResult = aa.cap.updateAppStatus(itemCap, "APPLICATION", stat, sysDate, cmt, systemUserObj);
    if (updateStatusResult.getSuccess())
        aa.print("Updated application status to " + stat + " successfully.");
    else
        aa.print("**ERROR: application status update to " + stat + " was unsuccessful.  The reason is " + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
}
