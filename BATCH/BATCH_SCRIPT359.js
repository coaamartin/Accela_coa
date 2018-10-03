
/* 
Script 359
Batch - Remove condition "Snow Warning" from all parcels June 15th every year
7/2/18 JHS

There are no EMSE APIs to retrieve non-std parcel conditions, so we need to use SQL to obtain
*/

var sql = "select L1_PARCEL_NBR,L1_CON_NBR FROM L1CONDIT LC WHERE LC.L1_CON_DES = 'Snow Warning' " + 
	" AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
	" AND REC_STATUS = 'A'";
	
var msg = "";
var condArray = doSQL(sql);

if (condArray) {
	for (var i in condArray) {
		msg += "Removing Condition " + condArray[i].L1_CON_NBR + " from address : " + condArray[i].L1_PARCEL_NBR + " ";
		var removeCondRes = aa.parcelCondition.removeParcelCondition(condArray[i].L1_CON_NBR, condArray[i].L1_PARCEL_NBR);
		if(removeCondRes.getSuccess()) aa.print("Condition successfully removed on parcel " + condArray[i].L1_PARCEL_NBR);
		else {aa.print("Unable to remove condition on parcel " + condArray[i].L1_PARCEL_NBR + ". Error: " + removeCondRes.getErrorMessage())}
	}
}

aa.print(msg);

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



