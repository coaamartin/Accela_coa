/* Title :  Validate Reception Number (WorkflowTaskUpdateBefore)

Purpose :   If workflow task = Recordation and status = Recorded and if Custom Field “Reception Number” is null then do not let the
workflow proceed and display the error message “Reception Number is not set and see Info Fields to fill in the reception
number”

Author :   Israa Ismail

Functional Area : Records
 
Sample Call : validateReceptionNumber()

*/

validateReceptionNumber();


//Script 286
//Record Types:	​PublicWorks/Real Property/Subdivision Plat/NA

//Event: 		WTUB
//Desc:			If workflow task = Application Acceptance and status = Ready to Pay 
//				and no Fee exists then do not let the workflow proceed and display 
//				the message “Please add fees to this case to continue”
//Created By: Silver Lining Solutions

logDebug("START: Script 286");
if(wfTask =="Application Acceptance" && wfStatus =="Ready to Pay") {
	if (!hasInvoicedFees(capId, "")) {
		showMessage=true;
        comment("Please add fees to this to continue");
		cancel=true;
  	}
} 
logDebug("END: Script 286");
