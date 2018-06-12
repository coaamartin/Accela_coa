/* 
* SCRIPT 376
*/
var batchJobName = "" + aa.env.getValue("BatchJobName");	// Name of the batch job

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM", null, true));

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}


notifyOverdueIssuedPermits("Water", "Water", "SWMP", "Permit");


function notifyOverdueIssuedPermits(grp, typ, stype, cat){
    var idx,
        expDate,
        expSince,
        capScript,
        maxExpDaysAllowed = 29,
        capScriptList = aa.cap.getByAppType(grp, typ, stype, cat).getOutput();
    
    for(idx in capScriptList) {
        capScript = capScriptList[idx];
        if(ifTracer(capScript.getCapStatus() == "Issued" || capScript.getCapStatus() == "About to Expire", "Record status = Issued" )) {
            capScript.capModel.expDate = new Date(2018,4,3);
            aa.print("Exp Date: " + capScript.capModel.getExpDate());
            expDate = capScript.capModel.getExpDate();
            if(ifTracer(expDate, "Record expDate is truthy")) {
                expSince = dateDiff(expDate, new Date());
                aa.print(expSince);
                if (expSince > maxExpDaysAllowed) {
                    capId=capScript.getCapID();
                    aa.print("sending email, cap id = " + capId.getCustomID());
                    emailContacts("Applicant", "WAT RENEWAL OF SWMP PERMIT # 376", aa.util.newHashtable(), "",  aa.util.newHashtable());
                    updateAppStatus("About to Expire","Updated via Batch Job : " + batchJobName, capScript.getCapID());
                }
            }
        }
    }
}
