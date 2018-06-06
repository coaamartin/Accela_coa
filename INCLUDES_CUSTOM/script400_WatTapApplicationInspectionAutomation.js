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
            emailTemplate = 'WAT METER SET INSPECTION FAILED # 400',
            toContactTypes = 'Applicant',
            ccContactTypes = '',
            emailParams = aa.util.newHashtable(),
            reportName = "",
            reportParams = aa.util.newHashtable(),
            parentCapScriptModel,
            parentCapTypeString,
            parentCapId,
            guideSheetObjects = getGuideSheetObjects(inspId),
            applicant = getContactByType("Applicant", capId),
            idx;

            
		if (ifTracer(eventName.indexOf("InspectionResultSubmitBefore") > -1, 'eventName.indexOf(InspectionResultSubmitBefore) > -1')) {
            if (ifTracer(inspType == 'Meter Set Inspection', 'inspType == Meter Set Inspection')) {
                if (ifTracer(inspResult == 'Pass', 'inspResult == Pass')) {
                    if (ifTracer(!getMeterNumber(), 'getMeterNumber() == falsy')) {
                        cancel = true;
                        showMessage = true;
                        comment('Water Meter Number must not be null to status inspection as passed.');                            
                        logDebug('Water Meter Number must not be null to status inspection as passed.');                            
                    }
                }
            }
        } else if (ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, 'eventName.indexOf(InspectionResultSubmitAfter) > -1'))  {
            if (ifTracer(inspType == 'Meter Set Inspection', 'inspType == Meter Set Inspection')) {
                if (ifTracer(inspResult == 'Pass', 'inspResult == Pass')) {
                    //get parent
                    parentCapId = getParent();
                    if(ifTracer(parentCapId, 'parent found')) {
                        //make sure parent is a permit (Building/Permit/*/*)
                        parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                        parentCapTypeString = parentCapScriptModel.getCapType().toString();
                        if(ifTracer(parentCapTypeString.indexOf('Building/Permit/') > -1, 'parent = Building/Permit/*/*')) {
                            //there is no water meter number field - make a comment per email from christy dtd 20180605
                            createCapComment('Water Meter Number: ' + getMeterNumber());
                        }
                    }
                    
                } else {    //failed
                    addParameter(emailParams, "$$inspComment$$", inspComment);
                    emailContactsWithCCs(toContactTypes, emailTemplate, emailParams, reportName, reportParams, "N", "", ccContactTypes);
                }
            }
        }

    }
    catch(err){
		showMessage = true;
		comment("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
	}
    logDebug("script400_WatTapApplicationInspectionAutomation() ended."); 
    

    function getMeterNumber() {
        var meterNumber = null;
        if (guideSheetObjects &&  guideSheetObjects.length > 0) {
            for (idx in guideSheetObjects) {
                if(guideSheetObjects[idx].gsType == 'Tap Application') {
                    guideSheetObjects[0].loadInfo();
                    return guideSheetObjects[0].info["Meter Number"]
                }
                
            }
        }
        return meterNumber;
    }
}   //END script400_WatTapApplicationInspectionAutomation();


