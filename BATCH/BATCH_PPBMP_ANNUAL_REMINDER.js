/*------------------------------------------------------------------------------------------------------/
| SharePoint Script Id  : 103
| Script Name           : BATCH_PPBMP_ANNUAL_REMINDER
| Event                 : Batch
| Description           : Property owner on Water/Water/PPBMP/NA records each year will receive a notice that an annual report is due.
|                         Job will check the property record that the owner on the PPBMP record is a match.
|                         If not, the owner on the property record will be copied to the transaction record.
|                         The old owner will not be removed.
|                         A report will be generated with a list of records that had new owners added.
| Author                : Nickie Albert
| Date                  : 11/2017
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
message = "";
br = "<br>";
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

try {

	showDebug = false;
	var disableTokens = false;
	showMessage = true;
	if (String(aa.env.getValue("showDebug")).length > 0) {
		showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
	}
	//	override = "function logDebug(dstr){ if(showDebug) { aa.print(dstr); emailText+= dstr + \"<br>\"; } }";
	//	eval(override);

	var currentUserID = "ADMIN";
	sysDate = aa.date.getCurrentDate();
	batchJobResult = aa.batchJob.getJobID();
	batchJobName = "" + aa.env.getValue("BatchJobName");
	batchJobID = 0;
	if (batchJobResult.getSuccess()) {
		batchJobID = batchJobResult.getOutput();
		logMessage("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
	} else {
		logDebug("Batch job ID not found " + batchJobResult.getErrorMessage() + br);
	}

	var vEmailFrom = "";
	var vEmailTo = "";
	var vEmailCC = "";

	if (aa.env.getValue("FromEmail") != null && aa.env.getValue("FromEmail") != "") {
		vEmailFrom = aa.env.getValue("FromEmail");
	}
	if (aa.env.getValue("ToEmail") != null && aa.env.getValue("ToEmail") != "") {
		vEmailTo = aa.env.getValue("ToEmail");
	}
	if (aa.env.getValue("CCEmail") != null && aa.env.getValue("CCEmail") != "") {
		vEmailCC = aa.env.getValue("CCEmail");
	}

	/*----------------------------------------------------------------------------------------------------/
	|
	| Start: BATCH PARAMETERS
	|
	/------------------------------------------------------------------------------------------------------*/

	// Get parameters
	var appGroup = getParam("appGroup");
	var appTypeType = getParam("appTypeType");
	var appSubtype = getParam("appSubtype");
	var appCategory = getParam("appCategory");
	var appStatusList = getParam("appStatusList");
	var emailAddress = getParam("emailAddress");

	//test parms
	/* var appGroup = "Water";
	var appTypeType = "Water";
	var appSubtype = "PPBMP";
	var appCategory = "NA";
	var appStatusList = "Active"
	var emailAddress = "nalbert@accela.com"; */

	/* ----------------------------------------------------------------------------------------------------/
	|
	| End: BATCH PARAMETERS
	|
	/------------------------------------------------------------------------------------------------------*/
	var startDate = new Date();

	//var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	//acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

	var startTime = startDate.getTime(); // Start timer
	var systemUserObj = aa.person.getUser("ADMIN").getOutput();

	if (appGroup == "")
		appGroup = "*";
	if (appTypeType == "")
		appTypeType = "*";
	if (appSubtype == "")
		appSubtype = "*";
	if (appCategory == "")
		appCategory = "*";
	var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;
	// logDebug("appType: " + appType);

	/*------------------------------------------------------------------------------------------------------/
	| <===========Main=Loop================>
	|
	/-----------------------------------------------------------------------------------------------------*/

	logMessage("Start of Job");

	mainProcess();

	logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds" + br);

	if (emailAddress.length)
		aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", message);

}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
catch (err) {
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber + br);
	logDebug("Stack: " + err.stack + br);
}
/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " - Error", debug);
} else {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) {
		aa.env.setValue("ScriptReturnMessage", message);
		aa.env.setValue("ScriptReturnDebug", "");
		aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results", message);
	}
	if (showDebug) {
		aa.env.setValue("ScriptReturnMessage", debug);
		aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results - Debug", debug);
	}
}
/*------------------------------------------------------------------------------------------------------/
| FUNCTIONS (mainProcess is the core function for processing expiration records)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	//Counters

	var totalCapsProcessed = 0;
	var capCount = 0;
	var totalCapsFound = 0;
	var emailSent = 0;
	var altIdlist = "";

	var timeExpired = false;

	//Timeout variable
	var maxSeconds = 120 * 60;

	var capIdArrayList = [];
	statusList = appStatusList.split(",");
	for (s in statusList) {
		thisStatus = statusList[s].trim();

		var capModelResult = aa.cap.getCapModel();
		var capModel = capModelResult.getOutput();
		var capTypeModel = capModel.getCapType();
		appTypeArr = appType.split("/");
		if (appTypeArr[0] != "*") {
			capTypeModel.setGroup("" + appGroup);
		}
		if (appTypeArr[1] != "*") {
			capTypeModel.setType("" + appTypeType);
		}
		if (appTypeArr[2] != "*") {
			capTypeModel.setSubType("" + appSubtype);
		}
		if (appTypeArr[3] != "*") {
			capTypeModel.setCategory("" + appCategory);
		}
		capModel.setCapType(capTypeModel);
		capModel.setCapStatus(thisStatus);
		capIdResult = aa.cap.getCapIDListByCapModel(capModel);
		if (capIdResult.getSuccess()) {
			thisRecordList = capIdResult.getOutput()
				capIdArrayList.push(thisRecordList)
				totalCapsFound += thisRecordList.length
				//logDebug("Found "+thisRecordList.length+" records with status "+thisStatus)
				// logDebug("rec type: " + appTypeArr[2]);
		}
	}

	var l = 0;
	// loop through array
	for (l in capIdArrayList) {
		if (elapsed() > maxSeconds) {
			logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed." + br);
			timeExpired = true;
			break;
		}
		capList = capIdArrayList[l]

			//Process record list
			for (thisCap in capList) {
				//logDebug(" ");
				totalCapsProcessed = totalCapsProcessed + 1;

				if (elapsed() > maxSeconds) {
					logDebug("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed." + capCount + br);
					timeExpired = true;
					break;
				}
				var foundRecord = capList[thisCap];

				capId = aa.cap.getCapID(foundRecord.getCapID().getID1(), foundRecord.getCapID().getID2(), foundRecord.getCapID().getID3()).getOutput();
				if (!capId) {
					logDebug("Could not get a Cap ID for " + foundRecord.getCapID().getID1() + "-" + foundRecord.getCapID().getID2() + "-" + foundRecord.getCapID().getID3() + br);
					continue;
				}
				altId = capId.getCustomID();
				//logDebug("record found: " + altId);

				var capOutput = aa.cap.getCap(capId).getOutput();
				var capStatus = capOutput.getCapStatus();

				// update owner on record
				// get owners on Cap
				var capOwnerArray = getOwner(capId);
				var capOwnerArrLength = capOwnerArray.length;
				//logDebug("capOwnerArrLength: " + capOwnerArrLength);

				// get primary owner on parcel
				var parcelOwnerPrimary = getPrimaryOwnerByParcel();
				//var parcelownerArrLength = parcelOwnerArray.length;
				//logDebug("parcelOwnerPrimary: " + parcelOwnerPrimary);

				// compare cap owners and primary parcel owner
				// if no matches found, copy owner from parcel to record

				var matchFound = false;
				for (var a = 0; a < capOwnerArrLength; a++) {
				var match = isMatchOwner(capOwnerArr[a], parcelOwnerPrimary);
				//logDebug("match: " + match);
				if (match) {
				matchFound = true;
				break;
				}
				}
				var capsUpdated = [];
				if (!matchFound) {
				//updateCapOwnersByParcel();
				copyOwnersByParcel_Local();
				capsUpdated.push(altId);
				}
				// send email to primary owner

				var dueDate = dateAdd(null, 0); // will need to find out if there's a due date for report to be submitted
				//var ownerEmail = parcelOwnerPrimary.getEmail();
				var ownerEmail = getPrimaryOwnerEmail();
				var applicantEmail = getContactEmailAddress("Applicant", capId) == false ? "" : getContactEmailAddress("Applicant", capId);
				//logDebug("ownerEmail: " + ownerEmail);

				//Add parameters
				var replyEmail = "noreply@accela.com";
				var params = aa.util.newHashtable();
				addParameter(params, "$$altID$$", capId.getCustomID());
				addParameter(params, "$$dueDate$$", dueDate);
				sendNotificationLocal(replyEmail, ownerEmail, applicantEmail, "PPBMP_ANNUAL_REMINDER", params, null);
				emailSent++;

				altIdlist += capId.getCustomID() + ",";

			} //process record

		//Print some numbers
		logMessage("Sent notifications for records: " + altIdlist.slice(0, -1));
		logMessage("Total CAPS processed: " + totalCapsProcessed);
		logMessage("Total emails sent: " + emailSent);
	} // loop through found records
	
	if (capsUpdated.length > 0) {
		logMessage("The following records had updates to the Primary Owner from the Parcel record:");
		var o = 0;
		for (o in capsUpdated) {
			logMessage(capsUpdated[o]);
		}
	}
	
}
/*-----------------------------------------------------------
Helper Functions
------------------------------------------------------------*/

