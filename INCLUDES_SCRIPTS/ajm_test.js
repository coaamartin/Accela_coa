//Test of alternative reality
var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
var currentUserID = aa.env.getValue("CurrentUserID"); // Current User

deleteCadRows();

function deleteCadRows()
{
	 var cadQuery = getRemovedCADAddresses();

	aa.print('---------------------------------------------------------------');
	aa.print(cadQuery);
	aa.print('---------------------------------------------------------------');

        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(cadQuery);
		//sStmt.setString(1, 'APD Caution');
        var rSet = sStmt.executeQuery();
        var counter = 0;
        while (rSet.next()) {
			counter = counter + 1;
			var refAddrid = rSet.getString("b1_contact_type");
			var conId = rSet.getString("Organizationname");

			LogDebug("The Contact is: " + refAddrid);			
			LogDebug("The Organization is: " + conId);
			//aa.addressCondition.removeAddressCondition(refAddrid, conId);
        }
        sStmt.close();
        conn.close();
	    LogBatchDebug("DEBUG", "Done with this:" + counter);
}

//Get addresses to be remove(It was removed from CAD).
function getRemovedCADAddresses()
{
	var altId = capId.getCustomID();
	var cadQuery = "exec spreport_ch_people_buildingmanager_subreport " + altId;
	return cadQuery;
}
