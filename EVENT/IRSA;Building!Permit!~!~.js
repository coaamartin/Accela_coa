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


// 4-8-19 created for OTC  KBH
if (matchARecordType([
    "Building/Permit/OTC/NA"
	], appTypeString)) {

	bldScript6_FinalInspComplete();

	include("66_Building_Inspection_Failed_Passed_Final");

	include("72_Inspection_Pending");
	include("73_Inspection_Leftover");
}