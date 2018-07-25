/* 
* SCRIPT 148
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


AboristLicenseRenewal("Licenses", "Contractor", "Arborist", "License");


function AboristLicenseRenewal(grp, typ, stype, cat){
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
    if(runDate.getMonth() != 1 && runDate.getMonth() != 11) {
        aa.print('You can only run this in December or Februrary OR pass in parameter RunDate (mm/dd/yyyy)');
    }
    for(idx in capScriptList) {
        capScript = capScriptList[idx];
        if(ifTracer(capScript.getCapStatus() == "Issued", "Record status = Issued")) {
            lic = aa.expiration.getLicensesByCapID(capScript.capID).getOutput();
            if(lic != null && lic.getExpDate != null) {
                aa.print('record id - ' + capScript.capID.getCustomID());
                expAccDate = lic.getExpDate();
                if(expAccDate != null) {
                    expJsDate = new Date(expAccDate.year, expAccDate.month-1, expAccDate.dayOfMonth);
                    aa.print('expJsDate - ' + expJsDate);
                    aa.print('RunDate is ' + runDate);
                    if(expJsDate.getTime() == new Date(runDate.getFullYear(), 11, 31).getTime()) {
                        aa.print('exp date is end of year 12/31');
                        //send email
                        eParams = aa.util.newHashtable();
                        capId = capScript.capID;
                        emailContactsWithCCs(
                            "Applicant", 
                            "FT ARBORIST LICENSE RENEWAL #74", 
                            eParams, 
                            "", 
                            aa.util.newHashtable(), 
                            "N", 
                            "", 
                            "Arborist Company"
                        );
                        getOrCreateRenewalKids();
                        if (runDate.getMonth() == 11) {
                            aa.print('adding dec fee');
                            addFee("LIC_CONT_A01", "LIC_CONTRACTOR_ARBORIST ", "FINAL", 1, "Y", renewalKids[0]);
                        }
                    } else if(expJsDate.getTime() == new Date(runDate.getFullYear()-1, 11, 31).getTime()) {
                        getOrCreateRenewalKids();
                        if(runDate.getMonth() == 1) {
                            aa.print('adding feb fee');
                            addFee("LIC_CONT_A02", "LIC_CONTRACTOR_ARBORIST ", "FINAL", 1, "Y", renewalKids[0]);
                        }
                    }
                }
            }
        }
    }

    function getOrCreateRenewalKids() {
        renewalKids = getChildren("Licenses/Contractor/Arborist/Renewal", capScript.capID);
        if (renewalKids == null || renewalKids.length == 0) {
            renewalKids = []; 
            aa.print('Creating child record'); 
            renewalKids.push(createChildGeneric("Licenses", "Contractor", "Arborist", "Renewal", {
                parentCapID: capScript.capID
            }));
        }
        aa.print('renewal record is ' + renewalKids[0]);
    }

}
