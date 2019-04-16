
//script 423
if (matchARecordType([
    "Enforcement/Incident/Snow/NA",
    "Enforcement/Incident/Abatement/NA"
], appTypeString)) {
	logDebug("Script 423 Starting");
    include("423_AccessInvoiceSnowAndAbatementFees");
}

//script 426
if (matchARecordType([
    "Enforcement/Incident/Abatement/NA",
    "Enforcement/Incident/Summons/NA",
    "Enforcement/Incident/Record with County/NA"
], appTypeString)) {
	logDebug("Script 426 Starting");
    include("426_UpdateParentEnfCaseCustomListAndStatus");
}
//script 5095
//if (matchARecordType([
//    "Enforcement/Incident/Informational/NA"
//], appTypeString)) {
//    include("5095_CodeInformationalIRSA");
//}

