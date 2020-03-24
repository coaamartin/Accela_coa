//SEND_HOA_RENEW_EMAIL
logDebug("***** Starting SEND_HOA_RENEW_EMAIL from script *****");
try
{
	var capId = aa.env.getValue("capId");
	var cap = aa.env.getValue("cap");
	//var altId = aa.env.getValue("altID")
	var emailTo = getEmailString(); 
	var capAlias = cap.getCapModel().getAppTypeAlias();
	//var capName = cap.getSpecialText("Name of HOA");
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
	tParams.put("$$altID$$", capId.getCustomID());
	//tParams.put("$$capAlias$$", capAlias);
	//tParams.put("$$HOANAME$$", AInfo["Name of HOA"]);
	var rParams = aa.util.newHashtable();
	var emailtemplate = "HOA RENEWAL CONFIRMATION LETTER";
    sendNotification("noreply@aurora.gov", emailTo, "", emailtemplate, tParams);
}
catch(e)
{
	email("rprovinc@auroragov.org", "aurora@gov.org", "Error", e.message);
}
function getEmailString(contactTypeArray)
{
	var emailString = "";
	var result = new Array();
	if (!contactTypeArray)
		contactTypeArray = new Array();
	var getAll = (contactTypeArray.length == 0)
	if (arguments.length > 1)
		itemCap = arguments[1];
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray)
	if (!(contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().getEmail().length() > 0))
			continue;
		if (getAll || exists(contactArray[c].getPeople().getContactType(), contactTypeArray))
		{
			result.push(contactArray[c].getPeople().getEmail());
		}
	logDebug(emailString);
	return emailString;
}
logDebug("Starting function getPeople")
function getPeople(capId)
{
	capPeopleArr = null;
	var s_result = aa.people.getCapContactByCapID(capId);
	if(s_result.getSuccess())
	{
		capPeopleArr = s_result.getOutput();
		if(capPeopleArr != null || capPeopleArr.length > 0)
		{
			for (loopk in capPeopleArr)	
			{
				var capContactScriptModel = capPeopleArr[loopk];
				var capContactModel = capContactScriptModel.getCapContactModel();
				var peopleModel = capContactScriptModel.getPeople();
				var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
				if (contactAddressrs.getSuccess())
				{
					var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
					peopleModel.setContactAddressList(contactAddressModelArr);    
				}
			}
		}
		else
		{
			aa.print("WARNING: no People on this CAP:" + capId);
			capPeopleArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
		capPeopleArr = null;	
	}
	return capPeopleArr;
}
function logDebug(str){aa.print(str);}
function logMessage(str){aa.print(str);}
 function getContactByType(conType,capId) {

    var contactArray = getPeople(capId);



    for(thisContact in contactArray) {

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

            return contactArray[thisContact].getPeople();

    }



    return false;

}
function email(pToEmail, pFromEmail, pSubject, pText) 
	{
	//Sends email to specified address
	//06SSP-00221
	//
	aa.sendMail(pFromEmail, pToEmail, "", pSubject, pText);
	logDebug("Email sent to "+pToEmail);
	return true;
	}

 function sendNotification(emailFrom,emailTo,emailCC,templateName,params)

{

	var itemCap = capId;

	if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args



	var id1 = itemCap.ID1;

 	var id2 = itemCap.ID2;

 	var id3 = itemCap.ID3;



	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);


}
 function convertContactAddressModelArr(contactAddressScriptModelArr)

{

	var contactAddressModelArr = null;

	if(contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0)

	{

		contactAddressModelArr = aa.util.newArrayList();

		for(loopk in contactAddressScriptModelArr)

		{

			contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());

		}

	}	

	return contactAddressModelArr;

}