//ajm added for testing
logDebug("Entering AJM TEST");

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
//Log All Environmental Variables as  globals
var params = aa.env.getParamValues();
var keys = params.keys();
var key = null;
while (keys.hasMoreElements()) {
	key = keys.nextElement();
	eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
	logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

//if (preExecute.length)
//	doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

logGlobals(AInfo);

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
			var foundDuplicate = rSet.getString("Found");

			logDebug("Found a duplicate: " + foundDuplicate);			
			//aa.addressCondition.removeAddressCondition(refAddrid, conId);
        }
        sStmt.close();
        conn.close();
	    logDebug("Done with this:" + counter);
		//sendEmailToApplicant();
}

//Get addresses to be remove(It was removed from CAD).
function getRemovedCADAddresses()
{
	var altId = capId.getCustomID();
	var cadQuery = "exec coa_duplicate_for_address " + AddressValidatedNumber + ",'" + ApplicationTypeLevel1 + "','" + ApplicationTypeLevel2 + "','" + ApplicationTypeLevel3 + "','" + ApplicationTypeLevel4 + "'";
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
            
            //if(possibleDupAltIds.length > 0){
            //    cancel = true;
            //    showMessage = true;
            //    comment("Possible duplicates: " + possibleDupAltIds.substring(0, possibleDupAltIds.length -1));
            //}
        //}
    //}
    //catch(err){
    //    showMessage = true;
    //    comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
    //    logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    //}
//}