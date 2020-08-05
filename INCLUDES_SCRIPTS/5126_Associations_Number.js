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
        var sql = "cast (MAX(cast(b1_checklist_comment as int))as varchar (20)) " +
                  " FROM BCHCKBOX " +
                  " WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"

        var array = [];
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(sql);
        logDebug("SQL results: " + array);
        //only execute select statements
		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			sStmt.executeQuery();
			results = sStmt.getResultSet()
			while (results.next()){
					array.push( results.getString("b1_checklist_comment"));
				}
		sStmt.close();
		conn.close();
		if(array==null || array==undefined || array==""){
			return "";
		}
		return array;
		}
		} catch (err) {
			logDebug(err.message)
			
	}
        logDebug("The highest neighborhood number is: " + array);
        var hoaNumber = array++;
        logDebug("New HOA number is: "+ hoaNumber);

}
       //push the new hoaNumber into the Neighborhood Group Number
       //This is a cutom field