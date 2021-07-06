// script 427
var theFee = 125;

if ("Commercial Building".equals(AInfo["Contractor Type"])) {
	theFee = 325;
}

if ("Residential Building".equals(AInfo["Contractor Type"])) {
	theFee = 195;
}

updateFee("LIC_030", "LIC_CONTRACTOR_GENERAL", "FINAL", theFee, "N");
// end Script 427