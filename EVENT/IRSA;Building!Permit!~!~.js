/*
* Script 260
*/
logDebug("Starting IRSA;Building!Permit!~!~.js");
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
logDebug("End of IRSA;Building!Permit!~!~.js");

