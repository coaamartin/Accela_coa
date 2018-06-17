var cap = aa.env.getValue("CapModel");
var useAppSpecificGroupName = false;	
var message = " -- ";							
var debug = "";								
var br = "<BR>";							
var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var capIDString = capId.getCustomID();			
var appTypeResult = cap.getCapType();		

var AInfo = new Array();						
loadAppSpecific4ACA(AInfo); 						
var ASIValue = AInfo["PAYING WITH BOND"];

if(ASIValue.equals("Yes"))
{
	loadACAASITables();
	if (typeof(BONDINFORMATION) != "object") {
		message = 'No Rows..';
		message = message +'---'+length
	}

	logMessage("**ERROR ");

	/*if(appTypeResult == "Water/Water/SWMP/Application")
  	{
  		loadASITable("BOND INFORMATION");
		//if(TotalASITRows("BOND INFORMATION",capId) == "0") 
		//{
			logMessage("**ERROR ");
		//}
	}*/
}

if (message.indexOf("**ERROR") > 0)
{
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", message);
}

function loadACAASITables() {
	//logDebugWithThreadID("Loading ASIT for Venue NOC:"+count);
	var gm = cap.getAppSpecificTableGroupModel();
	if(gm == null)
	{
		return;
	}
	var ta = gm.getTablesMap();
	if(ta == null)
	{
		return;
	}
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
			var tval = tsmfldi.next();
			tempObject[tcol.getColumnName()] = tval;
		}
		tempArray.push(tempObject); // end of record
		var copyStr = "" + tn + " = tempArray";
		eval(copyStr); // move to table name
	}
}

function loadAppSpecific4ACA(thisArr){
	//
	// Returns an associative array of App Specific Info
	// Optional second parameter, cap ID to load from
	//
	// uses capModel in this event

	var itemCap = capId;
	if (arguments.length >= 2)
	{
		itemCap = arguments[1]; // use cap ID specified in args
   		var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();
		for (loopk in fAppSpecInfoObj)
			{
			if (useAppSpecificGroupName)
				thisArr[fAppSpecInfoObj[loopk].getCheckboxType().toUpperCase() + "." + fAppSpecInfoObj[loopk].checkboxDesc.toUpperCase()] = fAppSpecInfoObj[loopk].checklistComment;
			else
				thisArr[fAppSpecInfoObj[loopk].checkboxDesc.toUpperCase()] = fAppSpecInfoObj[loopk].checklistComment;
			}
	}
	else
	{
	  var i= cap.getAppSpecificInfoGroups().iterator();
	  while (i.hasNext())
	    {
	     var group = i.next();
	     var fields = group.getFields();
	     if (fields != null)
	        {
	        var iteFields = fields.iterator();
	        while (iteFields.hasNext())
	            {
	             var field = iteFields.next();
       			if (useAppSpecificGroupName)
		     		thisArr[field.getCheckboxType().toUpperCase() + "." + field.getCheckboxDesc().toUpperCase()] = field.getChecklistComment();
		     	else
		     		thisArr[field.getCheckboxDesc().toUpperCase()] = field.getChecklistComment();
		    	}
	        }
	     }
	}
}

function logDebug(dstr)
{
	debug+=dstr + br;
}

function logMessage(dstr) 
{
	message+=dstr + br;
}

