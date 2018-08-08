script398_ScheduleFinalInspection();

//script 397
logDebug("Script 397 Starting");
if(ifTracer(wfTask == "Closure" && wfStatus == "Closed", "wfTask == Closure && wfStatus == Closed")) {
	include("397_createPpbmpRecordBasedOnCustomListData");
}
