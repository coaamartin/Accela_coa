//COA Script - Suhail
include("32_recStatusUpdateWaterTap");
include("31_1_EmailWithFee");

//COA Script - JMAIN 
include("33_WaterTapApplicationFee");

if(ifTracer(wfTask == "Application Submittal" && wfStatus == "Assess Fees", 'wf:Application Submittal/Assess Fees')){
	script83_TapAppFees();
}
