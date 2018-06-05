/*Script 400
 * Record Types: Water/Water/Tap/Application
 * Event: 		IRSB/IRSA
 * 
 * Desc:			
 * If the inspection type = "Meter Set Inspection" and the inspection checklist field “Water meter number” does not have a
value and the inspection status = “Passed” then prevent the inspection from being resulted and display the error message
"Water Meter Number must not be null to status inspection as passed." When inspection status = passed then populate
"Water Meter Number" info field on the parent building permit record with the data from the checklist field “Water meter
number”. When inspection type "Meter Set Inspection" status = failed then send email to the applicant with instructions to
log on to ACA or call the Aurora Water Operations Service Center at 303-326-8645 between the hours of 7am to 3:30 pm
to schedule a re-inspection.
 * 
*/ 
function script400_WatTapApplicationInspectionAutomation() {
 	logDebug("script400_WatTapApplicationInspectionAutomation() started.");
	try{
        var eventName = aa.env.getValue("EventName"),
            cancel = false,
            showMessage  = false,
            comment;
        logDebug("eventName: " + eventName);


        
		if (ifTracer(eventName.indexOf("InspectionResultSubmitBefore") > -1, 'eventName.indexOf(InspectionResultSubmitBefore) > -1')) {
            if (ifTracer(inspType == 'Meter Set Inspection', 'inspType == Meter Set Inspection')) {
                if (ifTracer(inspResult == 'Pass', 'inspResult == Pass')) {
                    if (!ifTracer(AInfo['Water Meter Number'], 'AInfo[Water Meter Number] == falsy') {
                        if (ifTracer(AInfo['inspResult'] == 'Pass', 'inspResult == Pass')) {
                            cancel = true;
                            showMessage = true;
                            logDebug('Water Meter Number must not be null to status inspection as passed.');                            
                            comment('Water Meter Number must not be null to status inspection as passed.');                            
                        }
                    }
                }
            }
        } else if (ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, 'eventName.indexOf(InspectionResultSubmitAfter) > -1'))  {
            if (ifTracer(AInfo['inspType'] == 'Meter Set Inspection', 'inspType == Meter Set Inspection')) {

            }
        }
        if(!cancel) {
            cancel = true;
            showMessage = true;
            logDebug('You are stuck here forever!');
            comment('You are stuck here forever!');
        }


    }
    catch(err){
		showMessage = true;
		comment("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
	}
	logDebug("script400_WatTapApplicationInspectionAutomation() ended."); 
}   //END script400_WatTapApplicationInspectionAutomation();


