if (inspType == "PI Inspection" && inspResult == "Final") {
var w = AInfo["Warranty Work?"];
logDebug("Warranty check =" +w);
	if (w == 'Yes') {
		closeTask("PI Inspection", "Completed", "", "");
	}
	if (w == 'No') {
		closeTask("PI Inspection", "Completed", "", "");
		closeTask("Request Testing", "Not Required Warranty", "", "");
		}
}
