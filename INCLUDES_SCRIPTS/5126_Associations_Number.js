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

getNeighborhoodNumber();

function getNeighborhoodNumber(){

    try {

        //Associations/Neighborhood/Association
        logDebug("Starting SQL script");
        //SELECT cast (MAX(cast(b1_checklist_comment as int))as varchar (20))FROM BCHCKBOXWHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number';
        var sql = "SELECT convert (varchar (20), MAX(convert(int, b1_checklist_comment))) as group_number " +
                  " FROM BCHCKBOX " +
                  " WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"

        var array = [];
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(sql);
        logDebug("SQL statement that is built: " + sql);
        logDebug("SQL results: " + array);
        //only execute select statements
		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			sStmt.executeQuery();
			results = sStmt.getResultSet()
			while (results.next()){
					array.push( results.getString("group_number"));
				}
		sStmt.close();
		conn.close();
		if(array==null || array==undefined || array==""){
			return "";
		}
		return array;
		}
		} catch (err) {
			logDebug("This is the error: " + err.message);
			
	}
        logDebug("The highest neighborhood number is: " + array);
        var hoaNumber = array++;
        logDebug("New HOA number is: "+ hoaNumber);

}
       //push the new hoaNumber into the Neighborhood Group Number
       //This is a cutom field