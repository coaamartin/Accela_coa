//Script #288 - ID - 8 - untested 3-19-2018 scw
//Record: PublicWorks/RealProperty/Subdivision Plat/NA
//Event: PaymentReceiveAfter 
//Criteria: When all fees are paid in Full (balance = 0) and ""Ready to Pay"" is the last status on 
//Application Acceptance Action then enter status ""Accepted"" in wfTask = Application Acceptance, this 
//should move the workflow forward and activate Review Distribution assigned to user Darren Akire with 
//start date = Today and end date = Today + 5 working days"
//Created by SCW 2018-03-30

//get five business days from today
var fivebusinessdays = dateAdd(null, 5, "Y");
logDebug("5 business days is " + fivebusinessdays);

//determine if "unknown" is the current task
var currenttask = wfTask;
logDebug("currenttask is: " + currenttask);
var correcttask = "Application Acceptance";
var iscorrecttask = false;
if (currenttask == correcttask)
{
	iscorrecttask = true;
}
logDebug("iscorrecttask: " + iscorrecttask);

//determine if the current task status is "Ready to Pay"
var currentstatus = wfStatus;
logDebug("currentstatus is: " + currentstatus);
var statustocheck = "Ready to Pay";
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
	//if (feestatus == "INVOICED")
	//{
		totalfeebalance += feebalance;
	//}
}
logDebug("totalfeebalance: " + totalfeebalance.toString());

// finish if all is as should be
if (iscorrecttask && iscorrectstatus && (totalfeebalance = 0.00))
{
logDebug("Doing a bunch of work...");
	updateTask("Application Acceptance","Accepted", "updated by COA script 8_realpropertyMoveSubdivisionForwardAfterPayment","");
	activateTask("Review Distribution");
	assignTask("Review Distribution","Darren Akire");
	editTaskDueDate("Review Distribution", fivebusinessdays);
	logDebug("Did a bunch of work...");
}
else
{
	logDebug("NOT doing a bunch of work...");
}
