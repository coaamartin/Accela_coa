if(ifTracer(wfTask == 'Legal Hearing' && matches(wfStatus, 'Trial', 'Court Ordered Re-Inspect', 'Non-Compliant', 'Trial Issue New Summons', 'Continuance', 'Pre-Trial'), 
            "wfTask == 'Legal Hearing' && matches(wfStatus, 'Trial', 'Court Ordered Re-Inspect', 'Non-Compliant', 'Trial Issue New Summons', 'Continuance', 'Pre-Trial')")){
    scheduleInspection('Pre Court Investigation', 0);
}

if(ifTracer(wfTask == 'FTA' && wfStatus == 'FTA - Inspection Scheduled', "wfTask == 'FTA' && wfStatus == 'FTA - Inspection Scheduled'")) {
    scheduleInspection('Pre Court Investigation', 0);
}
