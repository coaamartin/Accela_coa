script260_EmailExcelEnergyOnInspectionResult();

function script260_EmailExcelEnergyOnInspectionResult() {
    var guideSheetObjects = getGuideSheetObjects(inspId);
        guideSheetObject,
        sendEmail = false,
        tempMeterReleaseComment='',
        finalMeterReleaseComment=''
        emailTemplate = 'BLD EXCEL ENERGY # 260',
        emailParams = aa.util.newHashtable();

    if (ifTracer(guideSheetObjects &&  guideSheetObjects.length > 0, "GuideSheet(s) Exists")) {
        for (idx in guideSheetObjects) {
            guideSheetObject = guideSheetObjects[idx];
            if(ifTracer(guideSheetObject.gsType == 'Electrical Meter Release' || guideSheetObject.gsType == 'Mechanical Meter Release', "Guidesheet Type = Electrical Meter Release or Mechanical Meter Release")) {
                if(ifTracer(guideSheetObject.text == 'Temporary Meter Release', "guideSheetObject.text == 'Temporary Meter Release'")) {
                    if(ifTracer(guideSheetObject.status == 'Yes', "guideSheetObject.text == 'Yes'")) {
                        sendEmail = true;
                    }
                    tempMeterReleaseComment = guideSheetObject.comment;
                }
                if(ifTracer(guideSheetObject.text == 'Final Meter Release', "guideSheetObject.text == 'Temporary Meter Release'")) {
                    if(ifTracer(guideSheetObject.status == 'Yes', "guideSheetObject.text == 'Yes'")) {
                        sendEmail = true;
                    }
                    finalMeterReleaseComment = guideSheetObject.comment;
                }
                printObjProps(guideSheetObject);
            }
        }
    }
    if (ifTracer(sendEmail, "sendEmail is truthy")) {
        emailParams.put("$$checkListItem1$$",tempMeterReleaseComment);
        emailParams.put("$$checkListItem2$$",finalMeterReleaseComment);
        emailAsync("Inspection-co@xcelenergy.com", emailTemplate, emailParams);
    }
}