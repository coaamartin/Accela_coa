/*------------------------------------------------------------------------------------------------------/
| Program: AddressLoader  Trigger: Batch    
| Version 1.0 - Base Version.  
| 8/14/2017 - nma - adding xapoFailover Y/N logic; fixed issue with null addrType exception
| 8/23/2017 - nma - removed UID logic, including the EXT_UID field, 
|					xapo failover will be a separate script; removed xapoFailover parm
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
/*
var ftpSite = lookup("APO_LP_LOAD_PARAMETERS", "ftpSite");		
var ftpUser = lookup("APO_LP_LOAD_PARAMETERS", "ftpUser");
var ftpPass = lookup("APO_LP_LOAD_PARAMETERS", "ftpPass");
var ftpPort = lookup("APO_LP_LOAD_PARAMETERS", "ftpPort");
var ftpDirectory = lookup("APO_LP_LOAD_PARAMETERS", "ftpDirectory");
*/
var deleteFile = lookup("APO_LP_LOAD_PARAMETERS", "deleteFile");

// load parms from Batch Engine job
var fileName = getParam("fileName");
var emailAddress = getParam("emailAddress");

/* var fileName = "AddressTestFile.csv";
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
	/*cs = aa.proxyInvoker.newInstance("com.accela.aa.util.FTPUtil").getOutput();
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
		docString = openDocument(fileName);
		fContent = "";
		if (docString) {
			while (docString.hasNextLine()) {
				if (elapsed() > maxSeconds) { // only continue if time hasn't expired
					logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
					timeExpired = true ;
					break; 
				}	
				line = docString.nextLine();
				
				// process the line
				var addrArray = new Array();
				var addrArray = processLine(String(line));
				
				// create new or update existing addr, xref with parcel, update templates
				processAddress(addrArray);
			}
		}
	}
	catch (err) {
		logDebug("Error processing file : " + err);
	}
	
	logDebug("Processed " + fileName);
	aa.util.deleteFile(fileName);
} // mainProcess

function processLine(line) {
	try {
		
		var addressModelResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressModel");
		if (addressModelResult.getSuccess()) {
			var newAddr = addressModelResult.getOutput();
			
			var addrBusUtil = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressBusinessUtil").getOutput();
			var sourceSequenceNum = addrBusUtil.getSourceSeqNumber(aa.getServiceProviderCode(), "ADMIN");
			// logDebug("addrBusUtil.sourceSequenceNum: " + sourceSequenceNum);
				
			// set for all addresses
			newAddr.setAuditDate(new Date());
			newAddr.setAuditID("ADMIN");
			newAddr.setAuditStatus("A");
			newAddr.setSourceNumber(sourceSequenceNum);
			
			//  template data update
			var attrArray = new Array(); 
			
			pieces = line.split("|");
			for (pIndex in pieces) {
				pieceValue = pieces[pIndex];
				pieceDataName = lineFormat[pIndex];
				 // logDebug("line value: " + pIndex +  ", " + pieceDataName + ", " + pieceValue);
				
				if (String(pieceValue).trim() == "") continue;

				switch (pieceDataName) {
					case "PARCEL_NO": 
							newAddr.setParcelNumber(String(pieceValue).trim());
							var parcelNum = String(pieceValue).trim();
						break;
					case "FULL_ADDRESS":
							newAddr.setFullAddress(String(pieceValue).trim());
							var fullAddress = String(pieceValue).trim();
						break;
					case "DESCRIPTION": 
							newAddr.setAddressDescription(String(pieceValue).trim());
						break;
					case "STATUS":
							newAddr.setAddressStatus(String(pieceValue).trim());
						break;
					case "CITY":
							newAddr.setCity(String(pieceValue).trim());
						break;
					case "COUNTRY":
							newAddr.setCountryCode(String(pieceValue).trim());
						break;
					case "COUNTY":
							newAddr.setCounty(String(pieceValue).trim());
						break;
					case "DISTANCE":
							newAddr.setDistance(parseFloat(String(pieceValue).trim()));
						break;
					case "EVENT_ID":
							newAddr.setEventID(String(pieceValue).trim());
						break;
					case "HOUSE_FRACTION_END":
							var fractionType = String(pieceValue).trim();
							if (fractionType != " "){
								var returnValue = fractionValidation(fractionType);
								if (returnValue == false){
									logDebug("Address " + fullAddress + " has an invalid Fraction End type of " + fractionType);
								}else{
									newAddr.setHouseFractionEnd(returnValue);
								}
							}
							
						break;
					case "HOUSE_FRACTION_START":
							var fractionType = String(pieceValue).trim();
							if (fractionType != " "){
								var returnValue = fractionValidation(fractionType);
								if (returnValue == false){
									logDebug("Address " + fullAddress + " has an invalid Fraction Start type of " + fractionType);
								}else{
									newAddr.setHouseFractionStart(returnValue);
								}
							}
						break;
					case "HOUSE_NUMBER_ALPHA_END" :
							newAddr.setHouseNumberAlphaEnd(String(pieceValue).trim());
						break;
					case "HOUSE_NUMBER_ALPHA_START":
							newAddr.setHouseNumberAlphaStart(String(pieceValue).trim());
						break;
					case "HOUSE_NUMBER_END":
							newAddr.setHouseNumberEnd(parseInt(String(pieceValue).trim()));
							break;
					case "HOUSE_NUMBER_START":
							newAddr.setHouseNumberStart(parseInt(String(pieceValue).trim()));
							break;
					case "INSPECTION_DISTRICT":
							newAddr.setInspectionDistrict(String(pieceValue).trim());
							break;
					case "INSPECTION_DISTRICT_PREFIX":
						newAddr.setInspectionDistrictPrefix(String(pieceValue).trim());
						break;
					case "LEVEL_NUMBER_END":
						newAddr.setLevelNumberEnd(String(pieceValue).trim());
						break;
					case "LEVEL_NUMBER_START":
						newAddr.setLevelNumberStart(String(pieceValue).trim());
						break;
					case "LEVEL_PREFIX":
							newAddr.setLevelPrefix(String(pieceValue).trim());
						break;
					case "NEIGHBERHOOD_PREFIX":
							newAddr.setNeighberhoodPrefix(String(pieceValue).trim());
						break;
					case "NEIGHBORHOOD":
							newAddr.setNeighborhood(String(pieceValue).trim());
						break;
					case "PRIMARY_FLAG":
							newAddr.setPrimaryFlag(String(pieceValue).trim());
						break;
					case "SECONDARY_ROAD":
							newAddr.setSecondaryRoad(String(pieceValue).trim());
						break;
					case "SECONDARY_ROAD_NUMBER":
							newAddr.setSecondaryRoadNumber(parseFloat(String(pieceValue).trim()));
						break;
					case "SOURCE_FLAG":
							newAddr.setSourceFlag(String(pieceValue).trim());
						break;
					case "STATE":
							newAddr.setState(String(pieceValue).trim());
						break;
					case "STREET_DIRECTION":
							var streetDir = String(pieceValue).trim();
							if (streetDir != " "){
								returnValue = streetDirValidation(streetDir);
								if (returnValue == false){
									logDebug("Address " + fullAddress + " has an invalid Street Direction type of " + streetDir);
								}else{
									newAddr.setStreetDirection(returnValue);
								}
							}
						break;
					case "STREET_NAME":
							newAddr.setStreetName(String(pieceValue).trim());
						break;
					case "STREET_PREFIX":
							newAddr.setStreetPrefix(String(pieceValue).trim());
						break;
					case "STREET_SUFFIX":
							var streetType = String(pieceValue).trim();
							if (streetType != " "){
								var returnValue = streetTypeValidation(streetType);  
								if (returnValue == false){
									logDebug("Address " + fullAddress + " has an invalid Street Type of " + streetType);
								}else{
									newAddr.setStreetSuffix(returnValue);
								}											 	
							}
						break;
					case "STREET_SUFFIX_DIRECTION":
							var streetDir = String(pieceValue).trim();
							if (streetDir != " "){
								var returnValue = streetDirValidation(streetDir);
								if (returnValue == false){
									logDebug("Address " + fullAddress + " has an invalid Street Suffix Direction type of " + streetDir);
								}else{
									newAddr.setStreetSuffixdirection(returnValue);
								}
							}
						break;
					case "UNIT_END":
							newAddr.setUnitEnd(String(pieceValue).trim());
						break;
					case "UNIT_START":
							newAddr.setUnitStart(String(pieceValue).trim());
						break;
					case "UNIT_TYPE":
						var unitType = String(pieceValue).trim();
						if (unitType != " "){
							var returnValue = unitTypeValidation(unitType);
							if (returnValue == false){
								logDebug("Address " + fullAddress + " has an invalid Unit Type of " + unitType);
							}else{
								newAddr.setUnitType(returnValue);
							}	
						}
						break;
					case "VALIDATE_FLAG":
						newAddr.setValidateFlag(String(pieceValue).trim());
						break;
					case "X_COORDINATOR":
						newAddr.setXCoordinator(parseFloat(String(pieceValue).trim()));
						break;
					case "Y_COORDINATOR":
						newAddr.setYCoordinator(parseFloat(String(pieceValue).trim()));
						break;
					case "ZIP":
						newAddr.setZip(String(pieceValue).trim());
						break;
					case "ADDRESS_TYPE":
						var addrType = String(pieceValue).trim();
						// newAddr.setAddressType(addrTypeList);
						break;
					case "ADDRESS_TYPE_FLAG":
						newAddr.setAddressTypeFlag(String(pieceValue).trim());
						break;
					case "ADDRESS_LINE_1":
						newAddr.setAddressLine1(String(pieceValue).trim());
						break;
					case "ADDRESS_LINE_2":
						newAddr.setAddressLine2(String(pieceValue).trim());
						break;
						
					///  APO template fields
					case "TEMPLATE_NAME_1":
						var tempName1 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_NAME_1":
						var attrName1 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_VALUE_1":
						var attrValue1 = String(pieceValue).trim();
						attrArray[1] = new apoAttribute(tempName1, attrName1, attrValue1);
						break;
					case "TEMPLATE_NAME_2":
						var tempName2 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_NAME_2":
						var attrName2 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_VALUE_2":
						var attrValue2 = String(pieceValue).trim();
						attrArray[2] = new apoAttribute(tempName2, attrName2, attrValue2);
						break;
					case "TEMPLATE_NAME_3":
						var tempName3 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_NAME_3":
						var attrName3 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_VALUE_3":
						var attrValue3 = String(pieceValue).trim();
						attrArray[3] = new apoAttribute(tempName3, attrName3, attrValue3);
						break;
					case "TEMPLATE_NAME_4":
						var tempName4 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_NAME_4":
						var attrName4 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_VALUE_4":
						var attrValue4 = String(pieceValue).trim();
						attrArray[4] = new apoAttribute(tempName4, attrName4, attrValue4);
						break;
					case "TEMPLATE_NAME_5":
						var tempName5 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_NAME_5":
						var attrName5 = String(pieceValue).trim().toUpperCase();
						break;
					case "ATTRIBUTE_VALUE_5":
						var attrValue5 = String(pieceValue).trim();
						attrArray[5] = new apoAttribute(tempName5, attrName5, attrValue5);
						break;
					default : break;
				} // switch
			}  // loop line elements, build newAddr model
		
		var returnArray = new Array();
		returnArray.push(parcelNum);
		returnArray.push(addrType);
		returnArray.push(newAddr);
		returnArray.push(attrArray);
		return returnArray;	

		} // got address model
} 
	catch (err) { logDebug("Error processing line " + err); }
} // processLine function

function processAddress(addrArray){
try{	
	for(i in addrArray){
		var parcel = addrArray[0];
		logDebug("parcel " + parcel)
		var addrType = addrArray[1];
		logDebug("addrType " + addrType)
		var addr = addrArray[2];
		logDebug("addr " + addr)
		var attrArray = addrArray[3];
		logDebug("attrArray " + attrArray)
	}
	
		/* does refAddress already exist - search by some key fields */
		var hsNum = addr.getHouseNumberStart();
		var stName = addr.getStreetName();
		var city = addr.getCity();
		var seqNum = parseInt(addr.getSourceNumber());

		searchRefAddressModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressModel").getOutput();

			searchRefAddressModel.setStreetName(stName);
			searchRefAddressModel.setHouseNumberStart(hsNum);
			searchRefAddressModel.setCity(city);

		//Look up the refAddressModel.
		var searchResult = aa.address.getRefAddressByServiceProviderRefAddressModel(searchRefAddressModel);
		
		if (searchResult.getSuccess()){
			var refAddressModelArray = searchResult.getOutput();
			
		// no address, create new
			if (refAddressModelArray == null){   
				addressBusResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressBusiness");
				if (addressBusResult.getSuccess()) {
					addressBus = addressBusResult.getOutput();
					addrID = addressBus.createRefAddress(aa.getServiceProviderCode(), addr);
					logDebug("Successfully CREATED new addr: " + addrID);
					
					if (!matches(parcel, " ", null)) {
						if (addrID >= 0) {
						// look to see if there's a valid parcel and throw error if not
							var refPrclObj = aa.parcel.getParceListForAdmin(parcel, null, null, null, null, null, null, null, null, null);
							if (refPrclObj.getSuccess()) {
								var prclArr = refPrclObj.getOutput();
								logDebug("DONB1")
								if (prclArr.length == 0) {
									logDebug("No valid parcel exists with this number: " + parcel);
								}else{
									xParAddrResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.XParAddrModel");
									if (xParAddrResult.getSuccess()) {
										xParAddrModel = xParAddrResult.getOutput();
										xParAddrModel.setAddrNbr(addrID);
										xParAddrModel.setAuditDate(new Date());
										xParAddrModel.setAuditStatus("A");
										xParAddrModel.setAuditID("ADMIN");
										xParAddrModel.setParcelNbr(parcel);
										xParAddrModel.setSourceSeqNbr(seqNum);
										
										parcelBusResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness");
										if (parcelBusResult.getSuccess()) {
											parcelBus = parcelBusResult.getOutput();
											parcelBus.createXPAddr(aa.getServiceProviderCode(), xParAddrModel);
											// logDebug("Successfully paired with Parcel #: " + parcel);
										}
									}
								}
					
							} 
						}
					}  // xref parcel
					
					// load template data
						var attributeList = buildAttributeList(addressBus, addrID, attrArray);  // local function	
						//logDebug("attributeList " + attributeList);
						try{
							addressBus.editRefAddressWithAPOAttribute(aa.getServiceProviderCode(), addr, attributeList);									
							logDebug("Successfully updated address " + addrID + " template fields.");
						}catch (err){
							logDebug("Error updating attributes: " + err);
						}
						
					// load address types
					// Note: was unable to get this to add more than 1 type at a time, even though it's a List that's being passed
					// more than 1 throws a duplicate exception
					if (!matches(addrType, " ", null)){
						logDebug("addrType: " + addrType);
						var addressTypeList = aa.util.newArrayList();
						var sourceSeqNum = addr.getSourceNumber();
						var types = addrType.split(",");
						var refAddrTypeModelResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressTypeModel");
						if (refAddrTypeModelResult.getSuccess()){
							var addressTypeModel = refAddrTypeModelResult.getOutput();
							for (i in types) {
								var typeValue = types[i].trim();
								 // logDebug("typeValue: " + typeValue);
								var typeFound = addressTypeValidation(typeValue);
								if (typeFound != false){
									addressTypeModel.setServProvCode(aa.getServiceProviderCode());
									addressTypeModel.setRefAddressId(addrID);
									addressTypeModel.setSourceNumber(sourceSeqNum);
									addressTypeModel.setAddrType(typeValue);
									addressTypeModel.setAuditDate(new Date());
									addressTypeModel.setAuditUser("ADMIN");
									addressTypeModel.setAuditStatus("A");
									addressTypeModel.setDescription(" ");
									
									addressTypeList.add(addressTypeModel);
								}else{
									logDebug("Address type " + typeValue + " is not valid.");
								}
							}
							try{
								addressBus.createRefAddressTypeForRef(addressTypeList, "ADMIN");
								logDebug("Successfully updated address types for " + addrID);
							}catch (err){
								if (err != "JavaException: com.accela.aa.exception.ObjectDuplicateException: RefAddressTypeGroupDuplicatedException"){
									logDebug("Error updating address types: " + err);
								}
							}
						} // address type model
					}
					
			}
		// address exists, update eligible fields
			}else{  
				logDebug("DONB2")
				var numOfAdds = refAddressModelArray.length;
				 // logDebug("numOfAdds: " + numOfAdds);
				
				for (i in refAddressModelArray){
					refAddModel = refAddressModelArray[i];
					var addId = refAddModel.getRefAddressId();
					// logDebug("addId: " + addId);
					
					refAddModel.setCounty(addr.getCounty());
					refAddModel.setCountry(addr.getCountry());
					refAddModel.setInspectionDistrict(addr.getInspectionDistrict());
					refAddModel.setXCoordinator(addr.getXCoordinator());
					refAddModel.setYCoordinator(addr.getYCoordinator());
					refAddModel.setAddressDescription(addr.getAddressDescription());
					refAddModel.setFullAddress(addr.getFullAddress());
					refAddModel.setNeighberhoodPrefix(addr.getNeighberhoodPrefix());
					refAddModel.setNeighborhood(addr.getNeighborhood());
					refAddModel.setHouseNumberAlphaEnd(addr.getHouseNumberAlphaEnd());
					refAddModel.setHouseNumberAlphaStart(addr.getHouseNumberAlphaStart());
					refAddModel.setLevelPrefix(addr.getLevelPrefix());
					refAddModel.setLevelNumberStart(addr.getLevelNumberStart());
					refAddModel.setLevelNumberEnd(addr.getLevelNumberEnd());
					refAddModel.setValidateFlag(addr.getValidateFlag());
					refAddModel.setZip(addr.getZip());
					
					var aResult = aa.address.editRefAddress(refAddModel);
					if (aResult.getSuccess()){
						logDebug("Successfully UPDATED ref address " + addId);
					}else{
						logDebug("ERROR updating ref address " + addId + " " + aResult.getErrorMessage());
					}
					
					// determine if address is already associated to the incoming parcel
					if (!matches(parcel, " ", null)) {
						addrParcelList = new Array;
						logDebug("hsNum " + hsNum + "stName " + stName + "city " + city)
						var addrParcelList = getAddressParcels(hsNum, stName, city);     // local function
						logDebug("DONB3 " + addrParcelList)
						//if (addrParcelList.length){
						if (addrParcelList){
							logDebug("DONB5")
							var skip = false;
							for (l in addrParcelList){
								var existingParcel = addrParcelList[l];
								// logDebug("existingParcel: " + existingParcel);
								if (existingParcel == parcel){
									skip = true;    // skip, already associated
								}
							}
						}
						if (!skip){
							// remove and replace parcel 
							try{
								xParAddrResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.XParAddrModel");
								if (xParAddrResult.getSuccess()) {
									xParAddrModel = xParAddrResult.getOutput();
									
								// remove old parcels
									parcelBusResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness");
									if (parcelBusResult.getSuccess()) {
										var parcelBus = parcelBusResult.getOutput();
										for (p in addrParcelList){
											var rParcel = addrParcelList[p];
											
											xParAddrModel.setAddrNbr(addId);
											//xParAddrModel.setAuditDate(new Date());
											//xParAddrModel.setAuditStatus("A");
											//xParAddrModel.setAuditID("ADMIN");
											xParAddrModel.setParcelNbr(rParcel);
											xParAddrModel.setSourceSeqNbr(seqNum);
											parcelBus.removeXParAddrByPK(aa.getServiceProviderCode(), xParAddrModel);
											//logDebug("Successfully removed parcel #: " + rParcel);
										}
									}
									
									// add new parcel
									xParAddrModel.setAddrNbr(addId);
									xParAddrModel.setAuditDate(new Date());
									xParAddrModel.setAuditStatus("A");
									xParAddrModel.setAuditID("ADMIN");
									xParAddrModel.setParcelNbr(parcel);
									xParAddrModel.setSourceSeqNbr(seqNum);
									
									parcelBusResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness");
									if (parcelBusResult.getSuccess()) {
										parcelBus = parcelBusResult.getOutput();
										parcelBus.createXPAddr(aa.getServiceProviderCode(), xParAddrModel);
										//logDebug("Successfully paired with Parcel #: " + parcel);
									}
								}
							}catch(err){
								if (err == "JavaException: com.accela.aa.exception.ObjectDuplicateException: XParAddrDuplicatedException"){
									logDebug("Address " + addId + " is already associated to this parcel: " + parcel);
								}else if(err == "JavaException: com.accela.aa.exception.ObjectNotFoundException: ParcelNotFoundException"){
										logDebug("Error pairing address " + addId + " with parcel " + parcel + " as parcel does not exist.");
								}else{
										logDebug("Error pairing address " + addId + " with parcel " + parcel + " due to error " + err);
								}
							} // err catch
						}  // don't skip, add new parcel
					} // parcel != " ", null
						
						// create address type model list
						// Note: was unable to get this to update more than 1 type at a time, even though it's a List that's being passed
						// more than 1 throws a duplicate exception
					if (!matches(addrType, " ", null)){
						var sourceSeqNum = refAddModel.getSourceNumber();
						var addressTypeList = aa.util.newArrayList();
						var types = addrType.split(",");
						var refAddrTypeModelResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressTypeModel");
						if (refAddrTypeModelResult.getSuccess()){
							var addressTypeModel = refAddrTypeModelResult.getOutput();
							for (i in types) {
								var typeValue = types[i].trim();
								// logDebug("typeValue: " + typeValue);
								var typeFound = addressTypeValidation(typeValue);
								if (typeFound != false){
									//logDebug("loading typeValue: " + typeValue);
									addressTypeModel.setServProvCode(aa.getServiceProviderCode());
									addressTypeModel.setRefAddressId(addId);
									addressTypeModel.setSourceNumber(sourceSeqNum);
									addressTypeModel.setAddrType(typeValue);
									addressTypeModel.setAuditDate(new Date());
									addressTypeModel.setAuditUser("ADMIN");
									addressTypeModel.setAuditStatus("A");
									addressTypeModel.setDescription(" ");
									
									addressTypeList.add(addressTypeModel);
								}else{
									logDebug("Address type " + typeValue + " is not valid.");
								}
							}
						} // address type model
					}
				
					// load template data and address types
					var addressBusResult =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressBusiness");
					if (addressBusResult.getSuccess()) {
						var addressBus = addressBusResult.getOutput();
						// address types
						try{
							if (!matches(addrType, " ", null)){
								addressBus.createRefAddressTypeForRef(addressTypeList, "ADMIN");
								//logDebug("Successfully updated address types for " + addId);
							}
						}catch (err){
							if (err != "JavaException: com.accela.aa.exception.ObjectDuplicateException: RefAddressTypeGroupDuplicatedException"){
								logDebug("Error updating address types: " + err);
							}
						}
						
						// attributes
						var attributeList = buildAttributeList(addressBus, addId, attrArray);  // local function	
						try{
							addressBus.editRefAddressWithAPOAttribute(aa.getServiceProviderCode(), refAddModel, attributeList);									
							//logDebug("Successfully updated address attributes for address " + addId );
						}catch (err){
							logDebug("Error updating attributes: " + err);
						}
					}
				
				
				}  // looping through found addresses 
					
			} // else, address exists
		}  // searchResult
		
	}catch (err){
		logDebug("Error creating or updating address: " + err);
	}	
} // processAddress function		


