logDebug("ASB:Enforcement/Incident/Informational/NA");
if (ApplicationTypeLevel1 == "Enforcement" && ApplicationTypeLevel2 == "Incident" && ApplicationTypeLevel3 == "Informational" && ApplicationTypeLevel4 = "NA") {
	if (AInfo["Type of Issue"] == "BANNERS") {		
		include("5097_Enforcement_check4Dups");
	}
}
