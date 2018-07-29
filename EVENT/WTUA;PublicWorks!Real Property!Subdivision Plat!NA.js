var $iTrc = ifTracer;
//written by JMAIN
include("24_realpropertyApplicationAcceptanceIncomplete");

//SWAKIL
include("25_PlatEmailResubmittal");

//SWAKIL
include("26_PlatFinalDocRequest");


if ($iTrc(wfTask=="Recordation" && wfStatus=="Recorded", 'wfTask=="Recordation" && wfStatus=="Recorded"')){
	//Script 289
	pWrksScript289_subPlatNotification();
}

//Script 286
//Record Types:	PublicWorks/Real Property/Subdivision Plat/NA​
//Event: 		WTUA
//Desc:			
//	Criteria 	wfTask = Application Acceptance and status = Ready to Pay Action 
//				Check if there is at least 1 fee item 
//				that is not invoiced if so then 
//  Action		invoice all fees that have not been 
//				previously invoiced and email the Contact (Developer) with Invoice as 
//				link to generated report saved in attachments. 
// Or Criteria  wfTask = Application Acceptance and status = Missing Information 
//	Action 		Deactivate Application Acceptance task email Developer insufficient 
//				information please refer to comments below to complete your application. 
//				(need template from Darren) include Comments 
//
//Created By: Silver Lining Solutions
function generateInvoiceReport() {

  //returns the report file which can be attached to an email.
  var user = currentUserID;   // Setting the User Name
  var report = aa.reportManager.getReportInfoModelByName("Invoice Report");
  itemCap = capId;
  var reportParams = aa.util.newHashtable();
  addParameter(reportParams, "RECORD_MODULE", "PublicWorks");
	
  report = report.getOutput();
  report.setModule("PublicWorks");
  report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
  report.setReportParameters(reportParams);
  report.getEDMSEntityIdModel().setAltId(itemCap.getCustomID());

  var permit = aa.reportManager.hasPermission("Invoice Report",user);

  if (permit.getOutput().booleanValue()) {
    var reportResult = aa.reportManager.getReportResult(report);
    if(reportResult) {
      reportOutput = reportResult.getOutput();
      var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
      reportFile=reportFile.getOutput();
      return reportFile;
    }  else {
      logDebug("System failed get report: " + reportResult.getErrorType() + ":" +reportResult.getErrorMessage());
      return false;
    }
  } else {
    logDebug("You have no permission.");
    return false;
  }
}

logDebug("START: Script 286");
if (wfTask == "Application Acceptance" && wfStatus == "Ready to Pay")
{
	logDebug("Script 286: Ready to Pay criteria met");
	invoiceAllFees();

	// email Developer that they are ready to pay 
	var dev = getContactByType("Developer", capId);
		var devEmail = null;
		if (!dev || dev.getEmail() == null || dev.getEmail() == "") {
			logDebug("**WARN no developer or developer has no email, capId=" + capId);
		} else {
			devEmail = dev.getEmail();
		}
		
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$ContactEmail$$", devEmail);
	addParameter(emailParameters, "$$wfComment$$", wfComment);
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
	
	var myReport = generateInvoiceReport();
	vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
	vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
	var docNotFound = true;
	vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
	if (vDocumentList != null) {
		vDocumentList = vDocumentList.getOutput();
	}
	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentCat = vDocumentModel.getDocCategory();
			if (vDocumentCat == "Invoice Report") {
				//Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
				getACADocDownloadParam4Notification(emailParams, vACAUrl, vDocumentModel);
				logDebug("including document url: " + emailParams.get('$$acaDocDownloadUrl$$'));
				aa.print("including document url: " + emailParams.get('$$acaDocDownloadUrl$$'));
				docNotFound = false;
				break;
			}
		}
	}
	//If no documents found then we just add the record link
	if(!vDocumentList || docNotFound) addParameter(emailParameters, "$$acaDocDownloadUrl$$", recordURL);

	var reportFile = [];
	var sendResult = sendNotification("noreply@aurora.gov",devEmail,"","PW READY TO PAY #123",emailParameters,reportFile,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	
	
}
if (wfTask == "Application Acceptance" && wfStatus == "Missing Information")
{
	logDebug("Script 286: Missing Information criteria met");
	closeTask("Application Acceptance","Missing Information","script 286","script 286");
	// email Developer that there is insufficient info 
	var dev = getContactByType("Developer", capId);
		var devEmail = null;
		if (!dev || dev.getEmail() == null || dev.getEmail() == "") {
			logDebug("**WARN no developer or developer has no email, capId=" + capId);
		} else {
			devEmail = dev.getEmail();
		}
		
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$ContactEmail$$", devEmail);
	addParameter(emailParameters, "$$wfComment$$", wfComment);
	var reportFile = [];
	var sendResult = sendNotification("noreply@aurora.gov",devEmail,"","PW SUBDIVISION INCOMPLETE COMPLETENESS CHECK # 286",emailParameters,reportFile,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	
	
}
logDebug("END: Script 286");

function invoiceAllFees() {
	var feeFound = false;
	var fperiod = "";
	getFeeResult = aa.fee.getFeeItems(capId,"",null);
	if (getFeeResult.getSuccess()) 
	{
		var feeList = getFeeResult.getOutput();
		
		for (feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) 
			{
				var feeSeq = feeList[feeNum].getFeeSeqNbr();
				feeSeqList.push(feeSeq);
				paymentPeriodList.push(fperiod);
				feeFound = true;
				logDebug("Script 286: Assessed fee found and tagged for invoicing");
			}
	} 
	else 
	{
		logDebug("Script 286: no fees exist that are not invoiced")
	}
	return feeFound;
} 