/*
* Script 260
*/
if (matchARecordType([
    "Building/Permit/New Building/NA",
    "Building/Permit/Plans/NA",
    "Building/Permit/No Plans/NA"
], appTypeString)) {
    if (ifTracer(inspType == "Electrical Rough" || inspType  == "Mechanical Rough", "inspType == Electrical Rough or Mechanical Rough")) {
        var guideSheetObjects = getGuideSheetObjects(inspId);
            guideSheetObject;

        if (ifTracer(guideSheetObjects &&  guideSheetObjects.length > 0, "GuideSheet(s) Exists")) {
            for (idx in guideSheetObjects) {
                if(ifTracer(guideSheetObjects[idx].gsType == 'Electrical Meter Release' || guideSheetObjects[idx].gsType == 'Mechanical Meter Release', "Guidesheet Type = Electrical Meter Release or Mechanical Meter Release")) {
                    var guideSheetObject = guideSheetObjects[idx];

                    printObjProps(guideSheetObject);

                    if(ifTracer(guideSheetObject.text == 'Pass', "guideSheetObject.text == 'Pass'")) {
                      //  guideSheetObject.loadInfo();
                        
                    }
                    guideSheetObject.loadInfo();
                    logDebug(guideSheetObject.info["Temporary Meter Release"]);
                }
                
            }
        }


    }
}