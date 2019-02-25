//Script 140
//Record Types:	P​ublicWorks/Traffic/Traffic Engineering Request/NA
//Event: 		ApplicationSubmitAfter
//Desc:			When the application is submitted 
//				set the workflow task Application Submittal to a status of "Accepted" 
//				and activate the Traffic Investigation workflow task. 
//Created By: Silver Lining Solutions


	logDebug("script 140_AppSubmitAcceptedActivateTrafficInvestigation() started.");
	try{
      
		logDebug("script 140: closing application submittal with accepted.");
      activateTask("Initial Review"); //Added 2/25/19 per Michelle(True Point) and Aurora Issue Log #1
		closeTask("Application Submittal", "Accepted", "Auto-Accepted by script", "");
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script 140_AppSubmitAcceptedActivateTrafficInvestigation(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script 140_AppSubmitAcceptedActivateTrafficInvestigation(). Please contact administrator. Err: " + err);
	}
	logDebug("script 140_AppSubmitAcceptedActivateTrafficInvestigation() ended.");

