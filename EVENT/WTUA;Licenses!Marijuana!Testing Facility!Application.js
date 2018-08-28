//create MJ Testing Facility License from Issued MJ Testing Facility application  script 228
if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wf:License Issuance/Issued')){
    var newLicCapId = createLicenseCoA("Active", true, "License Status", "Active");
    if(newLicCapId){
        sendMJLicEmail();
        
        scheduleInspectionWithCapIdBusinessDays("MJ AMED Inspection", 55, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Plumbing", 55, "SLCLARK", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Electrical", 55, "SLCLARK", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Mechanical", 55, "SLCLARK", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Life Safety", 55, "SLCLARK", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Security Inspections - 3rd Party", 55, "DALLEN", " ", "Scheduled by Script 226", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Structural", 55, "SLCLARK", " ", "Scheduled by Script 226", newLicCapId);
    }
}
