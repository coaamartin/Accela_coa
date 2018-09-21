
if(ifTracer(inspType == "Initial Housing Inspection" && inspResult == "Inspection Passed", 'Initial Housing Inspection/Inspection Passed')){
   if(ifTracer(currentUserID == "TLEDEZMA", 'user:TLEDEZMA')) wtrScript350_archiveLists();
}

//script 351

var feeCode;
var sumUnits = 0;
if ("1st Housing Re-Inspection".equals(inspType)) feeCode = "ENF_HI_01";
if ("2nd Housing Re-Inspection".equals(inspType)) feeCode = "ENF_HI_02";
if ("3rd Housing Re-Inspection".equals(inspType)) feeCode = "ENF_HI_03";
if ("4th Housing Re-Inspection".equals(inspType)) feeCode = "ENF_HI_04";

if ("Inspection Failed".equals(inspResult) && feeCode && typeof(INSPECTIONINFORMATION) == "object") {
	for (var i in INSPECTIONINFORMATION) {
		if (String(inspType).equals(String(INSPECTIONINFORMATION[i]["Inspection Type"]))) {
			if (INSPECTIONINFORMATION[i]["Units - Passed"] != null && INSPECTIONINFORMATION[i]["Units - Passed"] != "") {
				sumUnits += parseInt(INSPECTIONINFORMATION[i]["Units - Passed"]);
			}
			if (INSPECTIONINFORMATION[i]["Units - Failed"] != null && INSPECTIONINFORMATION[i]["Units - Failed"] != "") {
				sumUnits += parseInt(INSPECTIONINFORMATION[i]["Units - Failed"]);
			}	
		}
	}
	logDebug("adding fee " + feeCode + " with quantity " + sumUnits);

	if (sumUnits > 0) {
		addFee(feeCode,"ENF_HI","FINAL",sumUnits,"Y");
	}
	
}

// end script 351

// start script 352
if ("Inspection Passed".equals(inspResult)) {
		if (matches(inspType,"Initial Housing Inspection","1st Housing Re-Inspection","2nd Housing Re-Inspection","3rd Housing Re-Inspection","4th Housing Re-Inspection")) {
			if (AInfo["Inspection Cycle"] && AInfo["Inspection Cycle"].toUpperCase().indexOf("YEAR") > 0) {
				var yearCycle = parseInt(AInfo["Inspection Cycle"].substring(0,1));
				if (yearCycle) {
					currentCycleDate = AInfo["Date of Next Inspection"] && AInfo["Date of Next Inspection"] != "" ? convertDate(AInfo["Date of Next Inspection"]) : new Date();
					var newCycleDate = currentCycleDate.setFullYear(currentCycleDate.getFullYear() + yearCycle); 
					logDebug(yearCycle + " " + currentCycleDate + " " + newCycleDate);
					editAppSpecific("Date of Next Inspection",dateAdd(newCycleDate,0));
				}
			}
		}
}
// end script 352

// start script 356
if (matches(inspResult,"Extension - Fee", "No Show")) {
		addFee("ENF_HI_05","ENF_HI","FINAL",1,"Y");
}



 