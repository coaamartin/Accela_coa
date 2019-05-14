logDebug("ASB:Enforcement/Incident/Informational/NA");
var checkForBanners = AInfo["Type of Issue"];
if(ifTracer(checkForBanners == "BANNERS", 'Checking for duplicate BANNERS Events.')){
	include("5097_Enforcement_check4Dups");
}
