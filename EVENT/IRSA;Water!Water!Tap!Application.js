if(ifTracer(inspType == 'Meter Set Inspection' && inspResult == 'Pass', 'Meter Set Inspection/Pass')){
    script400_WatTapApplicationInspectionAutomation();
}

if(ifTracer(inspType == 'Meter Set Inspection' && inspResult == 'Fail', 'Meter Set Inspection/Fail')){
    script400_WatTapApplicationInspectionAutomation();
}
//SWAKIL Script 483 addReInspectionFee
include("483_addReInspectionFee");