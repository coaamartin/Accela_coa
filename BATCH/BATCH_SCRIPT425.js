/*
Script 425
update conditions on an address for "NOV Issued" Condition, and "Chronic Violator" Condition. 

Frequency - Daily 

"NOV Issued" Condition Update Rules: 
Update Condition "Status" to Condition Met if todays date is greater than 6 months from todays date. 
(If applied date is Dec 1, 2016, the condition should still be applied on May 31st and be removed that night, making the status "Condition Met/Not Applied" on June 1, 2017) 
(Leap Year example....... If applied on August 29th 2016, the condition should be updated to "Condition Met/Not Applied" on february 28th, having the condition no longer effective on the 29th of February... 
If not a leap year, the condition should be updated to "Condition Met/Not Applied" on February 27th, having it no longer applied on the 28th of February) 

"Chronic Violator" Condition Update Rules: 
When updating the "NOV Issued" condition from an address, check how many "NOV Issued" conditions 
are still applied on that address (Not set to "Condition Met"), and if there are less 
than 2 "NOV Issued" flags on the address, update the "Chronic Violator" Condition to "Condition Met. 

If there are 2 or more "NOV Issued" conditions applied to the address, and not in 
a "Not Applied/Condition Met" status, then leave the "Chronic Violator" Condition 
in the applied status. 

7/7/18 JHS

There are no EMSE APIs to retrieve non-std address conditions, so we need to use SQL to obtain
 */

var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var sysDate = aa.date.getCurrentDate();
var conditionName = "NOV Issued";
var sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
var capBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapBusiness", null).getOutput();
var addressCondBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressConditionBusiness").getOutput();
var sql = "select L1_ADDRESS_NBR,L1_CON_NBR FROM L3ADDRES_CONDIT LC WHERE LC.L1_CON_DES = '" + conditionName + "' " +
	" AND lc.L1_CON_ISS_DD > '" + (sixMonthsAgo.getMonth() + 1) + "/" + (sixMonthsAgo.getDate()) + "/" + (sixMonthsAgo.getFullYear()) + "' " +
	" AND lc.L1_CON_STATUS = 'Applied' " + 
	" AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
	" AND REC_STATUS = 'A'";

var array = doSQL(sql);

for (var i in array) {
	aa.print("------------------------------------------");
	var condNbr = array[i].L1_CON_NBR;
	var addrNbr = array[i].L1_ADDRESS_NBR;
	aa.print("Resolving Condition " + condNbr + " from address : " + addrNbr + " ");
	var condModel = aa.addressCondition.getAddressCondition(addrNbr, condNbr);
	
	if(!condModel.getSuccess()) { aa.print("Unable to get address condition model for address ref number " + addrNbr); }
	
	var cond = condModel.getOutput();
	cond.setConditionStatus("Condition Met");
	
	var cUpdateRes = aa.addressCondition.editAddressCondition(cond);
	if(!cUpdateRes.getSuccess())
		aa.print("Unable to update condition to met, error: " + cUpdateRes.getErrorMessage());
	else
		aa.print("Successfully updated condition " + condNbr);
	
	aa.print("Searching for Chronic Violator reset");
	var conditionName = "('NOV Issued','Chronic Violator')";
	var sql = "select L1_CON_DES,L1_ADDRESS_NBR,L1_CON_STATUS,L1_CON_NBR FROM L3ADDRES_CONDIT LC WHERE LC.L1_CON_DES IN " + conditionName + " " +
	" AND L1_ADDRESS_NBR = " + addrNbr + " " +
	" AND lc.L1_CON_STATUS = 'Applied' " + 
	" AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
	" AND REC_STATUS = 'A'";
	var array2 = doSQL(sql);
	var appliedCount = 0;
	for (var j in array2) {
		if ("NOV Issued".equals(array2[j].L1_CON_DES)) {
			appliedCount++;
		}
	}
	if (appliedCount < 2) {
		aa.print("1 or less active NOVs, looking for Chronic Violator condition to resolve");
		for (var j in array2) {
			if ("Chronic Violator".equals(array2[j].L1_CON_DES)) {
			    var chronicCondNbr = array2[j].L1_CON_NBR;
				var chronicAddrNbr = array2[j].L1_ADDRESS_NBR;
				aa.print("Resolving Chronic Violator Condition " + chronicCondNbr + " from address : " + chronicAddrNbr + " ");
            	var condModel2 = aa.addressCondition.getAddressCondition(chronicAddrNbr, chronicCondNbr);
            	
            	if(!condModel2.getSuccess()) { aa.print("Unable to get address condition model for address ref number " + addrNbr); }
            	
            	var cond2 = condModel2.getOutput();
            	cond2.setConditionStatus("Condition Met");
            	
            	var cUpdateRes2 = aa.addressCondition.editAddressCondition(cond2);
            	if(!cUpdateRes2.getSuccess())
            		aa.print("Unable to update condition to met, error: " + cUpdateRes2.getErrorMessage());
            	else
            		aa.print("Successfully updated condition " + chronicCondNbr);
			}
		}
	}
	else {
		aa.print("2 or more active NOVs, any Chronic Violator Status conditions will remain applied");
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
