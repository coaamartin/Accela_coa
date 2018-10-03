
//assess state application fee based on application type
if (appMatch("Licenses/Marijuana/Retail Cultivation/Application")) {
	updateFee("LIC_MJRC_01", "LIC_MJ_RC", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Application")) {
	updateFee("LIC_MJRC_01", "LIC_MJ_RC", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Retail Transporter/Application")) {
	updateFee("LIC_MJRC_01", "LIC_MJ_RC", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Testing Facility/Application")) {
	updateFee("LIC_MJRC_01", "LIC_MJ_RC", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Retail Store/Application")) {
	updateFee("LIC_MJRC_01", "LIC_MJ_RC", "FINAL", 1, "N");
}