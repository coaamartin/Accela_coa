function getMasterScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
        return emseScript.getScriptText() + "";
    }
    catch(err)
    {
        return "";
    }
}

function getScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
        return emseScript.getScriptText() + "";
    }
    catch(err)
    {
        return "";
    }
}

var SCRIPT_VERSION = 3.0;
eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getMasterScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));
var userId = "admin"
var systemUserObjResult = aa.person.getUser(userId.toUpperCase());
if (systemUserObjResult.getSuccess())
{
    var systemUserObj = systemUserObjResult.getOutput();
}
var emailText = "";
var capId = null;
var asyncScript = "SEND_MJ_LICENSE_ASYNC";
showDebug = true;
try {
    sendLicenseAttached("Renewed - Pending Notification", 7, "Renewed", asyncScript);
} catch (ex) {
    logDebug("**ERROR batch failed, error: " + ex);
}



function sendLicenseAttached(currentAppStatus, expiredBeforeDays, newAppStatus, asyncScript) {
    try
    {
        var capTypeModel = aa.cap.getCapTypeModel().getOutput();
        capTypeModel.setGroup("Licenses");
        capTypeModel.setType("Marijuana");
        capTypeModel.setSubType(null);
        capTypeModel.setCategory("Renewal");

        var capModel = aa.cap.getCapModel().getOutput();
        capModel.setCapType(capTypeModel);
        capModel.setCapStatus(currentAppStatus);

        var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
        aa.print("<br><Font Color=RED> Processing " + capIdScriptModelList.length + " " + currentAppStatus + " records <br>");

        for (r in capIdScriptModelList) {
            capId = capIdScriptModelList[r].getCapID();
            capIDString = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID()
            aa.print("<Font Color=BLUE> <br> Processing record " + capIDString + "<Font Color=BLACK>");

            vLicenseID = getParentLicenseCapID(capId);
            vIDArray = String(vLicenseID).split("-");
            vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

            aa.print("<Font Color=BLUE> <br> Parent License " + vLicenseID.getCustomID() + "<Font Color=BLACK>");



            var expResult = aa.expiration.getLicensesByCapID(vLicenseID);
            if (!expResult.getSuccess()) {
                aa.print("<br>****WARN failed to get expiration of capId " + vLicenseID.getCustomID());
                continue;
            }
            expResult = expResult.getOutput();

            var thisCap = null;
            var expDate = expResult.getExpDate();

            if (expDate) {
                var lastb1ExpDate = expDate.getMonth() + "/" + expDate.getDayOfMonth() + "/" + (expDate.getYear() - 1);
                aa.print("<br>Last Expiration Date: " +lastb1ExpDate);

                var sendLicAfterDate = new Date(lastb1ExpDate);
                sendLicAfterDate.setDate(sendLicAfterDate.getDate() - expiredBeforeDays);

                var today = new Date();
                if(today >= sendLicAfterDate){
                    aa.print("<br>sendLicAfterDate: " +sendLicAfterDate + " Today: "+ today);

                    closeTask("License Issuance", "Renewed", "Updated by Batch Job", "");
                    updateAppStatus(newAppStatus,"Updated by Script",capId);

                    var envParameters = aa.util.newHashMap();
                    envParameters.put("CapId", vLicenseID.getCustomID()+"");
                    aa.runAsyncScript(asyncScript, envParameters);
                    aa.print("<br>Updated Renewal and Email Sent on: " +vLicenseID.getCustomID());
                }else {
                    aa.print("<br> Skipping record; not within 7-days period");
                }
            }

            aa.print("<br>#######################");
        }//for all caps
        aa.sendMail("suhailwakil@sbztechnology.com", "suhailwakil@sbztechnology.com", "", "Debug Information in BATCH_MJ_REN_SEND_LICENSE", debug);
    }
    catch (err)
    {
        aa.sendMail("suhailwakil@sbztechnology.com", "suhailwakil@sbztechnology.com", "", "Log", "Debug: " + err);
    }

}


