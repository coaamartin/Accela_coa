script260_EmailExcelEnergyOnInspectionResult();

function script260_EmailExcelEnergyOnInspectionResult() {
    var guideSheetObjects = getGuideSheetObjects(inspId);
        guideSheetObject,
        gasMeterSelected = false,
        electricalMeterSelected = false,
        sendEmail = false,
        emailTemplate = 'BLD EXCEL ENERGY # 260',
        emailParams = aa.util.newHashtable();
		//var inspResultComment;
		//var inspComment;
		var inspectionComment = "";

    if (ifTracer(guideSheetObjects &&  guideSheetObjects.length > 0, "GuideSheet(s) Exists")) {
        for (idx in guideSheetObjects) {
            guideSheetObject = guideSheetObjects[idx];
            if(ifTracer(guideSheetObject.gsType == 'Electrical Meter Release' || guideSheetObject.gsType == 'Gas Meter Release', "Guidesheet Type = Electrical Meter Release or Gas Meter Release")) {
                if(ifTracer(guideSheetObject.text == 'Temporary Meter Release', "guideSheetObject.text == 'Temporary Meter Release'")) {
                    if(ifTracer(guideSheetObject.status == 'Yes', "guideSheetObject.text == 'Yes'")) {
                        sendEmail = true;
                        setChecklistItemFlag();
						addParameter(emailParams, "$$checkListItemName$$", guideSheetObject.text);
                    }
                }
                if(ifTracer(guideSheetObject.text == 'Final Meter Release', "guideSheetObject.text == 'Temporary Meter Release'")) {
                    if(ifTracer(guideSheetObject.status == 'Yes', "guideSheetObject.text == 'Yes'")) {
                        sendEmail = true;
                        setChecklistItemFlag();
						addParameter(emailParams, "$$checkListItemName$$", guideSheetObject.text);
                    }
                }
            }
        }
    }
	
    if (ifTracer(sendEmail, "sendEmail is truthy")) {
        setChecklistItemText();
		if(vEventName == "V360InspectionResultSubmitAfter")
			inspectionComment = inspComment;
		else
			inspectionComment = inspResultComment;
		
		addParameter(emailParams, "$$inspComment$$", inspectionComment);
        addParameter(emailParams, "$$FullAddress$$", getCapFullAddress());
        emailAsync2("", emailTemplate, emailParams);
}

    function setChecklistItemFlag() {
        if(ifTracer(guideSheetObject.gsType == 'Electrical Meter Release', "Guidesheet Type = Electrical Meter Release")) {
            electricalMeterSelected = true;
        } else if(ifTracer(guideSheetObject.gsType == 'Gas Meter Release', "Guidesheet Type = Gas Meter Release")) {
            gasMeterSelected = true;
        }
    }

    function setChecklistItemText() {
        if(ifTracer(electricalMeterSelected && gasMeterSelected, "Both electricalMeterSelected && gasMeterSelected flags are true")) {
            emailParams.put("$$checkListItem1$$","Gas and Electrical Meter");
        } else if(ifTracer(electricalMeterSelected, "electricalMeterSelected is true")) {
            emailParams.put("$$checkListItem1$$","Electrical Meter");
        } else if(ifTracer(gasMeterSelected, "gasMeterSelected is true")) {
            emailParams.put("$$checkListItem1$$","Gas Meter");
        }
    }
}