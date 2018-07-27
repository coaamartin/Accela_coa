//Check if owner is doing the work, if not and there is no contractor in the record prevent issuance. 
//Script 2 part2
//By: Tony Ledezma
function bldScript2_noContractorCheck(){
    logDebug("bldScript2_noContractorCheck() started");
    try{
        var $iTrc = ifTracer,
            ownerIsContractor = AInfo["Homeowner acting as Contractor"] == "Yes" ? true : false,
            lpOnFile = lpExistsOnCap(capId),
            ownerApplicantMatch = false,
            cancelMsg = "",
            applicant = getContactByType("Applicant",capId);
            
        if($iTrc(vEventName == "WorkflowTaskUpdateBefore", 'WTUB')){
            //if(getPrimaryOwnerFullName().toUpperCase() == applicantName.toUpperCase()) ownerApplicantMatch = true;
            
            //if($iTrc((!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch), '(!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch)'))
            if($iTrc(!ownerIsContractor && !lpOnFile, '!ownerIsContractor && !lpOnFile'))
                cancelMsg = "Contractor is not attached to Permit. Please send an email through Communications tab to the Applicant that the Permit cannot be issued without a Licensed Contractor";
            
            cancel = showMessage = cancelMsg.length > 0;
            
            if(cancel) comment(cancelMsg);
        }
        
        if($iTrc(vEventName == "PaymentReceiveAfter", 'PRA')){
            var applicantName = applicant.getFullName();
            var applicantEmailAddrs = applicant.getEmail();
            
            if(!ownerIsContractor && !lpOnFile){
        
                var applicantEmailAddrs = applicant.getEmail();
                if(applicantEmailAddrs){
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
                    emailparams.put("$$ContactEmail$$", applicantEmailAddrs);
                    
                    emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
					
					return false;
                }
				else{
					logDebug("WARNING: No email address on applicant.  Not issuing permit")
				}
				
				return false;
            }
			
			return true;
        }
    }
    catch(err){
        showMessage = true;
        logDebug("Error on custom function bldScript2_noContractorCheck(). Err: " + err);
        comment();
    }
    logDebug("bldScript2_noContractorCheck() ended");
}//END bldScript2_noContractorCheck()