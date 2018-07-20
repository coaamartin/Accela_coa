/*
Title : Prevent Payment due to Special Assessment (PaymentReceiveBefore?)

Purpose : If record type is Enforcement/Incident/Abatement/NA and if the record status is "Special Assessment" then reject the
payment and raise message "This lien has been transferred to the County under Special Assessment."

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	preventPaymentDueToSpecialAssessment("Special Assessment");
	
Notes:
	- no event was mentioned in the specs, but i think it should be PaymentReceiveBefore (PRB)
*/
//Script 95
preventPaymentDueToSpecialAssessment("Special Assessment");
