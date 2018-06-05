//Check if owner is doing the work, if not and there is no contractor in the record prevent issuance. 
//Script 2 part2
//By: Tony Ledezma
function bldScrit2_noContractorCheck(){
    logDebug("bldScrit2_noContractorCheck() started");
    try{
        var $iTrc = ifTracer,
            ownerIsContractor = AInfo["Homeowner acting as Contractor"] == "Yes" ? true : false,
            lpOnFile = false,
            ownerApplicantMatch = false,
            cancelMsg = "",
            applicant = getContactByType("Applicant",capId);
        
        if($iTrc(wfTask == "Permit Issuance" && wfStatus == "Issued", 'wf:Permit Issuance/Issued')){
            var licProfResult = aa.licenseScript.getLicenseProf(capId);
            if (!licProfResult.getSuccess()){
                logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
                //return false;
            }
            else{
                var licProfList = licProfResult.getOutput();
                if(licProfList && licProfList.length > 0) lpOnFile = true;
            }
            
            var applicantName = applicant.getFirstName() + applicant.getLastName();
            var applicantEmailAddrs = applicant.getEmail();
            if(getPrimaryOwnerFirstAndLastName().toUpperCase() == applicantName.toUpperCase()) ownerApplicantMatch = true;
            
            if($iTrc((!ownerIsContractor && !lpOnFile) || !ownerApplicantMatch, '(!ownerIsContractor && !lpOnFile) || !ownerApplicantMatch'))
                cancelMsg = "Contractor is not attached to Permit";
            
            cancel = showMessage = cancelMsg.length > 0;
            
            if(cancel) {
                if(email){
                    var emailResult = aa.sendMail("noreply@auroragov.org", applicantEmailAddrs, "", "Licensed Professional Required for permit " + capId.getCustomID(),
                    "A licensed professional is required for the permit to be issued<BR><BR>\
                    Thank you<br><br>\
                    Building Division | City of Aurora | 303-739-7420 | permitcounter@auroragov.org");
                    
                    if(!emailResult.getSuccess()) logDebug("Error sending e-mail. Error: " + emailResult.getErrorMessage());
					else logDebug("Email sent successfully.");
                }
                
                comment(cancelMsg);
            }
            
        }
    }
    catch(err){
        showMessage = true;
        logDebug("Error on custom function bldScrit2_noContractorCheck(). Err: " + err);
        comment();
    }
    logDebug("bldScrit2_noContractorCheck() ended");
}//END bldScrit2_noContractorCheck()