//junk script to demonstrate a few EMSE tricks
//written by jmain and amartin

aa.print("Entering Hello World");

var today = new Date();
var todaystring = today.toString();

//some math
var anumber = 123.4 * 17.45

//build a string
var astring = "Hello!  Today is " + todaystring + " and a number is " + anumber.toString();

aa.print(astring);

//log the record id...
var record = aa.cap.getCap(capId).getOutput();
aa.print("The record ID is: " + record);

aa.print("we're finished with this script");
