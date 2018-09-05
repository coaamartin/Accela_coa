/*
Script 422
Batch: 	Daily batch to update all "NFZV - 1 year" conditions on parcels to "Condition Met",
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
var capBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapBusiness", null).getOutput();
var parcelCondBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelConditionBusiness").getOutput();
var sql = "select L1_PARCEL_NBR,L1_CON_NBR FROM L1CONDIT LC WHERE LC.L1_CON_DES = '" + conditionName + "' " +
	" AND lc.L1_CON_ISS_DD < '" + (oneYearAgo.getMonth() + 1) + "/" + (oneYearAgo.getDate()) + "/" + (oneYearAgo.getFullYear() + 1900) + "' " +
	" AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
	" AND REC_STATUS = 'A'";

var array = doSQL(sql);

if (parcelCondBiz) {
	for (var i in array) {
		aa.print("------------------------------------------");
		aa.print("Removing Condition " + array[i].L1_CON_NBR + " from parcel : " + array[i].L1_PARCEL_NBR + " ");
		parcelCondBiz.removeParcelCondition(aa.getServiceProviderCode(), array[i].L1_PARCEL_NBR, array[i].L1_CON_NBR, "ADMIN");
		var capListForPrcl = capBiz.getCapViewListByRefParcelID(aa.getServiceProviderCode(), parseInt(array[i].L1_PARCEL_NBR), "Enforcement").toArray();
		for (var j in capListForPrcl) {
			var capId = capListForPrcl[j].getCapID();
			if (appMatch("Enforcement/Incident/Summons/NA", capListForPrcl[j].getCapType().toString().split("/")) && "NFZV - 1 Year".equals(capListForPrcl[j].getCapStatus())) {
				aa.print("Summons Record with 'NFZV - 1 Year' Status: " + capId.getCustomID());
				updateAppStatus("Compliance", "Updated by Script 422", capId);
			}
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
