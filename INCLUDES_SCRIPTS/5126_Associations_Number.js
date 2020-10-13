//Written by rprovinc   
//
//include("5125_Associations_Number.js");

//*****************************************************************************
//Script ASA;Assocaitons!~!~!~.js
//Record Types:	Associations\*\*\* 
//Event: 		ASA
//Desc:			Getting the highest HOA number and then incrementing it by 1 and updating the new record with the HOA number.
//
//Created By: Rprovinc
//******************************************************************************
SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

//eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

logDebug("Started to run script 5126");
// vAsyncScript = "RUN_HOA_GROUP_NUMBER";
// logDebug("Kicking off Async event");
// aa.runAsyncScript(vAsyncScript, null);
// logDebug("Finished running the async event??");
//Associations/Neighborhood/Association
logDebug("Starting SQL script");
//SELECT cast (MAX(cast(b1_checklist_comment as int))as varchar (20))FROM BCHCKBOXWHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number';
var sql = "SELECT convert (varchar (20), MAX(convert(int, b1_checklist_comment))) as group_number " +
	" FROM BCHCKBOX " +
	" WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"
logDebug("This is the sql statement: " + sql);
var msg = "";
var condArray = doSQL(sql);

aa.print(msg);

function doSQL(sql) {
	logDebug("Starting to kick off the doSQL function.")
	try {
		var array = [];
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(sql);

		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			var rSet = sStmt.executeQuery();
			logDebug("SSTMT: " + rSet); 
			while (rSet) {
			var obj = {};
			var md = rSet.getMetaData();
			logDebug("MD value: " + md);
			var columns = md.getColumnCount();
			logDebug("Columns: "+ columns);
			for (i = 1; i <= columns; i++) {
				obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
			}
			//obj.count = rSet.getRow();
			array.push(obj);
			return array;
			}
			// rSet.close();
			// sStmt.close();
			// conn.close();
			// logDebug("The highest neighborhood number is: " + array);
			// var hoaNumber = array++;
			// logDebug("New HOA number is: " + hoaNumber);
		}
		rSet.close();
		sStmt.close();
		conn.close();
		logDebug("The highest neighborhood number is: " + array);
		var hoaNumber = array++;
		logDebug("New HOA number is: " + hoaNumber);
	} catch (err) {
		aa.print(err.message);
	}
}
// logDebug("The highest neighborhood number is: " + array);
// var hoaNumber = array++;
// logDebug("New HOA number is: " + hoaNumber);

//getNeighborhoodNumber();

// function getNeighborhoodNumber(){

//     try {

//         //Associations/Neighborhood/Association
//         logDebug("Starting SQL script");
//         //SELECT cast (MAX(cast(b1_checklist_comment as int))as varchar (20))FROM BCHCKBOXWHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number';
//         var sql = "SELECT convert (varchar (20), MAX(convert(int, b1_checklist_comment))) as group_number " +
//                   " FROM BCHCKBOX " +
//                   " WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"

//         var array = [];
//         var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
//         var ds = initialContext.lookup("java:/AA");
//         var conn = ds.getConnection();
//         var sStmt = conn.prepareStatement(sql);
//         logDebug("SQL statement that is built: " + sql);
//         logDebug("SQL results: " + array);
//         //only execute select statements
// 		if (sql.toUpperCase().indexOf("SELECT") == 0) {
// 			sStmt.executeQuery();
// 			results = sStmt.getResultSet()
// 			while (results.next()){
// 					array.push( results.getString("group_number"));
// 				}
// 		sStmt.close();
// 		conn.close();
// 		if(array==null || array==undefined || array==""){
// 			return "";
// 		}
// 		return array;
// 		}
// 		} catch (err) {
// 			logDebug("This is the error: " + err.message);

// 	}
//         logDebug("The highest neighborhood number is: " + array);
//         var hoaNumber = array++;
//         logDebug("New HOA number is: "+ hoaNumber);

// }
//push the new hoaNumber into the Neighborhood Group Number
//This is a cutom field