// helper functions //
function apoAttribute(aTemplateName, aAttrName, aAttrValue) {
			this.fTemplateName = aTemplateName;
			this.fAttrName = aAttrName;
			this.fAttrValue = aAttrValue;
}
function getParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret = "" + aa.env.getValue(pParamName);
	logDebug("Parameter : " + pParamName + " = " + ret);
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

/* Validation Functions */

function streetTypeValidation(csvStreetType){
	var stType = lookupLocal("STREET_TYPE_VALIDATION", csvStreetType);
	if (matches(stType, null, " ")){
		return false;
	}else{
		return stType;
	}
}
function unitTypeValidation(csvUnitType){
	var uType = lookupLocal("UNIT_TYPE_VALIDATION", csvUnitType);
	if (matches(uType, null, " ")){
			return false;
	}else{
		return uType;
	}
}
function fractionValidation(fraction){
	var stFraction = lookupLocal("STREET FRACTIONS", fraction);
	if (matches(stFraction, null, " ")){
		return false;
	}else{
		return stFraction;
	}
}
function streetDirValidation(direction){
	var stDirection = lookupLocal("STREET DIRECTIONS", direction);
	if (matches(stDirection, null, " ")){
		return false;
	}else{
		return stDirection;
	}
}
function addressTypeValidation(addressType){
	var typeMatch = lookupLocal("REF_ADDRESS_TYPE", addressType);
	if (matches(typeMatch, null, " ")){
		return false;
	}else{
		return typeMatch;
	}
}

