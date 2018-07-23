//written by JMAIN

//get some facts about this record
var currenttask = wfTask;
var currenttaskstatus = wfStatus;
var asi_isprojectphased = getAppSpecific("Is this project going to be phased?");
var neededdocument = "Phase Work Plan";

//has the needed document been uploaded?
var docuploaded = false;
var thealtid = capId.getCustomID();
var capIdobject = aa.cap.getCapID(thealtid).getOutput();
var documentsobject = aa.document.getCapDocumentList(capIdobject, "ADMIN");
if (documentsobject.getSuccess())
{
	var listofdocuments = documentsobject.getOutput();
	for (var i in listofdocuments)
	{
		var doccategory = listofdocuments[i]["docCategory"];
		if (doccategory == neededdocument)
		{
			docuploaded = true;
		}			
	}
}

logDebug(currenttask);
logDebug(currenttaskstatus);
logDebug(asi_isprojectphased);
logDebug(neededdocument);
logDebug(docuploaded);

//raise a message if necessary
if (currenttask == "Engineering Review" && currenttaskstatus == "Approved" && asi_isprojectphased == "Yes" && !docuploaded)
{
	cancel = true;
	showMessage = true;
	comment("Phased projects require Phase Work Plan to be attached in Documents!");
	logDebug("Phased projects require Phase Work Plan to be attached in Documents!");
}
	