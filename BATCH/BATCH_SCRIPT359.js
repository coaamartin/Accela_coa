
/* 
Script 359
Batch - Remove condition "Snow Warning" from all addresses June 15th every year
7/2/18 JHS

There are no EMSE APIs to retrieve non-std address conditions, so we need to use SQL to obtain
*/

var conditionName = "Snow Warning";
var addressCondBiz = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressConditionBusiness").getOutput();
var sql = "select L1_ADDRESS_NBR,L1_CON_NBR FROM L3ADDRES_CONDIT LC WHERE LC.L1_CON_DES = 'Snow Warning' " + 
	" AND lc.serv_prov_code='" + aa.getServiceProviderCode() + "' " +
	" AND REC_STATUS = 'A'";
	
var msg = "";
var array = doSQL(sql);

if (addressCondBiz) {
	for (var i in array) {
		msg += "Removing Condition " + array[i].L1_CON_NBR + " from address : " + array[i].L1_ADDRESS_NBR + " ";
		addressCondBiz.removeAddressCondition(aa.getServiceProviderCode(), array[i].L1_ADDRESS_NBR, array[i].L1_CON_NBR,"ADMIN");
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



