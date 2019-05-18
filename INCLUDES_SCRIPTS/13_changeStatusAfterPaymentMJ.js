// SCRIPTNUMBER: 13
// SCRIPTFILENAME: 13_changeStatusAfterPaymentMJ.js
// PURPOSE: When payment is made via AA or ACA and the record status of a Marijuana application is
//              "Payment Pending" and the Fee Balance Due is less than or equal to 0, then update the record status to "Pending"
// DATECREATED: 05/18/2019
// BY: SWAKIL
// CHANGELOG: 05/18/2019 , SWAKIL Created this file. 

if (balanceDue <= 0 && appStatus.equals("Payment Pending")) {
	updateAppStatus("Pending", "Updated by PRA;Licenses!Marijuana!~!Application", capId);
}