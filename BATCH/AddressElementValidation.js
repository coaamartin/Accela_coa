/*------------------------------------------------------------------------------------------------------/
| Program: AddressElementValidation  Trigger: Batch    
| Version 1.0 - Base Version. 
| 
| Note: To use this validation script, FULL_ADDRESS has to be populated. This field is used in the report
| generated that identifies invalid entries. If the address can be identified by a unique identifier from
| the legacy system, the FULL_ADDRESS field can be populated with that identifier instead of an address.
| If there are multiple address types that are comma separated, there must be no space between the comma
| and the next value.  
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;				// Set to true to see results in popup window
var disableTokens = false;	
var showDebug = true;					// Set to true to see debug messages in email confirmation
var maxSeconds = 30 * 60;				// number of seconds allowed for batch processing, usually < 5*60
var autoInvoiceFees = "Y";    			// whether or not to invoice the fees added
var useAppSpecificGroupName = false;	// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;	// Use Group name when populating Task Specific Info Values
var currentUserID = "ADMIN";
var publicUser = null;
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var GLOBAL_VERSION = 2.0

var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");
var timeExpired = false;
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";						// Message String
var debug = "";							// Debug String
var br = "<BR>";						// Break Tag
var feeSeqList = new Array();			// invoicing fee list
var paymentPeriodList = new Array();	// invoicing pay periods
var AInfo = new Array();
var partialCap = false;
var SCRIPT_VERSION = 3.0
var emailText = "";

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 
    useSA = true;   
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 
    if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }
    }
    
if (SA) {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));
    eval(getMasterScriptText(SAScript,SA));
    }
else {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
    }

override = "function logDebug(dstr){ if(showDebug) { aa.print(dstr); emailText+= dstr + \"<br>\"; } }";
eval(override);

function getMasterScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
        return emseScript.getScriptText() + ""; 
        } 
	catch(err)
		{
		return "";
		}
}

function getScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
        return emseScript.getScriptText() + ""; 
        } 
	catch(err)
		{
        return "";
		}
}
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

// load parms from Standard Choice
var ftpSite = lookupLocal("APO_LP_LOAD_PARAMETERS", "ftpSite");		
var ftpUser = lookupLocal("APO_LP_LOAD_PARAMETERS", "ftpUser");
var ftpPass = lookupLocal("APO_LP_LOAD_PARAMETERS", "ftpPass");
var ftpPort = lookupLocal("APO_LP_LOAD_PARAMETERS", "ftpPort");
var ftpDirectory = lookupLocal("APO_LP_LOAD_PARAMETERS", "ftpDirectory");
var deleteFile = lookupLocal("APO_LP_LOAD_PARAMETERS", "deleteFile");

// load parms from Batch Engine job
var fileName = getParam("fileName");
var emailAddress = getParam("emailAddress");

/* var fileName = "APO_CSV_Test_File-3.csv";
var emailAddress = "nalbert@accela.com"; */

if (deleteFile == "Y") deleteFile = true; else deleteFile = false;

lineFormat = ["PARCEL_NO", "FULL_ADDRESS", "DESCRIPTION", "STATUS", "CITY", "COUNTRY", "COUNTY", "DISTANCE", "EVENT_ID", "HOUSE_FRACTION_END", "HOUSE_FRACTION_START", 
"HOUSE_NUMBER_ALPHA_END", "HOUSE_NUMBER_ALPHA_START", "HOUSE_NUMBER_END", "HOUSE_NUMBER_START", "INSPECTION_DISTRICT", "INSPECTION_DISTRICT_PREFIX",
"LEVEL_NUMBER_END", "LEVEL_NUMBER_START", "LEVEL_PREFIX", "NEIGHBERHOOD_PREFIX", "NEIGHBORHOOD", "PRIMARY_FLAG", "SECONDARY_ROAD", "SECONDARY_ROAD_NUMBER",
"SOURCE_FLAG", "STATE", "STREET_DIRECTION", "STREET_NAME", "STREET_PREFIX", "STREET_SUFFIX", "STREET_SUFFIX_DIRECTION", 
"UNIT_END", "UNIT_START", "UNIT_TYPE", "VALIDATE_FLAG", "X_COORDINATOR", "Y_COORDINATOR", "ZIP", "ADDRESS_TYPE","ADDRESS_TYPE_FLAG", "ADDRESS_LINE_1", "ADDRESS_LINE_2",
 "TEMPLATE_NAME_1" , "ATTRIBUTE_NAME_1" , "ATTRIBUTE_VALUE_1" , "TEMPLATE_NAME_2" , "ATTRIBUTE_NAME_2" , "ATTRIBUTE_VALUE_2" , 
"TEMPLATE_NAME_3" , "ATTRIBUTE_NAME_3" , "ATTRIBUTE_VALUE_3", "TEMPLATE_NAME_4" , "ATTRIBUTE_NAME_4" , "ATTRIBUTE_VALUE_4", 
"TEMPLATE_NAME_5" , "ATTRIBUTE_NAME_5" , "ATTRIBUTE_VALUE_5"];

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
| 
/-----------------------------------------------------------------------------------------------------*/

