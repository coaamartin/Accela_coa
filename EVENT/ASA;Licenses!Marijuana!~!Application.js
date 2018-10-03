showDebug = true;
//JMAIN - MJ Application Submittal
include("28_AMEDEmailApplicantAtRecordCreation");

//assess State MJ Licensing Fee on application submit
include("246_AssessStateMJFee");

//schedule pending inspections
include("404_AppAutomationMJ");