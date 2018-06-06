//Check if owner is doing the work, if not and there is no contractor in the record prevent issuance. 
//Script 2 part2
//By: Tony Ledezma
function bldScript2_noContractorCheck4WTUA(){
    logDebug("bldScript2_noContractorCheck4WTUA() started");
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
            
            var applicantName = applicant.getFullName();
            var applicantEmailAddrs = applicant.getEmail();
            if(getPrimaryOwnerFullName().toUpperCase() == applicantName.toUpperCase()) ownerApplicantMatch = true;
            
            if($iTrc((!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch), '(!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch)'))
                cancelMsg = "UNABLE to issue permit without a Contractor attached.  Email has been sent to applicant. Task has been updated to In Progress";
            
            cancel = showMessage = cancelMsg.length > 0;
            
            if(cancel) {
				comment(cancelMsg);
				updateTask("Permit Issuance", "In Progress", "Updated via script.", "Updated via script 2. A contractor is needed before issuing permit.");
				updateAppStatus("In Progress","");
				
				adResult = aa.address.getAddressByCapId(capId).getOutput(); 
			    for(x in adResult)
			    {
			    	var adType = adResult[x].getAddressType(); 
			    	var stNum = adResult[x].getHouseNumberStart();
			    	var preDir =adResult[x].getStreetDirection();
			    	var stName = adResult[x].getStreetName(); 
			    	var stType = adResult[x].getStreetSuffix();
			    	var city = adResult[x].getCity();
			    	var state = adResult[x].getState();
			    	var zip = adResult[x].getZip();
			    }
	
	            var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
				
				var emailTemplate = 'BLD PERMIT REQUIRES LP # 2',
                contactTypes = 'Applicant',
                emailparams = aa.util.newHashtable();
				emailparams.put("$$altID$$", capId.getCustomID());
	            emailparams.put("$$FullAddress$$", primaryAddress);
				
                emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
			}
            
        }
    }
    catch(err){
        showMessage = true;
        logDebug("Error on custom function bldScript2_noContractorCheck4WTUA(). Err: " + err);
        comment();
    }
    logDebug("bldScript2_noContractorCheck4WTUA() ended");
}//END bldScript2_noContractorCheck4WTUA()