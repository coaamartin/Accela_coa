if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wf:License Issuance/Issued')){
	//Script 226 start
    var tDate = new Date();
	var initialInspDate = dateAdd(tDate, 84);
	var nextInspDate = dateAdd(initialInspDate, 91);
	editAppSpecific("Initial Inspection Date", initialInspDate);
	editAppSpecific("Next Inspection Date", nextInspDate);
	var newLicCapId = createLicenseCoA("Active", true, "License Status", "Active");
	
    if(newLicCapId){
        //sendMJLicEmail(newLicCapId);
        var vAsyncScript = "SEND_MJ_LICENSE_ASYNC";
        var envParameters = aa.util.newHashMap();
        envParameters.put("CapId", newLicCapId);
        aa.runAsyncScript(vAsyncScript, envParameters);

        scheduleInspectionWithCapIdBusinessDays("MJ AMED Inspections", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Plumbing", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Electrical", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Mechanical", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Life Safety", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Structural", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
		scheduleInspectionWithCapIdBusinessDays("MJ Security Inspections - 3rd Party", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
		scheduleInspectionWithCapIdBusinessDays("MJ Zoning Inspections", 84, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
    }
	//END Script 226
}