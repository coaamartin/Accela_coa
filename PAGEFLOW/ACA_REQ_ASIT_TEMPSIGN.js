// /*------------------------------------------------------------------------------------------------------/
// | Program : ACA_REQ_ASIT_TEMPSIGN
// | Event   : PAGEFLOWBEFORE
// | Author  : Raymond Province
// /------------------------------------------------------------------------------------------------------*/
/------------------------------------------------------------------------------------------------------*/
// | START User Configurable Parameters
// |
// |     Only variables in the following section may be changed.  If any other section is modified, this
// |     will no longer be considered a "Master" script and will not be supported in future releases.  If
// |     changes are made, please add notes above.
// /------------------------------------------------------------------------------------------------------*/




// var showMessage = false; // Set to true to see results in popup window
// var showDebug = false; // Set to true to see debug messages in popup window
// var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
// var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
// var cancel = false;
// var useCustomScriptFile = true;             // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
// /*------------------------------------------------------------------------------------------------------/
// | END User Configurable Parameters
// /------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

try {
	var cap = aa.env.getValue("CapModel");
	var capId = cap.getCapID();
	var capIDString = altId = capId.getCustomID();
	var servProvCode = capId.getServiceProviderCode() // Service Provider Code
	var currentUserID = aa.env.getValue("CurrentUserID");
	if (currentUserID.indexOf("PUBLICUSER") == 0) {
		currentUserID = "ADMIN";
		publicUser = true
	} // ignore public users
	var parentId = cap.getParentCapID();
	var appTypeResult = cap.getCapType();
	var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
	var appTypeArray = appTypeString.split("/"); // Array of application type string
	var currentUserGroup;
	var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
	if (currentUserGroupObj)
		currentUserGroup = currentUserGroupObj.getGroupName();
	var capName = cap.getSpecialText();
	var capStatus = cap.getCapStatus();
	var sysDate = aa.date.getCurrentDate();
	var AInfo = new Array(); // Create array for tokenized variables

	var useAppSpecificGroupName = false;
	loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
} catch (err) {
	showDebug = true;
	logDebug("Error " + err.message + " at " + err.lineNumber + "Stack: " + err.stack);
}


// page flow custom code begin
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
try {

	//Do any pageflow validation scripting for custom lists here for building
	if (appTypeArray[0] == 'Building') {
		//Scripting for Building/Permit/TempSigns/NA
		if (appTypeString == "Building/Permit/TempSigns/NA") {
			myloadASITables4ACA();
			var permitType = AInfo["Temporary Sign Permit"];
			if (permitType == "EVENTS_DATES") {
				if (typeof (EVENTS_DATES) == "object") {
					for (x in EVENTS_DATES) {
						var col1 = EVENTS_DATES[x]["Event Number"];
						var col2 = EVENTS_DATES[x]["Start Date"];
						var col3 = EVENTS_DATES[x]["End Date"];

						logDebug("col1:" + col1 + ";col1.length():" + col1.length());
						logDebug("col2:" + col2 + ";col2.length():" + col2.length());
						logDebug("col3:" + col3 + ";col3.length():" + col3.length());
						if ((col1.length() != 0) || (col2.length() != 0) || (col3.length() != 0)) {
							cancel = false;
						} else
							message += "You must add at least 1 event date." + permitType + ".";
					}
				} else
					message += "You must add at least 1 event date.";
			}
		}
		//end Scripting for Water/Utility/Permit/NA
		showMessage = cancel = message.length ? true : false;

	} //END scriting for water module
} catch (err2) {
	showDebug = true;
	logDebug("Error " + err2.message + " at " + err2.lineNumber + "Stack: " + err2.stack);
}
displayNormalDebugVars(showDebug);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
//debug += "ERROR: TEST 7";
//cancel = true;
//showDebug = true;
//showMessage = true;
if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
		aa.env.setValue("ErrorCode", "0");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	}
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
function displayNormalDebugVars(dispDebug) {
	if (dispDebug) {
		logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
		logDebug("capId = " + capId.getClass());
		logDebug("cap = " + cap.getClass());
		logDebug("currentUserID = " + currentUserID);
		logDebug("appTypeString = " + appTypeString);
		logDebug("sysDate = " + sysDate.getClass());

		logGlobals(AInfo);
	}
}


