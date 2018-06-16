var cap = aa.env.getValue("CapModel");
var useAppSpecificGroupName = false;	
var message = " 1-- ";							
var debug = "";								
var br = "<BR>";							
var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var capIDString = capId.getCustomID();			
var appTypeResult = cap.getCapType();		

var AInfo = new Array();						
loadAppSpecific4ACA(AInfo); 						
var ASIValue = AInfo["PAYING WITH BOND"];

if(ASIValue.equals("Yes") && loadASIT())
{
	if(appTypeResult == "Water/Water/SWMP/Application")
  	{
		if((TotalASITRows("BOND INFORMATION",capId) == "0") 
		{
			logMessage("**ERROR The Number of Units identified in the Units table does not equal the number available units for rent that you indicated.");
		}
	}
}

if (message.indexOf("**ERROR") > 0)
{
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", message);
}

function loadASIT() 
{
	//Verify Page flow has ASI Table
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
	if(!gm)
	{
		return false;
	}
	else
	{
		return true;
	}	
}

function TotalASITRows(tname) 
{

 	// tname: ASI table name
 	// Returns a ASI Table row number
	//

	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
	var tai = ta.iterator();
	var numrows = 0;

		message = message + "111 "+numrows
	while (tai.hasNext())
	  {
	  var tsm = tai.next();
	  var tn = tsm.getTableName();

		message = message + "222 "+tn
      
      if (!tn.equals(tname)) continue;
      if (tsm.rowIndex.isEmpty()) continue; // empty table

   	  var tempObject = new Array();
	  var tempArray = new Array();

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
      var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
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
		var tval = tsmfldi.next();
		var readOnly = 'N';
		if (readOnlyi.hasNext()) 
		{
			readOnly = readOnlyi.next();
		}
		var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
		tempObject[tcol.getColumnName()] = fieldInfo;

		}
		tempArray.push(tempObject);  // end of record
	  }
	  message = message + "333 "+numrows
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

