//Script 295	Update completeness check to complete when payment made
//Record Types:	PublicWorks/Real Property/Easement/NA
//Event: 		PaymentReceivedAfter (PRA)
//Desc:			When a payment is made and the balance is 0 
//				then update the workflow task Completeness Check 
//				with the workflow status to Complete.
//Created By: Silver Lining Solutions

function script295_UpdateCompletenessCheckPRA() {
	logDebug("script295_UpdateCompletenessCheckPRA started.");
	try{
		if ( balanceDue <= 0 ) {
			closeTask("Completeness Check","Complete","updated via script when balance is zero","updated via script when balance is zero");
			logDebug("script295: updated completeness check to complete!");
			activateTask("Review Distribution");
			
		}
	}
	catch(err){
		showMessage = true;
		comment("script295: Error on custom function script295_UpdateCompletenessCheckPRA(). Please contact administrator. Err: " + err);
		logDebug("script295: Error on custom function script295_UpdateCompletenessCheckPRA(). Please contact administrator. Err: " + err);
	}
	logDebug("script295_UpdateCompletenessCheckPRA() ended.");
};//END script295_UpdateCompletenessCheckPRA();