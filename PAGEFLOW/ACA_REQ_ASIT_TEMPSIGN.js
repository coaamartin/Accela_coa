/*------------------------------------------------------------------------------------------------------/
| Program : ACA_REQ_ASIT_TEMPSIGN
| Event   : PAGEFLOWBEFORE
| Author  : Raymond Province
/------------------------------------------------------------------------------------------------------*/
showDebug = false;

var SCRIPT_VERSION = "3";

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

var capModel = aa.env.getValue("CapModel");
var capId = capModel.getCapID();
var cap = aa.env.getValue("CapModel");
var appInfo = cap.getAppSpecificInfoGroups();
var rowCount = 0;
var message = "";

//load tables 
loadASITables4ACAModified();


//1st table
if (typeof(EVENT_DATES) == "object"){
	Object.prototype.count = function(){
		var count = 0;
		for(var prop in this) {
			if(this.hasOwnProperty(prop))
				count++;
		}
		return count;
	}

rowCount = EVENT_DATES.count(); // row count
}


//Make sure table is not empty
if (rowCount < 1){
	cancel = true; //Stop user
	message = "You must enter at least 1 event date."; 
}


//Error message to display
if(cancel){
	aa.env.setValue("ErrorCode","-2");
	aa.env.setValue("ErrorMessage", message);
}

function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

//Table modified to work in this script only.
function loadASITables4ACAModified() {
// Loads App Specific tables into their own array of arrays.  Creates global array objects
	var gm = cap.getAppSpecificTableGroupModel()
	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();

	while (tai.hasNext())
	  {
	  var tsm = tai.next();

	  if (tsm.rowIndex.isEmpty()) continue;  // empty table exit function

	  var tempObject = new Array();
	  var tempArray = new Array();
	  var tn = tsm.getTableName();
	  
	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');  //Remove spaces, special characters from string // This table *1 - Thistable1

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	
	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{
			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
			}
		var tcol = tsmcoli.next();
		var tobj = tsmfldi.next(); 
		var tval = ""; 
		//Removed getInputValue 
		tval = tobj; 
		
		tempObject[tcol.getColumnName()] = tval;
		}	//end cycle thru fields
	  tempArray.push(tempObject);  // end of record and add to temp array
	  var copyStr = "" + tn + " = tempArray";	//string to eval from unknown table name
	  eval(copyStr);  // move to passed table name
	  }

}

function loadASITables4ACA() {

 	//
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
	//

	var itemCap = capId;
	if (arguments.length == 1)
		{
		itemCap = arguments[0]; // use cap ID specified in args
		var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
		}
	else
		{
		var gm = cap.getAppSpecificTableGroupModel()
		}

	var ta = gm.getTablesMap();


	var tai = ta.values().iterator();

	while (tai.hasNext())
	  {
	  var tsm = tai.next();

	  if (tsm.rowIndex.isEmpty()) continue;  // empty table

	  var tempObject = new Array();
	  var tempArray = new Array();
	  var tn = tsm.getTableName();

	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

	  if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	  var numrows = 1;

	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{

			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
			numrows++;
			}
		var tcol = tsmcoli.next();
		var tval = tsmfldi.next().getInputValue();
		tempObject[tcol.getColumnName()] = tval;
		}
	  tempArray.push(tempObject);  // end of record
	  var copyStr = "" + tn + " = tempArray";
	  logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	  eval(copyStr);  // move to table name
	  }

	}

