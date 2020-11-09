//WTUA:Licenses/Marijuana/Pre Application Meeting/NA

//application subType
if(wfTask=="Pre Licensing Meeting" && wfStatus == "Meeting Held"){
	var childSubType = AInfo["MJ License Type"];

	if(childSubType){
	childSubType = childSubType.replace('MJ ','');
	childSubType = childSubType.replace(' License','');
	logDebug("Create temp record of: "+ childSubType)

	if(childSubType=="Transporter"){
		childSubType="Retail Transporter"
	}else if (childSubType=="Cultivation"){
		childSubType="Retail Cultivation"
	}else if (childSubType=="Product Manufacturer"){
		childSubType="Retail Product Manufacturer"
	}

	var applicantEmail = "";
	var newTempRecordType = ["Licenses", "Marijuana", childSubType, "Application"];

	//create temp record:

	var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
	ctm.setGroup(newTempRecordType[0]);
	ctm.setType(newTempRecordType[1]);
	ctm.setSubType(newTempRecordType[2]);
	ctm.setCategory(newTempRecordType[3]);
	createChildResult = aa.cap.createSimplePartialRecord(ctm, "", "INCOMPLETE EST");
	var childCapId = "";
	logDebug("Result child created: " + createChildResult.getSuccess());

	if (createChildResult.getSuccess()) {
		childCapId = createChildResult.getOutput();
		aa.cap.createAppHierarchy(capId, childCapId);
	}

		if (childCapId != null) {
			editAppSpecific("Pre Application Meeting Held", "Yes", childCapId);
			editAppSpecific("Pre Application Meeting Date", AInfo["Meeting Date"], childCapId);
			editAppSpecific("Pre Application Meeting Time", AInfo["Meeting Time"].replace(' am',''), childCapId);
			
			copyAddress(capId, childCapId);
			copyParcels(capId, childCapId);
			copyOwner(capId, childCapId);
			copyContacts(capId, childCapId);
			
			//email variables and params
			var emailTemplate = "PRE LICENSING MEETING - COMPLETED"
			var emailTo = getAllContactsEmails()
			acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
			acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
			//acaURL += "/urlrouting.ashx?type=1005&module=Water&capId1=" + childCapId.getID1() + "&capId2=" + childCapId.getID2() + "&capId3=" + childCapId.getID3() + "&AgencyCode=" + aa.getServiceProviderCode();
			acaURL += "/urlrouting.ashx?type=1000&module=Licenses&capId1=" + childCapId.getID1() + "&capId2=" + childCapId.getID2() + "&capId3=" + childCapId.getID3() + "&AgencyCode=" + aa.getServiceProviderCode();
			var emailParams = aa.util.newHashtable();
			var capAlias = cap.getCapModel().getAppTypeAlias();
			//var emailTo = getContactByType("Applicant", capId);
			var emailTo = getAllContactsEmails()
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
		
			if(fullAddress!="" || fullAddress!=undefined){
				emailParams.put("$$fullAddress$$", fullAddress);
			}else{
				emailParams.put("$$fullAddress$$", "");
			}
			emailParams.put( "$$deeplink$$", acaURL);
			emailParams.put("$$childAltID$$", childCapId.getCustomID());
			emailParams.put( "$$asiChoice$$", AInfo["MJ License Type"]);
			emailParams.put("$$todayDate$$", thisDate);
			emailParams.put("$$altid$$", capId.getCustomID());
			emailParams.put("$$capAlias$$", capAlias);
			
			logDebug("EmailTo: " + emailTo);
			logDebug("email Parameters: " + emailParams);
			sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, emailParams, null);
		}
		
	}
}

if(wfTask=="Pre Licensing Meeting" && wfStatus == "Rescheduled"){
	appTypeResult = cap.getCapType(); //create CapTypeModel object
	appTypeString = appTypeResult.toString();
	appTypeArray = appTypeString.split("/");
	logDebug("appType: " + appTypeString);
	
	var emailTemplate = "LIC_MJ_PRELICENSEMEETING";
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var recordApplicant = getContactByType("Applicant", capId);
	var firstName = recordApplicant.getFirstName();
	var lastName = recordApplicant.getLastName();
	//var emailTo = getContactByType("Applicant", capId);
	var emailTo = getAllContactsEmails()
	var newScheduledDate = getTaskSpecific("Pre Licensing Meeting", "New Scheduled Date")
	var newScheduledTime = getTaskSpecific("Pre Licensing Meeting", "New Scheduled Time")
	//update asi with new date and time
	editAppSpecific("Scheduled Date",newScheduledDate)
	editAppSpecific("Scheduled Time",newScheduledTime)
	
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
	eParams.put("$$scheduledDate$$", newScheduledDate);
	eParams.put("$$scheduledTime$$", newScheduledTime);
	eParams.put("$$capAlias$$", capAlias);
	eParams.put("$$FirstName$$", firstName);
	eParams.put("$$LastName$$", lastName);
	
	logDebug("EmailTo: " + emailTo);
	logDebug("email Parameters: " + eParams);
	sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, eParams, null);

}