function getPrimaryOwnerByParcel() {
	//get parcel(s) by capid
	var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

	if (parcels.getSuccess()) {
		parcels = parcels.getOutput();
		if (parcels == null || parcels.length == 0) {
			aa.print("There are no parcels for this cap.");
		} else {
			//get owner(s) by parcel(s)
			for (var i = 0; i < parcels.length; i++) {
				var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
				var parcelNbr = parcels[i].getParcelNumber();

				if (parcelOwnersResult.getSuccess()) {
					//logDebug("parcelNbr " + parcelNbr);
					var ownerArr = parcelOwnersResult.getOutput();
					for (x in ownerArr) {
						if (ownerArr[x].getPrimaryOwner() == "Y") {
							var parcelOwner = ownerArr[x];
							return parcelOwner;
						}
					}
				} else {
					aa.print("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
				}
			}
		}
	}
}

function getOwner(capId) {
	capOwnerArr = null;
	var s_result = aa.owner.getOwnerByCapId(capId);
	if (s_result.getSuccess()) {
		capOwnerArr = s_result.getOutput();
		if (capOwnerArr == null || capOwnerArr.length == 0) {
			logDebug("WARNING: no Owner on this CAP:" + capId);
			capOwnerArr = null;
		}
	} else {
		logDebug("ERROR: Failed to Owner: " + s_result.getErrorMessage());
		capOwnerArr = null;
	}
	return capOwnerArr;
}

function isMatchOwner(ownerScriptModel1, ownerScriptModel2) {
	if (ownerScriptModel1 == null || ownerScriptModel2 == null) {
		return false;
	}
	var fullName1 = ownerScriptModel1.getOwnerFullName();
	var fullName2 = ownerScriptModel2.getOwnerFullName();

	//logDebug("fullName1: " + fullName1);
	//logDebug("fullName2: " + fullName2);
	if ((fullName1 == null && fullName2 != null)
		 || (fullName1 != null && fullName2 == null)) {
		return false;
	}
	if (fullName1 != null && !fullName1.equals(fullName2)) {
		return false;
	}
	return true;
}
function updateCapOwnersByParcel() {
	//loads the parcels on the record, looks up the parcels' owners, and adds them
	try {
		var ownerNumberList = new Array();
		var ownerRefNumber = "";
		var firstLoop = true;
		var duplicateOwner = false;

		// remove current owners on record
		var recOwners = aa.owner.getOwnerByCapId(capId).getOutput()
			for (pntOwner in recOwners) {
				aa.owner.removeCapOwnerModel(recOwners[pntOwner]);
			}

			//get record's parcel(s)
			var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

		if (parcels.getSuccess()) {
			parcels = parcels.getOutput();
			if (parcels == null || parcels.length == 0) {
				logDebug("No parcels available for this record");
			} else {
				//get owner(s) by parcel(s) and add to record
				for (var i = 0; i < parcels.length; i++) {
					var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
					var parcelNbr = parcels[i].getParcelNumber();
					var parcelUID = parcels[i].getParcelModel().getUID();
					if (parcelOwnersResult.getSuccess()) {
						var actuallyParcelNumber = parcelNbr != null ? parcelNbr : parcelUID;
						//aa.print("");
						//aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
						var ownerArr = parcelOwnersResult.getOutput();
						//aa.print("Size :" + ownerArr.length);
						for (j = 0; j < ownerArr.length; j++) {
							ownerRefNumber = ownerArr[j].getL1OwnerNumber();
							//aa.print("Looking at ref owner: " + ownerRefNumber);
							duplicateOwner = false;

							if (firstLoop) {
								ownerArr[j].setCapID(capId);
								ownerArr[j].setPrimaryOwner("N");
								aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
								//aa.print("Added first owner: " + ownerArr[j].getOwnerFullName() + ", #" + ownerArr[j].getL1OwnerNumber());
								ownerNumberList.push(ownerArr[j].getL1OwnerNumber());
								firstLoop = false;
							} else {
								// Look for duplicates
								for (k = 0; k < ownerNumberList.length; k++) {
									if (ownerNumberList[k] == ownerRefNumber) {
										duplicateOwner = true;
										//aa.print("Found duplicate");
										break;
									}
								}
								if (!duplicateOwner) {
									ownerArr[j].setCapID(capId);
									ownerArr[j].setPrimaryOwner("N");
									aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
									//aa.print("Added owner: " + ownerArr[j].getOwnerFullName() + ", #" + ownerArr[j].getL1OwnerNumber());
									ownerNumberList.push(ownerArr[j].getL1OwnerNumber());
								}
							}
						}
					} else {
						logDebug("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
					}
				}
			}
		}
	} catch (err) {
		comment("A JavaScript Error occurred:  Custom Function: updateCapOwnersByParcel(): " + err.message);
	}
}

/*
|  some standard help functions
 */
function getParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret = "" + aa.env.getValue(pParamName);
	logDebug("Parameter : " + pParamName + " = " + ret);
	return ret;
}
function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}

