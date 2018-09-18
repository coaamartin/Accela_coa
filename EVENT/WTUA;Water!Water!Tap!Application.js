
if(ifTracer(wfTask == "Application Submittal" && wfStatus == "Assess Fees", 'wf:Application Submittal/Assess Fees')){
	script83_TapAppFees();
}

if(ifTracer(wfTask == "Fee Processing" && wfStatus == "Ready to Pay", 'wf:Fee Processing/Ready to Pay')){
	//Script 83 - invoice feeds added by script83_TapAppFees()
	var feeArray = ["WAT_TA_01","WAT_TA_02","WAT_TA_03","WAT_TA_04","WAT_TA_05","WAT_TA_06","WAT_TA_09","WAT_TA_10","WAT_TA_11","WAT_TA_12","WAT_TA_16","WAT_TA_17","WAT_TA_18","WAT_TA_19","WAT_TA_20","WAT_TA_21","WAT_TA_22","WAT_TA_23","WAT_TA_24","WAT_TA_25","WAT_TA_26","WAT_TA_27","WAT_TA_28","WAT_TA_29","WAT_TA_30","WAT_TA_31","WAT_TA_32","WAT_TA_33","WAT_TA_36","WAT_TA_37","WAT_TA_39","WAT_TA_40","WAT_TA_41","WAT_TA_42","WAT_TA_44"];
    var feeArray2 = ["WAT_TA2_01","WAT_TA2_02","WAT_TA2_03","WAT_TA2_04","WAT_TA2_05","WAT_TA2_06","WAT_TA2_09","WAT_TA2_10","WAT_TA2_11","WAT_TA2_12","WAT_TA2_16","WAT_TA2_17","WAT_TA2_18","WAT_TA2_19","WAT_TA2_20","WAT_TA2_21","WAT_TA2_22","WAT_TA2_23","WAT_TA2_24","WAT_TA2_25","WAT_TA2_26","WAT_TA2_27","WAT_TA2_28","WAT_TA2_29","WAT_TA2_30","WAT_TA2_31","WAT_TA2_32","WAT_TA2_33","WAT_TA2_36","WAT_TA2_37","WAT_TA2_39","WAT_TA2_40","WAT_TA2_41","WAT_TA2_42","WAT_TA2_44"];
    var thisFeeSeqList = [];
	var thisFeePeriodList = [];
	
    for(i in feeArray){ 
	    var aFee=feeArray[i];
		var thisFeeSeq = feeExistsGetSeqNbr(aFee, "NEW");
		if(thisFeeSeq) {thisFeeSeqList.push(thisFeeSeq); thisFeePeriodList.push("FINAL"); }
	}
    for(i in feeArray2){ 
	    var aFee=feeArray2[i];
		var thisFeeSeq = feeExistsGetSeqNbr(aFee, "NEW");
		if(thisFeeSeq) {thisFeeSeqList.push(thisFeeSeq); thisFeePeriodList.push("FINAL"); }
	}
	
	if (thisFeeSeqList.length)
	{
	    invoiceResult = aa.finance.createInvoice(capId, thisFeeSeqList, thisFeePeriodList);
	    if (invoiceResult.getSuccess())
	    	logMessage("Invoicing assessed fee items is successful in WTUA.");
	    else
	    	logMessage("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful in WTUA.  Reason: " +  invoiceResult.getErrorMessage());
	}
    
	//END Script 83
}

//COA Script - Suhail
include("32_recStatusUpdateWaterTap");
include("31_1_EmailWithFee");

//COA Script - JMAIN 
include("33_WaterTapApplicationFee");