/*
Script 422
Batch: 	Daily batch to update all "NFZV - 1 year" conditions on addresses to "Condition Met",
that were applied equal or greater than 365 days ago.
Also update the record status of the "Summons Case" from "NFZV -1 Year" to "Compliance".
Frequency of Batch - Nightly
7/7/18 JHS
There are no EMSE APIs to retrieve non-std address conditions, so we need to use SQL to obtain
 */

var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var conditionName = "NFZV - 1 Year";
var oneYearAgo = new Date();
oneYearAgo.setYear(oneYearAgo.getYear() - 1);
var capBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapBusiness", null).getOutput();
var addressCondBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressConditionBusiness").getOutput();
var sql = "select L1_ADDRESS_NBR,L1_CON_NBR FROM L3ADDRES_CONDIT LC WHERE LC.L1_CON_DES = '" + conditionName + "' " +
	" AND lc.L1_CON_ISS_DD < '" + (oneYearAgo.getMonth() + 1) + "/" + (oneYearAgo.getDate()) + "/" + (oneYearAgo.getFullYear() + 1900) + "' " +
	" AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
	" AND lc.L1_CON_STATUS = 'Applied' " +  
	" AND REC_STATUS = 'A'";

var array = doSQL(sql);

if (addressCondBiz) {
	for (var i in array) {
		aa.print("------------------------------------------");
		var condNbr = array[i].L1_CON_NBR;
    	var addrNbr = array[i].L1_ADDRESS_NBR;
		aa.print("Removing Condition " + condNbr + " from address : " + addrNbr + " ");
		//addressCondBiz.removeAddressCondition(aa.getServiceProviderCode(), array[i].L1_ADDRESS_NBR, array[i].L1_CON_NBR, "ADMIN");
    	var condModel = aa.addressCondition.getAddressCondition(addrNbr, condNbr);
    	
    	if(!condModel.getSuccess()) { aa.print("Unable to get address condition model for address ref number " + addrNbr); }
    	
    	var cond = condModel.getOutput();
    	cond.setConditionStatus("Condition Met");
    	
    	var cUpdateRes = aa.addressCondition.editAddressCondition(cond);
    	if(!cUpdateRes.getSuccess())
    		aa.print("Unable to update condition to met, error: " + cUpdateRes.getErrorMessage());
    	else
    		aa.print("Successfully updated condition " + condNbr);
		
		var capListForAddr = capBiz.getCapViewListByRefAddressID(aa.getServiceProviderCode(), parseInt(array[i].L1_ADDRESS_NBR), "Enforcement").toArray();
		for (var j in capListForAddr) {
			var capId = capListForAddr[j].getCapID();
			if (appMatch("Enforcement/Incident/Summons/NA", capListForAddr[j].getCapType().toString().split("/")) && "NFZV - 1 Year".equals(capListForAddr[j].getCapStatus())) {
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