function myloadASITables4ACA() {

	//
	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
	//

	var itemCap = capId;
	if (arguments.length == 1) {
		itemCap = arguments[0]; // use cap ID specified in args
		var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	} else {
		var gm = cap.getAppSpecificTableGroupModel()
	}

	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();

	while (tai.hasNext()) {
		var tsm = tai.next();

		if (tsm.rowIndex.isEmpty())
			continue; // empty table

		var tempObject = new Array();
		var tempArray = new Array();
		var tn = tsm.getTableName();

		tn = String(tn).replace(/[^a-zA-Z0-9]+/g, '');

		if (!isNaN(tn.substring(0, 1)))
			tn = "TBL" + tn // prepend with TBL if it starts with a number

		var tsmfldi = tsm.getTableField().iterator();
		var tsmcoli = tsm.getColumns().iterator();
		var numrows = 1;

		while (tsmfldi.hasNext()) // cycle through fields
		{
			if (!tsmcoli.hasNext()) // cycle through columns
			{

				var tsmcoli = tsm.getColumns().iterator();
				tempArray.push(tempObject); // end of record
				var tempObject = new Array(); // clear the temp obj
				numrows++;
			}
			var tcol = tsmcoli.next();
			var tval = tsmfldi.next(); //fixed this line
			tempObject[tcol.getColumnName()] = tval;
		}
		tempArray.push(tempObject); // end of record
		var copyStr = "" + tn + " = tempArray";
		logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
		eval(copyStr); // move to table name
	}

}

function logDebug(dstr) {

	if (!aa.calendar.getNextWorkDay) {

		var vLevel = 1
		if (arguments.length > 1)
			vLevel = arguments[1]

		if ((showDebug & vLevel) == vLevel || vLevel == 1)
			debug += dstr + br;

		if ((showDebug & vLevel) == vLevel)
			aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr)
	} else {
		debug += dstr + br;
	}

}