function convertDate(thisDate) {

	if (typeof(thisDate) == "string") {
		var retVal = new Date(String(thisDate));
		if (!retVal.toString().equals("Invalid Date"))
			return retVal;
	}

	if (typeof(thisDate) == "object") {
		if (!thisDate.getClass) // object without getClass, assume that this is a javascript date already
		{
			return thisDate;
		}

		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) {
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
		}

		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) {
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
		}

		if (thisDate.getClass().toString().equals("class java.util.Date")) {
			return new Date(thisDate.getTime());
		}

		if (thisDate.getClass().toString().equals("class java.lang.String")) {
			return new Date(String(thisDate));
		}
	}

	if (typeof(thisDate) == "number") {
		return new Date(thisDate); // assume milliseconds
	}

	logDebug("**WARNING** convertDate cannot parse date : " + thisDate);
	return null;

}

function dateDiff(date1, date2) {
	return (convertDate(date2).getTime() - convertDate(date1).getTime()) / (1000 * 60 * 60 * 24);
}

// added to avoid success message everytime email is sent
function sendNotificationLocal(emailFrom, emailTo, emailCC, templateName, params, reportFile) {

	var itemCap = capId;

	if (arguments.length == 7)
		itemCap = arguments[6]; // use cap ID specified in args


	var id1 = itemCap.ID1;

	var id2 = itemCap.ID2;

	var id3 = itemCap.ID3;

	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);

	var result = null;

	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);

	if (result.getSuccess()) {

		//logMessage("Sent email successfully!");

		return true;

	} else {

		logDebug("Failed to send mail. - " + result.getErrorType());

		return false;

	}

}

