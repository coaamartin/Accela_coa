/*
Written by JMAIN
*/

logDebug("starting script COA #15...")

//are there any fees?
var allfees = loadFees();
var numfees = allfees.length;
logDebug("num fees: " + numfees.toString());

//are any fees invoiced?
var hasbeeninvoiced = false;
for (var fee in allfees)
{
	var feestatus = allfees[fee]["status"];
	if (feestatus.toUpperCase() == "INVOICED")
	{
		hasbeeninvoiced = true;
	}
	//bail if we find one - no need to look any further
	break;
}
logDebug("hasbeeninvoiced: " + hasbeeninvoiced);

//put a message on the website if necessary
if (wfTask == "Fee Processing" && wfStatus == "Ready to Pay" && wfStatus != "No Fees Required" || numfees <= 0 || !hasbeeninvoiced)
{
	cancel = true;
	showMessage = true;
	comment("Fees must be added AND invoiced before Ready to Pay can be activated!");
	logDebug("Fees must be added AND invoiced before Ready to Pay can be activated!");
}

// code to pretty print the content of allfees
/*
for (var fee in allfees)
{	
	logDebug(">>>>>>>" + fee + "<<<<<<<");
	var debugline = "";
	for (var prop in allfees[fee])
	{
		debugline += prop + ":" + allfees[fee][prop] + ", ";
	}
	logDebug(debugline);
}
*/