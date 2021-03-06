
/*
Title : Update Permit Expiration with every Resubmittal (WorkflowTaskUpdateAfter) 

Purpose : For any WF Task and Status of Resubmittal Requested update the Custom Field Application Expiration Date with Status
Date (of Resubmital Requested) + 180 days.

WF Tasks are: Accept Plans, Accepted In House, Structural Plan Review, Electrical Plan Review, Mechanical Plan Review,
Plumbing Plan Review, Bldg Life Safety Review, Fire Life Safety Review, Structural Engineering Review, Real Property
Review, Planning Review, Water Review, Zoning Review, Engineering Review, Traffic Review, Waste Water Review,
Forestry Review

Author: Mohammed Deeb 
 
Functional Area : Records

Sample Call:
updatePermitExpirationCF([ "Accept Plans", "Accepted In House", "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review",
		"Bldg Life Safety Review", "Fire Life Safety Review", "Structural Engineering Review", "Real Property Review", "Planning Review", "Water Review", "Zoning Review",
		"Engineering Review", "Traffic Review", "Waste Water Review", "Forestry Review" ], "Resubmittal Requested", "Application Expiration Date");
*/

updatePermitExpirationCF([ "Accepted", "Accepted In House", "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review",
		"Bldg Life Safety Review", "Fire Life Safety Review", "Structural Engineering Review", "Real Property Review", "Planning Review", "Water Review", "Zoning Review",
		"Engineering Review", "Traffic Review", "Waste Water Review", "Forestry Review" ], "Resubmittal Requested", "Application Expiration Date");

//if workflow step Quaility Check is set to status approved need to insert building fee but do not invoice.
if(ifTracer(wfTask == "Quality Check" && wfStatus == "Approved")){
    //need to invoice the fee either here or in a new custom script
	logDebug("Building Permit Master Quaility Check has been approved. Adding Building fee");
	var feecode = "BLD_MST_01";
    var feeschedule = "BLD_MASTER";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "N", "N");
	//addFee("BLD_MST_01","BLD_MASTER","FINAL",1,"Y");
	logDebug("Building Fee has been added but not invoiced.")
}

if(wfStatus == "Resubmittal Requested"){
    logDebug("Building Permit Master Planning Review, resubmittal requested.");
	include("5132_BLD_ResubmitEmail");
	logDebug("Email was sent for resubmittal.");
}

if(wfStatus == "Cancelled"){
    logDebug("Building Permit Master/amendment, Cancelled.");
	include("5135_BLD_Withdrawn");
	logDebug("Email was sent for cancelled.");
}

if(wfTask == "Fire Life Safety Review" && wfStatus == "Approved"){
	logDebug("Fire Life Safety Review has been approved. Going to schedule inspections if selected.");
	include("5143_BLD_PWP_Fire_inspection");
}