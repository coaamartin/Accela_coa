/*
* Script 260
*/
if (matchARecordType([
    "Building/Permit/New Building/NA",
    "Building/Permit/Plans/NA",
    "Building/Permit/No Plans/NA",
    "Building/Permit/OTC/NA"
	], appTypeString)) {
    if (ifTracer(inspType == "Electrical Rough" || inspType  == "Mechanical Rough", "inspType == Electrical Rough or Mechanical Rough")) {
        include("260_EmailExcelEnergyOnInspectionResult");
    }
	
	script380_PermitExpirationDateWithTodaysDate180();
}

