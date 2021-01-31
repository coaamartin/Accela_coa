//CTRCA;Licenses!Marijuana!~!Renewal.js

//Begin script to assess late fees delinquent MJ renewal
include("313_AddExpiredRenewalLateFeeMJ");
//End script to assess late fees delinquent MJ renewal
    
if (appMatch("Licenses/Marijuana/Retail Cultivation/Renewal")) {
        updateFee("LIC_MJRC_02", "LIC_MJ_RC", "FINAL", 1, "Y");
} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Renewal")) {
    updateFee("LIC_MJRPM_02", "LIC_MJ_RPM", "FINAL", 1, "Y");
} else if (appMatch("Licenses/Marijuana/Retail Transporter/Renewal")) {
    updateFee("LIC_MJTR_02", "LIC_MJ_TRANS", "FINAL", 1, "Y");
} else if (appMatch("Licenses/Marijuana/Testing Facility/Renewal")) {
    updateFee("LIC_MJTST_02", "LIC_MJ_TEST", "FINAL", 1, "Y");
} else if (appMatch("Licenses/Marijuana/Retail Store/Renewal")) {
    updateFee("LIC_MJST_01", "LIC_MJ_STORE", "FINAL", 1, "Y");
}

updateAppStatus("Payment Pending", "Updated by ASA;Licenses!Marijuana!~!Renewal", capId);


//send email 
//******************************************************************************
//if(publicUser){
	var emailTemplate = "LIC_MJ_RENEWALSUBMIT";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    //var emailTo = getContactByType("Applicant", capId);
    var emailTo = getAllContactsEmails()
    var stLicNumb = getAppSpecific("State License Number",capId)+""; 
    var tradeName = getAppName(capId);
    
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var fullAddress = "";
    var capAddresses = aa.address.getAddressByCapId(capId);
        if (capAddresses.getSuccess()) {
            capAddresses = capAddresses.getOutput();
            if (capAddresses != null && capAddresses.length > 0) {
                capAddresses = capAddresses[0];
                
                fullAddress = capAddresses.getHouseNumberStart() + " ";
                fullAddress = fullAddress + capAddresses.getStreetName() + " ";
                fullAddress = fullAddress + capAddresses.getCity() + " ";
                fullAddress = fullAddress + capAddresses.getState() + " ";
                fullAddress = fullAddress + capAddresses.getZip();
            }
    }
    var eParams = aa.util.newHashtable();
    if(fullAddress!="" || fullAddress!=undefined){
        eParams.put("$$fullAddress$$", fullAddress);
    }else{
        eParams.put("$$fullAddress$$", "");
    }
    
    
    eParams.put("$$todayDate$$", thisDate);
    eParams.put("$$altid$$", capId.getCustomID());
    eParams.put("$$capAlias$$", capAlias);
    eParams.put("$$FirstName$$", firstName);
    eParams.put("$$LastName$$", lastName);
    eParams.put("$$stLicNumb$$", stLicNumb);
    eParams.put("$$tradeName$$", tradeName);
    sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, eParams, null);

//}