// added local lookup to prevent debug strings
function lookupLocal(stdChoice,stdValue) {
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

function getAddressParcels(addressStart, streetName, city){
	var parcelInfoModelResult = aa.parcel.getParceListForAdmin(null, addressStart, null, null, streetName, null, null, null, city, null, null, null, null, null, null);
	//logDebug("parcelInfoModelResult: " + parcelInfoModelResult);
	//logDebug("parcelInfoModelResult.getSuccess():" + parcelInfoModelResult.getSuccess());
	if (parcelInfoModelResult.getSuccess()) {
		var addrParcelOutput = parcelInfoModelResult.getOutput();
		//logDebug("addrParcelOutput.length: " + addrParcelOutput.length);
		var parcelArray = new Array();
		logDebug("DONB4")
		if (addrParcelOutput.length) {
			for(i in addrParcelOutput){
				var parcelModel = addrParcelOutput[i].getParcelModel();
				var parcelNumber = parcelModel.getParcelNumber();
				//logDebug("parcelNumber: " + parcelNumber);
				parcelArray.push(parcelNumber);
			}
		}
		//else{
		//	logDebug("No parcels found for this address.");
		// }
		return parcelArray;
	}
}

function buildAttributeList(addressBus, addID, attributeArray){	
	var attributeList = aa.util.newArrayList();
	var attrList = addressBus.getRefAPOAttributes(aa.getServiceProviderCode(), "ADMIN", addID, false);
	// logDebug("attrList: " + attrList);

	var attrListIt = attrList.iterator();
	while(attrListIt.hasNext()){
		var attrObj = attrListIt.next();
		// logDebug("attrObj.getAttributeTemplateName(): " + attrObj.getAttributeTemplateName());
		// logDebug("attrObj.getAttributeName(): " + attrObj.getAttributeName());
		// logDebug("attrObj.getAttributeValue(): " + attrObj.getAttributeValue());
		
		for (a in attributeArray){
			var templateName = attributeArray[a].fTemplateName;
			var attributeName = attributeArray[a].fAttrName;
			var attributeValue = attributeArray[a].fAttrValue;
			// logDebug("templateName: " + templateName);
			// logDebug("attributeName: " + attributeName);
			// logDebug("attributeValue: " + attributeValue);
			if(attributeName != null && attributeName.equals(attrObj.getAttributeName())){
				attrObj.setAttributeValue(attributeValue);
				attributeList.add(attrObj);
				 //logDebug("Attribute " + attrObj.getAttributeName() + " loaded to list with value " + attributeValue);
			}
		}
	}
	return attributeList;
}