function loadAppSpecific4ACA(thisArr) {
	//
	// Returns an associative array of App Specific Info
	// Optional second parameter, cap ID to load from
	//
	// uses capModel in this event

	var itemCap = capId;
	if (arguments.length >= 2) {
		itemCap = arguments[1]; // use cap ID specified in args

		var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();

		for (loopk in fAppSpecInfoObj) {
			if (useAppSpecificGroupName)
				thisArr[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			else
				thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
		}
	} else {
		var capASI = cap.getAppSpecificInfoGroups();
		if (!capASI) {
			logDebug("No ASI for the CapModel");
		} else {
			var i = cap.getAppSpecificInfoGroups().iterator();

			while (i.hasNext()) {
				var group = i.next();
				var fields = group.getFields();
				if (fields != null) {
					var iteFields = fields.iterator();
					while (iteFields.hasNext()) {
						var field = iteFields.next();

						if (useAppSpecificGroupName)
							thisArr[field.getCheckboxType() + "." + field.getCheckboxDesc()] = field.getChecklistComment();
						else
							thisArr[field.getCheckboxDesc()] = field.getChecklistComment();
					}
				}
			}
		}
	}
}

function logGlobals(globArray) {

	for (loopGlob in globArray)
		logDebug("{" + loopGlob + "} = " + globArray[loopGlob])
}




// showDebug = false;

// var SCRIPT_VERSION = "3";

// eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
// eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

// var capModel = aa.env.getValue("CapModel");
// var capId = capModel.getCapID();
// var cap = aa.env.getValue("CapModel");
// var appInfo = cap.getAppSpecificInfoGroups();
// var rowCount = 0;
// var message = "";

// //load tables 
// loadASITables4ACAModified();


// //1st table
// if (typeof(EventNumber) == "object"){
// 	Object.prototype.count = function(){
// 		var count = 0;
// 		for(var prop in this) {
// 			if(this.hasOwnProperty(prop))
// 				count++;
// 		}
// 		return count;
// 	}

// rowCount = EventNumber.count(); // row count
// }


// //Make sure table is not empty
// if (rowCount < 1){
// 	cancel = true; //Stop user
// 	message = "You must enter at least 1 event date."; 
// }


// //Error message to display
// if(cancel){
// 	aa.env.setValue("ErrorCode","-2");
// 	aa.env.setValue("ErrorMessage", message);
// }

// function getScriptText(vScriptName) {
// 	vScriptName = vScriptName.toUpperCase();
// 	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
// 	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
// 	return emseScript.getScriptText() + "";
// }

// //Table modified to work in this script only.
// function loadASITables4ACAModified() {
// // Loads App Specific tables into their own array of arrays.  Creates global array objects
// 	var gm = cap.getAppSpecificTableGroupModel()
// 	var ta = gm.getTablesMap();
// 	var tai = ta.values().iterator();

// 	while (tai.hasNext())
// 	  {
// 	  var tsm = tai.next();

// 	  if (tsm.rowIndex.isEmpty()) continue;  // empty table exit function

// 	  var tempObject = new Array();
// 	  var tempArray = new Array();
// 	  var tn = tsm.getTableName();

// 	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');  //Remove spaces, special characters from string // This table *1 - Thistable1

//   	  var tsmfldi = tsm.getTableField().iterator();
// 	  var tsmcoli = tsm.getColumns().iterator();

// 	  while (tsmfldi.hasNext())  // cycle through fields
// 		{
// 		if (!tsmcoli.hasNext())  // cycle through columns
// 			{
// 			var tsmcoli = tsm.getColumns().iterator();
// 			tempArray.push(tempObject);  // end of record
// 			var tempObject = new Array();  // clear the temp obj
// 			}
// 		var tcol = tsmcoli.next();
// 		var tobj = tsmfldi.next(); 
// 		var tval = ""; 
// 		//Removed getInputValue 
// 		tval = tobj; 

// 		tempObject[tcol.getColumnName()] = tval;
// 		}	//end cycle thru fields
// 	  tempArray.push(tempObject);  // end of record and add to temp array
// 	  var copyStr = "" + tn + " = tempArray";	//string to eval from unknown table name
// 	  eval(copyStr);  // move to passed table name
// 	  }

// }

// function loadASITables4ACA() {

//  	//
//  	// Loads App Specific tables into their own array of arrays.  Creates global array objects
// 	//
// 	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
// 	//

// 	var itemCap = capId;
// 	if (arguments.length == 1)
// 		{
// 		itemCap = arguments[0]; // use cap ID specified in args
// 		var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
// 		}
// 	else
// 		{
// 		var gm = cap.getAppSpecificTableGroupModel()
// 		}

// 	var ta = gm.getTablesMap();


// 	var tai = ta.values().iterator();

// 	while (tai.hasNext())
// 	  {
// 	  var tsm = tai.next();

// 	  if (tsm.rowIndex.isEmpty()) continue;  // empty table

// 	  var tempObject = new Array();
// 	  var tempArray = new Array();
// 	  var tn = tsm.getTableName();

// 	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

// 	  if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

//   	  var tsmfldi = tsm.getTableField().iterator();
// 	  var tsmcoli = tsm.getColumns().iterator();
// 	  var numrows = 1;

// 	  while (tsmfldi.hasNext())  // cycle through fields
// 		{
// 		if (!tsmcoli.hasNext())  // cycle through columns
// 			{

// 			var tsmcoli = tsm.getColumns().iterator();
// 			tempArray.push(tempObject);  // end of record
// 			var tempObject = new Array();  // clear the temp obj
// 			numrows++;
// 			}
// 		var tcol = tsmcoli.next();
// 		var tval = tsmfldi.next().getInputValue();
// 		tempObject[tcol.getColumnName()] = tval;
// 		}
// 	  tempArray.push(tempObject);  // end of record
// 	  var copyStr = "" + tn + " = tempArray";
// 	  logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
// 	  eval(copyStr);  // move to table name
// 	  }

// 	}