//written by JMAIN

//get some facts about this record
var currenttask = wfTask;
var currenttaskstatus = wfStatus;
var asi_isprojectphased = getAppSpecific("Is this project going to be phased?");
var neededdocument = "Phase Work Plan";

//has the needed document been uploaded?
var docuploaded = false;
var capIdobject = aa.cap.getCapID(myCapId).getOutput();
var documentsobject = aa.document.getCapDocumentList(capIdobject, myUserId);
var listofdocuments = documentsobject.getOutput();
if (documentsobject.getSuccess)
{
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
	