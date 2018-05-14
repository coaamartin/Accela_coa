//
/*
Title : Fees Paid Email and Workflow Updates 
Purpose : If all Fees were paid, and balance is 0, update workflow tasks and send an email
Author: Yazan Barghouth 
 Functional Area : Records
Sample Call:
	checkBalanceSendEmailAndUpdateWf("test_yaz", "Fee Processing", "Fees Paid", "Close", "Closed", "Fees Paid");
	Notes about Email template:
	- a template should be created and used as parameter in the method
	- the created template should have CC/Subject details
	- the created template content should have following variables to display required information:
		$$size$$,$$amountPaid$$,$$utilityPermitNumber$$,$$civilPlanNumber$$
	- the template content should have the constant data (ex, contact aurora ...)
	
	## a template content may look like this:
########
	The payment has processed:
	Amount Paid: $$amountPaid$$
	Utility Permit Number: $$utilityPermitNumber$$
	Civil Plan Number: $$civilPlanNumber$$
	Size of the Wet Tap: $$size$$
	Please contact Aurora water operations for scheduling.
	Phone: 303 326 8645.
########

*/

checkBalanceSendEmailAndUpdateWf("PAYMENT ON WET TAP # 243", "Fee Processing", "Fees Paid", "Close", "Closed", "Fees Paid");

