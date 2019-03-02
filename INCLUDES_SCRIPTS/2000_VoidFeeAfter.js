//2000 - Void Fee After - Code from TruePoint for better way to handle NSF 

var showMessage = false;				// Set to true to see results in popup window
var showDebug = false;				// Set to true to see debug messages in popup window
var message = "";				// Message String
var debug = "";					// Debug String
var br = "<BR>";				// Break Tag

var capId = getCapId();				// CapId object
var cap = aa.cap.getCap(capId).getOutput();	// Cap object
var capStatus = cap.getCapStatus();		// Cap status
var capType = cap.getCapType();     // Cap type

var feeSeqListString = aa.env.getValue("FeeItemsSeqNbrArray");	// invoicing fee item list in string type
var feeSeqList = new Array();					// fee item list in number type
for(xx in feeSeqListString)
{
	feeSeqList.push(Number(feeSeqListString[xx])); 	// convert the string type array to number type array
}

var paymentPeriodList = new Array();	// payment periods, system need not this parameter for daily side

// The fee item should not belong to a POS before set the fee item status to "CREDITED".
if (feeSeqList.length && !(capStatus == '#POS' && capType == '_PER_GROUP/_PER_TYPE/_PER_SUB_TYPE/_PER_CATEGORY'))
{
	// the following method will set the fee item status from 'VOIDED' to 'CREDITED' after void the fee item;
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
	{
		logMessage("Invoicing assessed fee items is successful.");
	}
	else
	{
		logDebug("ERROR: Invoicing the fee items assessed to app # " + capId + " was not successful.  Reason: " +  invoiceResult.getErrorMessage());
	}
}

if (debug.indexOf("ERROR") > 0)
{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
}
else
{
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) 
	{
		aa.env.setValue("ScriptReturnMessage", message);
	}
	if (showDebug)
	{
		aa.env.setValue("ScriptReturnMessage", debug);
	}
}
	
function getCapId()  {

    var s_id1 = aa.env.getValue("PermitId1");
    var s_id2 = aa.env.getValue("PermitId2");
    var s_id3 = aa.env.getValue("PermitId3");

    var s_capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);
    if(s_capResult.getSuccess())
    {
      return s_capResult.getOutput();
    }
    else
    {
      logDebug("ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
      return null;
    }
}

function logDebug(dstr)
{
	debug += dstr + br;
}
	
function logMessage(dstr)
{
	message += dstr + br;
}	