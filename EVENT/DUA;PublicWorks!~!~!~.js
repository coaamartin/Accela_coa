//script 22 
logDebug("Script #22 Starting");
if (matchARecordType([
	  "PublicWorks/Drainage/NA/NA",
	  "PublicWorks/Civil Plans/*/*",
	  "PublicWorks/Pavement Design/NA/NA",
	  "Water/Utility/Master/Study"
  	], appTypeString)) {
	logDebug("appstring is a match");  
	logDebug('cap.getCapStatus()"' + cap.getCapStatus());
	if(ifTracer(cap.getCapStatus() == "Waiting on Documents", "Record status = Waiting on Documents")) {
		logDebug('calling function');
		include("22_activateCompletenessCheck");
	}
}