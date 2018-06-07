/*
Event ASA

ASI Field:  Area of Project to Undergo Land Disturbance (acres)
acres < 1 = $450, Acres > 1 and < 5 = $1,200.00 and Acres > 5 = $2,250.00

fee schedule = WAT_SWMP_APP, fee item code = WAT_SWMP_24

and INVOICE it

Written by JMAIN
*/

//get value of the ASI field
logDebug("CAO Script #19 - calc the SWMP fees based on acres...");
var acres = getAppSpecific("Area of Project to Undergo Land Disturbance (acres)");
if (acres != null && acres != "" && !isNaN(parseFloat(acres)))
{
	acres = parseFloat(acres);
}
else
{
	acres = 0.0;
}
logDebug("acres is: " + acres);

//calc the fee
var thefee = 0.0;
if (acres < 1.0)
{
	thefee = 450.00;
}
if (acres >= 1.0 && acres < 5.0)
{
	thefee = 1200.00;
}
if (acres > 5.0)
{
	thefee = 2500.00;
}

var feecode = "WAT_SWMP_24";
var feeschedule = "WAT_SWMP_APP";

//asses the fee
logDebug("Adding custom fee - WAT_SWMP_24 WAT_SWMP_APP $" + thefee);
var feeseqnum = addCustomFee(feecode,feeschedule,"fee for SWMP application","FINAL",thefee,"0052042905");
logDebug("FeeSeqNum is: " + feeseqnum);

//invoice the fee - this is not necessare as WAT_SWMP_24 is auto-invoiced in the configuration (I think)
/*
logDebug("Attempting to invoice WAT_SWMP_24");
var hasbeeninvoiced = invoiceFee(feecode);
if (hasbeeninvoiced)
{
	logDebug("invoiced success!");
}
else
{
	logDebug("invoiced failed!");
}
*/

logDebug("end of script...");



