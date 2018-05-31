
function getPendingInspections(ret) {
	// returns associative array 
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		ret["Electrical Final"] = 0;
		ret["Electrical Rough"] = 0;
		ret["Mechanical Final"] = 0;
		ret["Mechanical Rough"] = 0;
		ret["Plumbing Final"] = 0;
		ret["Plumbing Rough"] = 0;
		ret["Framing Final"] = 0;
		ret["Framing Rough"] = 0;

		for (xx in inspList) {
			if (inspList[xx].getInspectionStatus().toUpperCase().equals("PENDING")) {
				if (ret["Electrical Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Electrical Final"))
					ret["Electrical Final"] = 1
				if (ret["Electrical Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Electrical Rough"))
					ret["Electrical Rough"] = 1

				if (ret["Mechanical Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Mechanical Final"))
					ret["Mechanical Final"] = 1
				if (ret["Mechanical Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Mechanical Rough"))
					ret["Mechanical Rough"] = 1

				if (ret["Plumbing Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Plumbing Final"))
					ret["Plumbing Final"] = 1
				if (ret["Plumbing Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Plumbing Rough"))
					ret["Plumbing Rough"] = 1

				if (ret["Framing Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Framing Final"))
					ret["Framing Final"] = 1
				if (ret["Framing Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Framing Rough"))
					ret["Framing Rough"] = 1
			}
		}

	}
}