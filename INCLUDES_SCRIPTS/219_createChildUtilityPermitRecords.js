script219_createChildUtilityPermitRecords();

function script219_createChildUtilityPermitRecords() {
    var emailParams,
        parentAppName;

    if (ifTracer(wfTask=="Plans Coordination Status" && wfStatus=="Water Review",'wfTask == Plans Coordination Status && wfStatus == Water Review')) {
        var  waterMainUtilityPermit = getTaskSpecific(wfTask,"Water Main Utility Permit");
        if(waterMainUtilityPermit == 'Yes') {
            emailParams = aa.util.newHashtable();
            parentAppName = aa.cap.getCap(capId).getOutput().specialText;

            createTempChildGeneric('','','','', {
                appName = parentAppName + " – Water Utility Main Permit",
                accessByACA = true,
                copyParcels: true,
                copyAddresses: true,
                copyOwner: true,
                copyContacts: true,
                customFields: [
                    { key: "Utility Permit Type", val: "waterMainUtilityPermit" }
                ]
            });
            emailContactsWithCCs(
                "Applicant", 
                "PW CIVIL PLAN - CREATE WUP #217", 
                emailParams, 
                "", 
                aa.util.newHashtable(), 
                "N", 
                "", 
                "All"
            );

        }
    } else if (ifTracer(wfTask=="Water Review",'wfTask == Water Review')) {
        var sanitarySewerUtilityPermit = getTaskSpecific(wfTask,"Sanitary Sewer Utility Permit");
        if(sanitarySewerUtilityPermit == 'Yes') {
            emailParams = aa.util.newHashtable();
            parentAppName = aa.cap.getCap(capId).getOutput().specialText;

            createTempChildGeneric('','','','', {
                appName = parentAppName + " – Sanitary Sewer Utility Permit",
                accessByACA = true,
                copyParcels: true,
                copyAddresses: true,
                copyOwner: true,
                copyContacts: true,
                customFields: [
                    { key: "Utility Permit Type", val: sanitarySewerUtilityPermit }
                ]
            });
            emailContactsWithCCs(
                "Applicant", 
                "PW CIVIL PLAN - CREATE WUP #217", 
                emailParams, 
                "", 
                aa.util.newHashtable(), 
                "N", 
                "", 
                "All"
            );

        }
    } else if (ifTracer(wfTask=="Water Review",'wfTask == Water Review')) {
        var publicStormSewerUtilityPermit = getTaskSpecific(wfTask,"Public Storm Sewer Utility Permit");
        if(publicStormSewerUtilityPermit == 'Yes') {
            emailParams = aa.util.newHashtable();
            parentAppName = aa.cap.getCap(capId).getOutput().specialText;

            createTempChildGeneric('','','','', {
                appName = parentAppName + " – Public Storm Sewer Utility Permit",
                accessByACA = true,
                copyParcels: true,
                copyAddresses: true,
                copyOwner: true,
                copyContacts: true,
                customFields: [
                    { key: "Utility Permit Type", val: publicStormSewerUtilityPermit }
                ]
            });
            emailContactsWithCCs(
                "Applicant", 
                "PW CIVIL PLAN - CREATE WUP #217", 
                emailParams, 
                "", 
                aa.util.newHashtable(), 
                "N", 
                "", 
                "All"
            );

        }
    } else if (ifTracer(wfTask=="Water Review",'wfTask == Water Review')) {
        var privateStormSewerUtilityPermit = getTaskSpecific(wfTask,"Private Storm Sewer Utility Permit");
        if(privateStormSewerUtilityPermit == 'Yes') {
            emailParams = aa.util.newHashtable();
            parentAppName = aa.cap.getCap(capId).getOutput().specialText;

            createTempChildGeneric('','','','', {
                appName = parentAppName + " – Private Storm Sewer Utility Permit",
                accessByACA = true,
                copyParcels: true,
                copyAddresses: true,
                copyOwner: true,
                copyContacts: true,
                customFields: [
                    { key: "Utility Permit Type", val: privateStormSewerUtilityPermit }
                ]
            });
            emailContactsWithCCs(
                "Applicant", 
                "PW CIVIL PLAN - CREATE WUP #217", 
                emailParams, 
                "", 
                aa.util.newHashtable(), 
                "N", 
                "", 
                "All"
            );

        }
    } else if (ifTracer(wfTask=="Water Review",'wfTask == Water Review')) {
        var privateFireLineUtilityPermit = getTaskSpecific(wfTask,"Private Fire Line Utility Permit");
        if(privateFireLineUtilityPermit == 'Yes') {
            emailParams = aa.util.newHashtable();
            parentAppName = aa.cap.getCap(capId).getOutput().specialText;

            createTempChildGeneric('','','','', {
                appName = parentAppName + " – Private Fire Line Utility Permit",
                accessByACA = true,
                copyParcels: true,
                copyAddresses: true,
                copyOwner: true,
                copyContacts: true,
                customFields: [
                    { key: "Utility Permit Type", val: privateFireLineUtilityPermit }
                ]
            });
            emailContactsWithCCs(
                "Applicant", 
                "PW CIVIL PLAN - CREATE WUP #217", 
                emailParams, 
                "", 
                aa.util.newHashtable(), 
                "N", 
                "", 
                "All"
            );

        }
    }

}