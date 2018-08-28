
if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wf:License Issuance/Issued')){
	//Script 227 start
    var newLicCapId = createLicenseCoA("Active", true, "License Status", "Active");
    if(newLicCapId){
        sendMJLicEmail(newLicCapId);
        
        scheduleInspectionWithCapIdBusinessDays("MJ AMED Inspection", 55, "DALLEN", " ", "Scheduled by Script 227", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Plumbing", 55, "SLCLARK", " ", "Scheduled by Script 227", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Electrical", 55, "SLCLARK", " ", "Scheduled by Script 227", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Mechanical", 55, "SLCLARK", " ", "Scheduled by Script 227", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Life Safety", 55, "SLCLARK", " ", "Scheduled by Script 227", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Security Inspections - 3rd Party", 55, "DALLEN", " ", "Scheduled by Script 227", newLicCapId);
        scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections - Structural", 55, "SLCLARK", " ", "Scheduled by Script 227", newLicCapId);
    }
	//END Script 227
}