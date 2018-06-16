var cap = aa.env.getValue("CapModel");
var useAppSpecificGroupName = false;	
var message = " ";							
var debug = " ";								
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
	if(appTypeResult == "Water/Water/SWMP/Application")
  	{
  		var tabLength = TotalASITRows("BOND INFORMATION");
		if(tabLength && tabLength == 0) 
		{
			logMessage("**ERROR Please add Bond Information. ");
		}
	}
}

if (message.indexOf("**ERROR") > 0)
{
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", message);
}



function TotalASITRows(tname,capId) 
{
 	// tname: ASI table name
	// Returns a ASI Table row number
	//
	var numrows = "";
	var tablename = tname;
	//logDebug("  "+tablename);
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

	  if (tsm.rowIndex.isEmpty()) 
	{
		numrows = 0;
		continue;
	}
	    // empty table

	  var tempObject = new Array();
	  var tempArray = new Array();
	  var tn = tsm.getTableName();
	  if (!tn.equals(tablename)) 
	  	{   numrows = false;
	  		continue;
	  	}

	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

	  if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	  numrows = 1;

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
	return numrows;
}

function loadAppSpecific4ACA(thisArr) 
{
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

