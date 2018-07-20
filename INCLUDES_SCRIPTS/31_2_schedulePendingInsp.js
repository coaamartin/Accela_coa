/*Event   PaymentReceiveAfter   
When the invoice on the record is paid and balance = 0 then open a Meter Set 
Inspection and make it schedulable on ACA and email the applicant. Assign the inspection 
for the Water Operations Service Center scheduling bucket.
created by swakil
*/

if (balanceDue == 0)
{
    //add Meter Set Inspection pending inspection
    addPendingInspection("Meter Set Inspection", "Generated by EMSE");
    //email the applicant
    var contact = "Applicant";
    var template = "TAP_PAID";
    //get contact
    var aContact = getContactByType(contact, capId);
    if (aContact) fullName = aContact.getFullName() || aContact.getFirstName() + " " + aContact.getLastName();

    //build ACA URL
    var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
    acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
    var recURL = acaSite + getACAUrl();     

    var emailparams = aa.util.newHashtable();
    emailparams.put("$$date$$", sysDateMMDDYYYY);
    emailparams.put("$$altID$$", capId.getCustomID());
    emailparams.put("$$contactName$$", fullName);
    emailparams.put("$$recLink$$", recURL);
    emailContacts(contact, template, emailparams, "", "", "N", "");
}

function addPendingInspection(iType, inspComm) {
    var inspId = 0;
    var inspectorObj = null;
    var inspTime = null;

    var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(dateAdd(null, 0)), inspTime, iType, inspComm);

    if (schedRes.getSuccess()) {
        inspId = schedRes.output;
        aa.print("inspId = " + inspId);

        var justScheduled = aa.inspection.getInspection(capId, inspId);

        if (justScheduled.getSuccess()) {
            var inspModel = justScheduled.getOutput();

            inspModel.setInspectionStatus("Pending");
            aa.inspection.editInspection(inspModel);
        }
        else {
            aa.print("Failed to get inspection.");
        }

        logDebug("Successfully scheduled pending inspection : " + iType);
    } else {
        logDebug("**ERROR: adding pending scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
    }
}