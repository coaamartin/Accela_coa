logDebug("Starting 5140_eMailLicensesContractor.js");
if (appMatch("Licenses/Contractor/General/Application") || appMatch("Licenses/Contractor/General/Renewal")) {
    if (balanceDue == 0) {
       logDebug("Kicking off the license issuance email. ------->")
       //Below we will run the License report script
       var asiValues2 = getAppSpecific("Contractor Type");
       licenseType2 = asiValues2;
       var altID2 = capId.getCustomID();
       appType2 = cap.getCapType().toString();
       //var invoiceNbrObj2 = getLastInvoice({});
       //var invNbr2 = invoiceNbrObj.getInvNbr();
       var vAsyncScript2 = "SEND_EMAIL_LIC_CONT_LIC";
       var emailTo2 = getEmailString2(); 
        var recordApplicant2 = getContactByType("Applicant", capId);
        var firstName2 = recordApplicant.getFirstName();
       var lastName2 = recordApplicant.getLastName();
       var envParameters2 = aa.util.newHashMap();
       envParameters2.put("altID", altID2);
       envParameters2.put("capId", capId);
       envParameters2.put("cap", cap);
       //envParameters2.put("INVOICEID", String(invNbr2));
       envParameters2.put("licenseType", licenseType2);
       envParameters2.put("emailTo", emailTo2);
       envParameters2.put("recordApplicant", recordApplicant2);
       envParameters2.put("firstName", firstName2);
       envParameters2.put("lastName", lastName2);
       logDebug("Starting to kick off ASYNC event for CLL issuance of the license. Params being passed: " + envParameters2);
       aa.runAsyncScript(vAsyncScript2, envParameters2);
       logDebug("---------------------> 5114_EMailReadyLicenseIssue.js ended.");
    }
    }

    function getEmailString2()
    {
       var emailString = "";
       var contactArray = getPeople(capId);
    
       //need to add inspection contact below to this logic 
       for (var c in contactArray)
       {
          if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople())
          {
             emailString += contactArray[c].getPeople().getEmail() + ";";
    
          }
       }
       logDebug(emailString);
       return emailString;
    }
