// script 427
var theFee = 125;

if ("Commercial Building".equals(AInfo["Contractor Type"])) {
	theFee = 300;
}

if ("Residential Building".equals(AInfo["Contractor Type"])) {
	theFee = 180;
}

updateFee("LIC_030", "LIC_CONTRACTOR_GENERAL", "FINAL", theFee, "N");
// end Script 427