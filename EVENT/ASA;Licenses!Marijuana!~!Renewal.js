//Begin script to assess late fees delinquent MJ renewal
include("313_AddExpiredRenewalLateFeeMJ");
//End script to assess late fees delinquent MJ renewal

if(!publicUser) {
    //BACKOFFICE FEE
    if (appMatch("Licenses/Marijuana/Retail Cultivation/Renewal")) {
        updateFee("LIC_MJRC_02", "LIC_MJ_RC", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Renewal")) {
        updateFee("LIC_MJRPM_02", "LIC_MJ_RPM", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Retail Transporter/Renewal")) {
        updateFee("LIC_MJTR_02", "LIC_MJ_TRANS", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Testing Facility/Renewal")) {
        updateFee("LIC_MJTST_02", "LIC_MJ_TEST", "FINAL", 1, "Y");
    } else if (appMatch("Licenses/Marijuana/Retail Store/Renewal")) {
        updateFee("LIC_MJST_01", "LIC_MJ_STORE", "FINAL", 1, "Y");
    }

    updateAppStatus("Payment Pending", "Updated by ASA;Licenses!Marijuana!~!Renewal", capId);
}