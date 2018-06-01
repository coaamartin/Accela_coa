//Written by JMAIN

//determine if "Application Submittal" is the current task
var currenttask = wfTask;
logDebug("currenttask is: " + currenttask);
var correcttask = "Application Submittal";
var iscorrecttask = false;
if (currenttask == correcttask)
{
	iscorrecttask = true;
}
logDebug("iscorrecttask: " + iscorrecttask);

//determine if the current task status is "Accepted"
var currentstatus = wfStatus;
logDebug("currentstatus is: " + currentstatus);
var statustocheck = "Accepted";
var iscorrectstatus = false;
if (currentstatus == statustocheck)
{
	iscorrectstatus = true;
}
logDebug("iscorrectstatus: " + iscorrectstatus);

//Determine if there are fee balances.  Might as well load all fees and iterate through them
var allfees = loadFees();
logDebug(printObject(allfees)); //debug
var numfees = allfees.length;
logDebug("num fees: " + numfees.toString());
var totalfeebalance = 0.00;
for (var fee in allfees)
{
	var feeamt = parseInt(allfees[fee]["amount"]);
	var feepaid = parseInt(allfees[fee]["amountPaid"]);
	var feestatus = allfees[fee]["status"] + "" //force string
	var feebalance = feeamt - feepaid;
	//only consider fee balances that are invoiced
	if (feestatus == "INVOICED")
	{
		totalfeebalance += feebalance;
	}
}
logDebug("totalfeebalance: " + totalfeebalance.toString());

//send some emails if necessary
if (iscorrecttask && iscorrectstatus && (totalfeebalance > 0.00))
	{
		//send emails to the people in allowedcontacttypes
		//what contact types should get an email - comma delimited string of contact types
		var allowedcontacttypes = "Applicant";
			
		//send email to all contacts with the apropriate template and report
		var emailtemplate = "SWMP EMAIL INVOICED FEES";

		
		//populate the email parameters not already included for "free" - must examine the template to know
		var emailparams = aa.util.newHashtable();
		
		
		//call Emmett's emailContacts function - this runs asynchronously - puts "deep link" to report in email
		emailContacts(allowedcontacttypes, emailtemplate, emailparams, "", "", "N", "");
		
		//set wfStatus to "Ready to Pay"
		updateTask("Fee Processing", "Ready to Pay", "script updated Task Status", "script updated Task Status");
		
	}