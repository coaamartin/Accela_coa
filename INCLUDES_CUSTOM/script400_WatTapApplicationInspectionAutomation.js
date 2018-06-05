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
        var eventName = aa.env.getValue("EventName");

        logDebug('eventName: ' + eventName);
		if (ifTracer(eventName == "Inspection Result Submit Before", 'eventName == Inspection Result Submit Before')) 
		{



        } else if (ifTracer(eventName == "Inspection Result Submit After", 'eventName == Inspection Result Submit After')) {

        }
        cancel = true;
        showMessage = true;
        comment('You are stuck here forever!');

    }
    catch(err){
		showMessage = true;
		comment("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
	}
	logDebug("script400_WatTapApplicationInspectionAutomation() ended."); 
}   //END script400_WatTapApplicationInspectionAutomation();


