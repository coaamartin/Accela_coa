/* 
* SCRIPT 149
*/
var batchJobName = "" + aa.env.getValue("BatchJobName");	// Name of the batch job

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM", null, true));


eval(getScriptText("INCLUDES_BATCH"));

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


AboristLicenseSuspoension("Licenses", "Contractor", "Arborist", "License");


function AboristLicenseSuspoension(grp, typ, stype, cat){
    var idx,
        lic,
        expAccDate,
        expJsDate,
        renewalKids,
        capScript,
        eParams,
        runDate = new Date(),
        capScriptList = aa.cap.getByAppType(grp, typ, stype, cat).getOutput();
    
    if(aa.env.getValue("RunDate") != null) {
        runDate = new Date(aa.env.getValue("RunDate"));
    }
    if(runDate.getMonth() != 2) {
        aa.print('You can only run this in March OR pass in parameter RunDate (mm/dd/yyyy)');
        return;
    }
    for(idx in capScriptList) {
        capScript = capScriptList[idx];
       if(ifTracer(capScript.getCapStatus() == "Issued", "Record status = Issued")) {
            lic = aa.expiration.getLicensesByCapID(capScript.capID).getOutput();
            if(lic != null && lic.getExpDate != null && lic.expStatus == 'About to Expire') {
                aa.print('record id - ' + capScript.capID.getCustomID());
                expAccDate = lic.getExpDate();
                if(expAccDate != null) {
                    expJsDate = new Date(expAccDate.year, expAccDate.month-1, expAccDate.dayOfMonth);
                    aa.print('expJsDate - ' + expJsDate);
                    aa.print('RunDate is ' + runDate);
                    if(expJsDate.getTime() < new Date(runDate).getTime()) {
                        aa.print('exp date < run-date');
                        //change renewal status
                        lic.setExpStatus("Expired");
                        aa.expiration.editB1Expiration(lic.getB1Expiration());
                    }
                }
            }
        }
    }

}
