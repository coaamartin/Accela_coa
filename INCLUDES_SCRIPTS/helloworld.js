//junk script to demonstrate a few EMSE tricks
//written by jmain and amartin

logDebug("Entering Hello World");

var today = new Date();
var todaystring = today.toString();

//some math
var anumber = 123.4 * 17.45

//build a string
var astring = "Hello!  Today is " + todaystring + " and a number is " + anumber.toString();

logDebug(astring);

//log the record id...
logDebug("The record ID is: " + altID);

logDebug("we're finished with this script");
