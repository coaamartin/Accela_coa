if(publicUser){
    if (appMatch("Licenses/Marijuana/Retail Cultivation/Application")) {
        updateFee("LIC_MJRC_02", "LIC_MJ_RC", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Application")) {
        updateFee("LIC_MJRPM_02", "LIC_MJ_RPM", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Retail Transporter/Application")) {
        updateFee("LIC_MJTR_02", "LIC_MJ_TRANS", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Testing Facility/Application")) {
        updateFee("LIC_MJTST_02", "LIC_MJ_TEST", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Retail Store/Application")) {
        updateFee("LIC_MJST_01", "LIC_MJ_STORE", "FINAL", 1, "Y");
    }

    updateAppStatus("Payment Pending", "Updated by ASA;Licenses!Marijuana!~!Application", capId);

    include("28_AMEDEmailApplicantAtRecordCreation");
}
