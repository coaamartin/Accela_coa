function AutoCreateIrrigationPlanRecord(){
if (wfTask == "Water Review" && wfStatus == "SS Requested") {
	var tsiArray = new Array(); 
    loadTaskSpecific(tsiArray);
	var Irrigation_Plan_Required = tsiArray["Irrigation Plan Required"];
	if (Irrigation_Plan_Required == "Yes") {
		createChild("Water", "Water", "Irrigation Plan Review", "NA", "Water Irrigation Plan", capId);
		}
	}

}

