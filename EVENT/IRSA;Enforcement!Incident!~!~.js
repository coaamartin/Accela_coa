
//script 423
logDebug("Script 423 Starting");
if (matchARecordType([
    "Enforcement/Incident/Snow/NA",
    "Enforcement/Incident/Abatement/NA"
], appTypeString)) {
    include("423_AccessInvoiceSnowAndAbatementFees");
}

//script 426
logDebug("Script 426 Starting");
if (matchARecordType([
    "Enforcement/Incident/Abatement/NA",
    "Enforcement/Incident/Summons/NA",
    "Enforcement/Incident/Record with County/NA"
], appTypeString)) {
    include("426_UpdateParentEnfCaseCustomListAndStatus");
}
