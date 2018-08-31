//junk script to demonstrate a few EMSE tricks
//written by jmain and amartin

aa.env.setValue("ScriptReturnMessage", "Entering Hello World");

var today = new Date();
var todaystring = today.toString();

//some math
var anumber = 123.4 * 17.45

//build a string
var astring = "Hello!  Today is " + todaystring + " and a number is " + anumber.toString();

aa.env.setValue("ScriptReturnMessage", astring);

//log the record id...
var record = aa.date.getCurrentDate().getYear();
//aa.env.setValue("ScriptReturnMessage", record);

aa.env.setValue("ScriptReturnMessage", record);
logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
