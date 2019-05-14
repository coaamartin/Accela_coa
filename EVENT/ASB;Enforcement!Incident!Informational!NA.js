logDebug("ASB:Enforcement/Incident/Informational/NA");
//if (ApplicationTypeLevel1 == "Enforcement" && ApplicationTypeLevel2 == "Incident" && ApplicationTypeLevel3 == "Informational" && ApplicationTypeLevel4 = "NA") {
//	if (AInfo["Type of Issue"] == "BANNERS") {		
//		include("5097_Enforcement_check4Dups");
//	}
//}

var checkForBanners = AInfo["Type of Issue"];
if(ifTracer(checkForBanners == "BANNERS", 'Checking for duplicate BANNERS Events.')){
	include("5097_Enforcement_check4Dups");
}
