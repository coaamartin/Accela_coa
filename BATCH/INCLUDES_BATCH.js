function getParam(pParamName) //gets parameter value and logs message showing param value
	{
	var ret = "" + aa.env.getValue(pParamName);
	logDebug("Parameter : " + pParamName+" = "+ret);
	return ret;
	}

function isNull(pTestValue,pNewValue)
	{
	if (pTestValue==null || pTestValue=="")
		return pNewValue;
	else
		return pTestValue;
	}

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}

function logMessage(dstr) {
	message += dstr + br;
}

function logDebug(dstr) {

	vLevel = 1
	if (arguments.length > 1)
		vLevel = arguments[1];
	if ((showDebug & vLevel) == vLevel || vLevel == 1)
		debug += dstr + br;
	if ((showDebug & vLevel) == vLevel)
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
}
	
	
function getACAUrl(){

	// returns the path to the record on ACA.  Needs to be appended to the site

	itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args
   	var acaUrl = "";
	var id1 = capId.getID1();
	var id2 = capId.getID2();
	var id3 = capId.getID3();
	var cap = aa.cap.getCap(capId).getOutput().getCapModel();

	acaUrl += "/urlrouting.ashx?type=1000";
	acaUrl += "&Module=" + cap.getModuleName();
	acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
	acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
	return acaUrl;
	}


function addParameter(pamaremeters, key, value)
{
	if(key != null)
	{
		if(value == null)
		{
			value = "";
		}
		
		pamaremeters.put(key, value);
	}
}

function getJobParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret;
	if (aa.env.getValue("paramStdChoice") != "") {
		var b = aa.bizDomain.getBizDomainByValue(aa.env.getValue("paramStdChoice"),pParamName);
		if (b.getSuccess()) {
			ret = b.getOutput().getDescription();
			}	

		ret = ret ? "" + ret : "";   // convert to String
		
		logDebug("Parameter (from std choice " + aa.env.getValue("paramStdChoice") + ") : " + pParamName + " = " + ret);
		}
	else {
			ret = "" + aa.env.getValue(pParamName);
			logDebug("Parameter (from batch job) : " + pParamName + " = " + ret);
		}
	return ret;
}

function getAssignedStaff4Batch(itemCap) {
	try {
		var assignedStaff = "";
		var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
		if (!cdScriptObjResult.getSuccess()) {
			aa.debug("**ERROR: No cap detail script object : ",
					cdScriptObjResult.getErrorMessage());
			return "";
		}

		var cdScriptObj = cdScriptObjResult.getOutput();
		if (!cdScriptObj) {
			aa.debug("**ERROR: No cap detail script object", "");
			return "";
		}
		cd = cdScriptObj.getCapDetailModel();
		assignedStaff = cd.getAsgnStaff();

		return assignedStaff

	} catch (e) {
		aa.debug("getAssignedStaff ", e);
		return null;
	}
}

function isTaskActive4Batch(itemCap, wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, "Y");
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getActiveFlag().equals("Y"))
				return true;
			else
				return false;
	}
}

function assignTask4Batch(itemCap, wfstr,username) // optional process name
	{
	// Assigns the task to a user.  No audit.
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 4) 
		{
		processName = arguments[3]; // subprocess
		useProcess = true;
		}
		
	var taskUserResult = aa.person.getUser(username);
	if (taskUserResult.getSuccess())
		taskUserObj = taskUserResult.getOutput();  //  User Object
	else
		{ logMessage("**ERROR: Failed to get user object: " + taskUserResult.getErrorMessage()); return false; }
		
	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			fTask.setAssignedUser(taskUserObj);
			var taskItem = fTask.getTaskItem();
			var adjustResult = aa.workflow.assignTask(taskItem);
			
			logMessage("Assigned Workflow Task: " + wfstr + " to " + username);
			logDebug("Assigned Workflow Task: " + wfstr + " to " + username);
			}			
		}
	}

function activateTask4Batch(itemCap, wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess) {
				aa.workflow.adjustTask(itemCap, stepnumber, processID, "Y", "N", null, null)
			} else {
				aa.workflow.adjustTask(itemCap, stepnumber, "Y", "N", null, null)
			}
			logMessage("Activating Workflow Task: " + wfstr);
			logDebug("Activating Workflow Task: " + wfstr);
		}
	}
}

function editTaskDueDate4Batch(itemCap, wfstr, wfdate) // optional process name.  if wfstr == "*", set for all tasks
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 4) {
		processName = arguments[3]; // subprocess
		useProcess = true;
	}

	var taskDesc = wfstr;
	if (wfstr == "*") {
		taskDesc = "";
	}
	var workflowResult = aa.workflow.getTaskItems(itemCap, taskDesc, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
			wfObj[i].setDueDate(aa.date.parseDate(wfdate));
			var fTaskModel = wfObj[i].getTaskItem();
			var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
			if (tResult.getSuccess())
				logDebug("Set Workflow Task: " + fTask.getTaskDescription() + " due Date " + wfdate);
			else {
				logMessage("**ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage());
				return false;
			}
		}
	}
}

function getTaskDueDate4Batch(itemCap, wfstr) // optional process name.
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var taskDesc = wfstr;
	if (wfstr == "*") {
		taskDesc = "";
	}
	var workflowResult = aa.workflow.getTaskItems(itemCap, taskDesc, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dueDate = wfObj[i].getDueDate();
			if (dueDate)
				return new Date(dueDate.getMonth() + "/" + dueDate.getDayOfMonth() + "/" + dueDate.getYear());
		}
	}
} 

/**
 * Format a ScriptDate mm/dd/yyyy
 * @param scriptDate
 * @returns {String} formatted date
 */
function formatDateX(scriptDate) {
	var ret = "";
	ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
	ret += "/";
	ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
	ret += "/";
	ret += scriptDate.getYear();
	return ret;
}



function days_between_batch(date1, date2) {



    // The number of milliseconds in one day

    var ONE_DAY = 1000 * 60 * 60 * 24



    // Convert both dates to milliseconds

    var date1_ms = date1.getEpochMilliseconds()

    var date2_ms = date2.getEpochMilliseconds()



    // Calculate the difference in milliseconds

    var difference_ms = Math.abs(date1_ms - date2_ms)



    // Convert back to days and return

    return Math.round(difference_ms/ONE_DAY)



}
