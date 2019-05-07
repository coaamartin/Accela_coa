// SCRIPTNUMBER: 5097
// SCRIPTFILENAME: 5097_Enforcement_check4Dups.js
// PURPOSE: Checks for duplicates records based on address and type.  Makes call to stored procedure.
// DATECREATED: 04/10/2019
// BY: amartin
// CHANGELOG: 

logDebug("---------------------> Starting 5097_Enforcement_check4Dups.js ");
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

if (matches(currentUserID,"AMARTIN","JWARTHAN","JMPORTER","JMAIN","DKOONTZ"))
{
	showDebug = true;
} else {
	showDebug = false;	
}
logGlobals(AInfo);

checkForDuplicates();

function checkForDuplicates()
{
	var aQuery = getDuplicateAddresses();
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var ds = initialContext.lookup("java:/AA");
    var conn = ds.getConnection();
    var sStmt = conn.prepareStatement(aQuery);
    var rSet = sStmt.executeQuery();
    var counter = 0;
    while (rSet.next()) {
		counter = counter + 1;
		var foundDuplicate = rSet.getString("Found");
		logDebug("Found a duplicate: " + foundDuplicate);			
	}
    sStmt.close();
    conn.close();
	//logDebug("Done with this:" + counter);
	cleanAndClose(foundDuplicate);
}

function getDuplicateAddresses()
{
	var aQuery = "exec coa_duplicate_for_address " + AddressValidatedNumber + ",'" + ApplicationTypeLevel1 + "','" + ApplicationTypeLevel2 + "','" + ApplicationTypeLevel3 + "','" + ApplicationTypeLevel4 + "'";
	return aQuery;
}

function cleanAndClose(inFlag){
	if(inFlag == "True"){
        cancel = true;
        showMessage = true;
        comment("Possible duplicates found.  Cancelling record creation.");	
	}
}
/*
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
*/
logDebug("---------------------> 5097_Enforcement_check4Dups.js ended.");
