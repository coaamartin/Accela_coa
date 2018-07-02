//script 432
logDebug("Script 423 Starting");
if (matchARecordType([
    "Enforcement/Incident/Snow/NA",
    "Enforcement/Incident/Abatement/NA"
], appTypeString)) {
    include("423_AccessInvoiceSnowAndAbatementFees");
}
