// Script #77 
// JMPorter - Created 10/22/2018

if ("Application Intake".equals(wfTask) && "Additional Info Needed".equals(wfStatus)) {
	include("5077-Email_Arborist_Applicant_MoreInfoNeeded");
}

if (wfTask == "License Status" && wfStatus == "About to Expire") {
	licEditExpInfo("About to Expire",null); 
}