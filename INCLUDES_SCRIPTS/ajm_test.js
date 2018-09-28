//Test of alternative reality
//ajm added for testing
deleteCadRows();

function deleteCadRows()
{
	 var cadQuery = getRemovedCADAddresses();

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

			logDebug("The Contact is: " + refAddrid);			
			logDebug("The Organization is: " + conId);
			//aa.addressCondition.removeAddressCondition(refAddrid, conId);
        }
        sStmt.close();
        conn.close();
	    logDebug("Done with this:" + counter);
		sendEmailToApplicant();
}

//Get addresses to be remove(It was removed from CAD).
function getRemovedCADAddresses()
{
	var altId = capId.getCustomID();
	var cadQuery = "exec spreport_ch_people_buildingmanager_subreport '" + altId + "'";
	return cadQuery;
}

function sendEmailToApplicant(){
  var contacts = "Applicant";
  var template = "PW_LIC_AGR_REV";
  var lictype = "Adrianlictype" + ""; //force string
  var wireless = "Adrianwireless" + ""; //force string
  var flagpole = "Adrianflagpoles" + ""; //force string
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$PERMITID$$", lictype)
  emailparams.put("$$TASKCOMMENTS$$", wireless);
  emailparams.put("$$PERMITADDR$$", flagpole);
  emailparams.put("$$PERMITWRKDESC$$", flagpole); 
  emailContacts(contacts, template, emailparams, "", "", "N", "");
}
//end ajm add