function getContactEmailAddress(contType, itemCap) {
	var thisContact = getContactByType(contType, itemCap);
	var thisContEmailAddr = thisContact.getEmail();

	if (thisContEmailAddr)
		return thisContEmailAddr;
	return false;
}

function copyOwnersByParcel_Local() {
	//get parcel(s) by capid
	var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

	if (parcels.getSuccess()) {
		parcels = parcels.getOutput();
		if (parcels == null || parcels.length == 0) {
			logDebug("No parcels available for this record");
		} else {
			//get owner(s) by parcel(s)
			for (var i = 0; i < parcels.length; i++) {
				var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
				var parcelNbr = parcels[i].getParcelNumber();
				var parcelUID = parcels[i].getParcelModel().getUID();
				if (parcelOwnersResult.getSuccess()) {
					var actuallyParcelNumber = parcelNbr != null ? parcelNbr : parcelUID;
					//aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
					var ownerArr = parcelOwnersResult.getOutput();
					//aa.print("Size :" + ownerArr.length);
					for (j = 0; j < ownerArr.length; j++) {
						ownerArr[j].setCapID(capId);
						var vResult = aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
						logMessage("Created new owner on " + capId.getCustomID() + " : " + vResult.getSuccess());
					}
				} else {
					logDebug("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
				}
			}
		}
	}
}
