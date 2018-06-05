function requireDataInSpecialInspections() {
	logDebug("requireDataInSpecialInspections() started");
    try {
		var $iTrc = ifTracer;
        if ($iTrc(wfTask == "Special Inspections Check" && matches(wfStatus, "Report Received", "Reports Received"), 'wf:Special Inspections Check/matches(wfStatus, "Report Received", "Reports Received")')) {
            var specialInspections = getASIgroup("SPECIAL INSPECTIONS", capId);
            if (specialInspections != null) {
                var missingData = "";
                for (xx in specialInspections) {

                    //check if ___Required field and filled
                    var asiFieldName = specialInspections[xx].getCheckboxDesc();
                    if (new java.lang.String(asiFieldName).endsWith("Required") && typeof (specialInspections[xx].getChecklistComment()) != "undefined"
                            && !isBlankOrNull(specialInspections[xx].getChecklistComment())) {

                        asiFieldName = asiFieldName.trim();

                        //validate it's __Received field
                        var asiFieldReceived = asiFieldName.substring(0, asiFieldName.lastIndexOf(" ")) + " Received";
                        if (!validateField(asiFieldReceived, specialInspections)) {
                            missingData += asiFieldName + ",";
                        }

                    }//need validation
                }//for all ASIs

                if (!isBlankOrNull(missingData)) {//remove last ,
                    missingData = missingData.substring(0, missingData.length - 1);
                    //throw ("The following data is required : " + missingData);
                    cancel = showMessage = true;
                    comment("The following data is required : " + missingData);
                }
            }//specialInspections
        }//task and status match

    } catch (e) {
        cancel = true;
        showMessage = true;
        comment(e);
    }
	logDebug("requireDataInSpecialInspections() ended");
}//END requireDataInSpecialInspections()
