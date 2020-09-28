//Associations/Neighborhood/Association
logDebug("Starting SQL script");
//SELECT cast (MAX(cast(b1_checklist_comment as int))as varchar (20))FROM BCHCKBOXWHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number';
var sql = "SELECT convert (varchar (20), MAX(convert(int, b1_checklist_comment))) as group_number " +
    " FROM BCHCKBOX " +
    " WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"

var msg = "";
var condArray = doSQL(sql);

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
logDebug("The highest neighborhood number is: " + array);
var hoaNumber = array++;
logDebug("New HOA number is: " + hoaNumber);





// getHOANumber();
// function getHOANumber() {
// try {
//     //Associations/Neighborhood/Association
//     logDebug("Starting SQL script");
//     //SELECT cast (MAX(cast(b1_checklist_comment as int))as varchar (20))FROM BCHCKBOXWHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number';
//     var sql = "SELECT convert (varchar (20), MAX(convert(int, b1_checklist_comment))) as group_number " +
//         " FROM BCHCKBOX " +
//         " WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"

//     var array = [];
//     var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
//     var ds = initialContext.lookup("java:/AA");
//     var conn = ds.getConnection();
//     var sStmt = conn.prepareStatement(sql);
//     logDebug("SQL statement that is built: " + sql);
//     logDebug("SQL results: " + array);
//     //only execute select statements
//     if (sql.toUpperCase().indexOf("SELECT") == 0) {
//         sStmt.executeQuery();
//         results = sStmt.getResultSet()
//         while (results.next()) {
//             array.push(results.getString("group_number"));
//         }
//         sStmt.close();
//         conn.close();
//         if (array == null || array == undefined || array == "") {
//             return "";
//         }
//         return array;
//     }
// } catch (err) {
//     logDebug("This is the error: " + err.message);
// }

// logDebug("The highest neighborhood number is: " + array);
// var hoaNumber = array++;
// logDebug("New HOA number is: " + hoaNumber);
// }