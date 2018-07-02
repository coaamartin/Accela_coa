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