try{
	logDebug("The following addresses have elements that could not be validated by the Standard Choice tables.");
	logDebug("To remedy, either change the value in the address to match the values in the tables ");
	logDebug("or update the tables with additional validation values.");
	logDebug(" ");
	logDebug("Start of Job");

	mainProcess();

	logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

	if (emailAddress.length)
		// aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
		email(emailAddress, "noreply@accela.com", batchJobName + " Results", emailText);

} catch (err) {
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

/*| <===========Functions================>*/

function mainProcess() {
	// get the file
	/*
	cs = aa.proxyInvoker.newInstance("com.accela.aa.util.FTPUtil").getOutput();
	FTPUtil = cs;
	try {
		aa.util.deleteFile("c:\\temp\\data.txt"); // delete it if it exists
		ftpClient = new Packages.org.apache.commons.net.ftp.FTPClient;
		ftpClient.connect(ftpSite);
		ftpClient.login(ftpUser, ftpPass);
		ftpClient.changeWorkingDirectory(ftpDirectory);
		ftpClient.setFileType(0); //ascii
		ftpClient.enterLocalPassiveMode();
		fout = new java.io.FileOutputStream("c:\\temp\\data.txt");
		ftpClient.retrieveFile(fileName, fout);
		fout.flush();
		fout.close();
		if (deleteFile) ftpClient.deleteFile(fileName);
		ftpClient.logout();
		ftpClient.disconnect();
	}
	catch (err) {
		logDebug("Error getting file from FTP site : " + err);
		return;
	}
	*/
	try {
		var count = 0;
		docString = openDocument(fileName);
		fContent = "";
		if (docString) {
			
			while (docString.hasNextLine()) {
				if (elapsed() > maxSeconds) { // only continue if time hasn't expired
					logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
					timeExpired = true ;
					break; 
				}
				count++;
				line = docString.nextLine();
				
				// process the line
				var addrArray = new Array();
				var addrArray = processLine(String(line));
				
			}
		}
	
	}
	catch (err) {
		logDebug("Error processing file : " + err);
	}
	logDebug(" ");
	logDebug(count + " rows processed " + "from file " + fileName);
	aa.util.deleteFile(fileName);
} // mainProcess

function processLine(line) {
	try {
	
	var returnValue = true;
	pieces = line.split("|");
	for (pIndex in pieces) {

		pieceValue = pieces[pIndex];
		pieceDataName = lineFormat[pIndex];
		// logDebug("line value: " + pIndex +  ", " + pieceDataName + ", " + pieceValue);
		
		if (String(pieceValue).trim() == "") continue;
		
		if (pieceDataName == "FULL_ADDRESS"){
			var address = String(pieceValue).trim();
		}
		
		switch (pieceDataName) {
			case "FULL_ADDRESS":
				var address = String(pieceValue).trim();
			break;
	
			// fractions 
			case "HOUSE_FRACTION_END":
					var fractionType = String(pieceValue).trim();
					if (fractionType != " "){
						returnValue = fractionValidation(fractionType);
						if (returnValue == false){
							logDebug("Address " + address + " has an invalid Fraction End type of " + fractionType);
						}
					}
				break;
			case "HOUSE_FRACTION_START":;
					var fractionType = String(pieceValue).trim();
					if (fractionType != " "){
						returnValue = fractionValidation(fractionType);
						if (returnValue == false){
							logDebug("Address " + address + " has an invalid Fraction Start type of " + fractionType);
						}
					}
				break;
			
			// direction
			case "STREET_DIRECTION":
					var streetDir = String(pieceValue).trim();
					if (streetDir != " "){
						returnValue = streetDirValidation(streetDir);
						if (returnValue == false){
							logDebug("Address " + address + " has an invalid Street Direction type of " + streetDir);
						}
					}
				break;
				
			// street type
			case "STREET_SUFFIX":
					var streetType = String(pieceValue).trim();
					if (streetType != " "){
						returnValue = streetTypeValidation(streetType);
						if (returnValue == false){
							logDebug("Address " + address + " has an invalid Street Type of " + streetType);
						}
					}
				break;
				
			// direction
			case "STREET_SUFFIX_DIRECTION":
					streetDir = String(pieceValue).trim();
					if (streetDir != " "){
						var returnValue = streetDirValidation(streetDir);
						if (returnValue == false){
							logDebug("Address " + address + " has an invalid Street Suffix Direction type of " + streetDir);
						}
					}
				break;
			
			// unit type
			case "UNIT_TYPE":
				var unitType = String(pieceValue).trim();
				if (unitType != " "){
					returnValue = unitTypeValidation(unitType);
					if (returnValue == false){
						logDebug("Address " + address + " has an invalid Unit Type of " + unitType);
					}
				}
				break;
				
			// address type 
			case "ADDRESS_TYPE":
				var addrType = String(pieceValue).trim();
				var types = addrType.split(",");
				for (i in types) {
					typeValue = types[i];
					returnValue = addressTypeValidation(typeValue);
					if (returnValue == typeValue){
						logDebug("Address " + address + " has an invalid Address Type of " + typeValue);
					}
				}	
			break;
			
			default : break;
		} // switch
	}  // loop line elements
} 
	catch (err) { logDebug("Error processing line " + err); }
} // processLine function


/* Validation Functions */

function streetTypeValidation(csvStreetType){
	var stType = lookupLocal("STREET_TYPE_VALIDATION", csvStreetType);
	if (matches(stType, null, " ")){
			return false;
	}
}
function unitTypeValidation(csvUnitType){
	var uType = lookupLocal("UNIT_TYPE_VALIDATION", csvUnitType);
	if (matches(uType, null, " ")){
			return false;
	}
}
function fractionValidation(fraction){
	var stFraction = lookupLocal("STREET FRACTIONS", fraction);
	if (matches(stFraction, null, " ")){
			return false;
	}
}

function streetDirValidation(direction){
	var stDirection = lookupLocal("STREET DIRECTIONS", direction);
	if (matches(stDirection, null, " ")){
			return false;
	}
}
function addressTypeValidation(type){
	var addType = lookupLocal("REF_ADDRESS_TYPE", type);
	if (matches(addType, null, " ")){
		return type;
	}
}

// batch job functions

function getParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret = "" + aa.env.getValue(pParamName);
	// logDebug("Parameter : " + pParamName + " = " + ret);
	return ret;
}

function isNull(pTestValue, pNewValue) {
	if (pTestValue == null || pTestValue == "")
		return pNewValue;
	else
		return pTestValue;
}

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}


function openDocument(docFilePath) {
	try
		{
			var file = new java.io.File(docFilePath);   
			var fin = new java.io.FileInputStream(file);
			var vstrin = new java.util.Scanner(fin);
			return (vstrin);
		}
	catch (err)
		{
			logDebug("Error reading CSV document: " + err.message);
			return null;
		}
}  //openDocument	

function logDebug(dstr) {
	aa.print(dstr + "\n")
	aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr)
}

// added local lookup to prevent debug strings
function lookupLocal(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		// logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	/* else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		} */
	return strControl;
	}

