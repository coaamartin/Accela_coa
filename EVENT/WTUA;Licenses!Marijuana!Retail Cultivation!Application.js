if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wf:License Issuance/Issued')){
    //Script 229 start
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
        envParameters.put("CapId", newLicCapId.getCustomID());
        aa.runAsyncScript(vAsyncScript, envParameters);

        scheduleInspectionWithCapIdBusinessDaysDept("MJ AMED Inspections", 84, "DALLEN", " ", "Scheduled by Script 229", newLicCapId);

        scheduleInspectionWithCapIdBusinessDaysDept("MJ Building Inspections - Plumbing", 84, "", " ", "Scheduled by Script 229", newLicCapId, "BUILDING/NA/NA/NA/NA/BI");
        scheduleInspectionWithCapIdBusinessDaysDept("MJ Building Inspections - Electrical", 84, "", " ", "Scheduled by Script 229", newLicCapId, "BUILDING/NA/NA/NA/NA/BI");
        scheduleInspectionWithCapIdBusinessDaysDept("MJ Building Inspections - Mechanical", 84, "", " ", "Scheduled by Script 229", newLicCapId, "BUILDING/NA/NA/NA/NA/BI");
        scheduleInspectionWithCapIdBusinessDaysDept("MJ Building Inspections - Life Safety", 84, "", " ", "Scheduled by Script 229", newLicCapId, "BUILDING/NA/NA/NA/NA/BI");
        scheduleInspectionWithCapIdBusinessDaysDept("MJ Building Inspections - Structural", 84, "", " ", "Scheduled by Script 229", newLicCapId, "BUILDING/NA/NA/NA/NA/BI");
        
        scheduleInspectionWithCapIdBusinessDaysDept("MJ Security Inspections - 3rd Party", 84, "JBEUTHEL", " ", "Scheduled by Script 229", newLicCapId);
        scheduleInspectionWithCapIdBusinessDaysDept("MJ Zoning Inspections", 84, "DALLEN", " ", "Scheduled by Script 229", newLicCapId);
    }
    //END Script 229
}
