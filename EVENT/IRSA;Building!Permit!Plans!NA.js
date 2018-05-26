/*
Title : Email Excel Energy on Inspection Result (InspectionResultSubmitAfter)
If the inspection type "QC" has any result and the checklist item "Checklist Temp Meter Release" has a status of "Yes" or
the checklist item "Final Meter Release" has a status of "Yes" then auto send an email to Excel Energy(Email address and
email template to be provided by Aurora). The template will include the checklist comments for those 2 checklist items.

Author: Haitham Eleisah

Functional Area : Records

Notes :
the inspection check list items does not exists so i used another items in order to proceed.

Sample Call:
sendEmailBasedOnInspectionResult("QC", "Did the inspector leave the city facilities by the required time?", "the inspector consistent with the data and results entered into the laptop computer?", Yes", "MESSAGE_NOTICE_PUBLIC WORKS", "heleisa@accle.com");

 */

var InspectionType = [ "Electrical Rough", "Mechanical Rough" ];
var checkListItem1 = "Temporary Meter Release";
var checkListItem2 = "Final Meter Release";
var checkListItemValue = "Yes";
var emailAddress = "rfoggo@accela.com";
var emailTemplate = "BLD EXCEL ENERGY # 260";
sendEmailBasedOnInspectionResult(InspectionType, checkListItem1, checkListItem2, checkListItemValue, emailTemplate, emailAddress);

bldScript6_FinalInspComplete();