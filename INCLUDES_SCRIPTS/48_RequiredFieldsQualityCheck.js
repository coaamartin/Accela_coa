//SWAKIL
if ("Quality Check".equals(wfTask) && "Approved".equals(wfStatus))
{	
	var z = getAppSpecific("Total Finished Area Sq Ft");
	var y = getAppSpecific("Project Category");
	var x = getAppSpecific("Construction Type");
	var w = getAppSpecific("Occupancy Group");
	var v = getAppSpecific("Maximum Occupancy");
	var u = getAppSpecific("# of Residential Units");
	var t = getAppSpecific("Single Family Detached Home");
	var s = getAppSpecific("Special Inspections");
	var r = getAppSpecific("Materials Cost");
	var q = getAppSpecific("Valuation");
	var p = getAppSpecific("Homeowner acting as Contractor");

		if(!p || !q || !r || !s || !t || !u || !v || !w || !x || !y || !z  ){
			showMessage=true;
	        comment("Not all Required Custom fields are populated for QC Approval.");
			cancel=true;
		}

}