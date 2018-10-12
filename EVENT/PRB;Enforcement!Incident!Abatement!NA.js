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

//If there is a balance on a snow abatement record ask user to pay that first.
var parentCapId,
parentCapScriptModel,
parentCapTypeString,
parentBalance = 0;

parentCapId = getParent();
if(ifTracer(parentCapId, 'parent found')) {
    parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
    parentCapTypeString = parentCapScriptModel.getCapType().toString();
    if(ifTracer(parentCapTypeString.indexOf('Enforcement/Incident/Snow') > -1, 'parent = Snow Violation Case')) {
        //parent is Snow Violation Case
        parentBalance = getBalanceByCapId("", "", true, parentCapId);
		
		if(parentBalance > 0 && balanceDue == PaymentTotalPaidAmount){
			cancel = true
			showMessage = true;
			comment("Please pay the balance on the Snow Violation parent first.");
		}
    }
}