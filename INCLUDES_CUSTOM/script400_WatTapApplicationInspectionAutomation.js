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

            
        // printObjProps(guideSheetObjects);
        //  if (guideSheetObjects &&  guideSheetObjects.length > 0) {
        //       for (idx in guideSheetObjects) {
        //          printObjProps(guideSheetObjects[idx]);

        //          printObjProps(guideSheetObjects[idx].item);
        // //          for (idx2 in guideSheetObjects[idx].item.getItemASISubgroupList()) { 
        // //         //     printObjProps(guideSheetObjects[idx].item.getItemASISubgroupList()[idx2]);
        // //         //     logDebug(guideSheetObjects[idx].item.getItemASISubgroupList()[idx2].fields.length);
        // //         //     // for (idx3 in guideSheetObjects[idx].item.itemASISubgroupList.fields[idx3]) {
        // //         //     //     printObjProps(guideSheetObjects[idx].item.itemASISubgroupList[idx2].fields[idx3]);
        // //         //     // }

        // //         // }
 
        // //         // if (guideSheetsAry[idx].gsType == "FORESTRY INSPECTOR" && guideSheetsAry[g].text == checkListItemName) {
        // //         //     resultMatched = (String(guideSheetsAry[g].status).toLowerCase() == "yes");
        // //        //  }
        //      }
        //  }  

        var gsArray = loadGuideSheetItems(inspId);
        logDebug(gsArray["water meter number"]);
        for (var i in gsArray) {
            logDebug(gsArray[i]);
        }
        logDebug(gsArray["meter number"]);
    
		// if (!gsArray["water meter number"] || gsArray["water meter number"] == "") {
		// 	// var parentId = getParents("TODO:BuildingPermitRecordType");
		// 	// for (var i in parentId) {
		// 	// 	editAppSpecific("Water Meter Number",gsArray["water meter number"],parentIdArray[i]);
		// 	// }
		// }
       

		if (ifTracer(eventName.indexOf("InspectionResultSubmitBefore") > -1, 'eventName.indexOf(InspectionResultSubmitBefore) > -1')) {
            if (ifTracer(inspType == 'Meter Set Inspection', 'inspType == Meter Set Inspection')) {
                if (ifTracer(inspResult == 'Pass', 'inspResult == Pass')) {
                    if (ifTracer(!AInfo['Water Meter Number'], 'AInfo[Water Meter Number] == falsy')) {
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
                            createCapComment('Water Meter Number: ' + AInfo['Water Meter Number']);
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
}   //END script400_WatTapApplicationInspectionAutomation();


