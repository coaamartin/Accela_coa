//CTRCA:LICENSES/MARIJUANA/PRE APPLICATION MEETING/NA
//send email 
//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);


//ACA only
if(publicUser){ 
	
	var emailTemplate = "LIC_MJ_PRELICENSEMEETING";
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var recordApplicant = getContactByType("Applicant", capId);
	var firstName = recordApplicant.getFirstName();
	var lastName = recordApplicant.getLastName();
	var emailTo = getContactByType("Applicant", capId);
	//var emailTo = getAllContactsEmails();
	var emailCC = "marijuana@auroragov.org";
	var scheduledDate = AInfo["Meeting Date"];
	var scheduledTime = AInfo["Meeting Time"]; 	
	editTaskSpecific("Pre Licensing Meeting","Original Scheduled Date",scheduledDate)
	editTaskSpecific("Pre Licensing Meeting","Original Scheduled Time",scheduledTime) 
	
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
		Params.put("$$fullAddress$$", "");
	}
	
	
	eParams.put("$$todayDate$$", thisDate);
	eParams.put("$$altid$$", capId.getCustomID());
	eParams.put("$$scheduledDate$$", scheduledDate);
	eParams.put("$$scheduledTime$$", scheduledTime);
	eParams.put("$$capAlias$$", capAlias);
	eParams.put("$$FirstName$$", firstName);
	eParams.put("$$LastName$$", lastName);
	
	logDebug("EmailTo: " + emailTo);
	logDebug("email Parameters: " + eParams);
	sendNotification("noreply@auroragov.org", emailTo, emailCC, emailTemplate, eParams, null);
	
	//dusty allen
	var userObj = aa.person.getUser("Dusty",null,"Allen").getOutput();
    assignTask("Pre Licensing Meeting",userObj.getUserID());
}

