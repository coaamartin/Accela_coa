if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wf:License Issuance/Issued')){
    //Script 228 start
    var newLicCapId = createLicenseCoA("Active", true, "License Status", "Active");
    if(newLicCapId){
        sendMJLicEmail(newLicCapId);
        
        scheduleInspectionWithCapIdBusinessDays("MJ AMED Inspection", 84, "DALLEN", " ", "Scheduled by Script 228", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Plumbing", 84, "SLCLARK", " ", "Scheduled by Script 228", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Electrical", 84, "SLCLARK", " ", "Scheduled by Script 228", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Mechanical", 84, "SLCLARK", " ", "Scheduled by Script 228", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Life Safety", 84, "SLCLARK", " ", "Scheduled by Script 228", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Security Inspections - 3rd Party", 84, "DALLEN", " ", "Scheduled by Script 228", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Structural", 84, "SLCLARK", " ", "Scheduled by Script 228", newLicCapId);
		scheduleInspectionWithCapIdBusinessDays("MJ Zoning Inspections", 84, "DALLEN", " ", "Scheduled by Script 228", newLicCapId);
    }
    //END Script 228
}