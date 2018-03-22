function hasInspection(inspections, treeId, inspType) {
	for (i in inspections) {
		if (inspections[i].getInspectionType().equalsIgnoreCase(inspType)) {
			var act = inspections[i].getInspection().getActivity();
			if (act.getUnitNBR() == treeId) {
				return true;
			}
		}//inspType match
	}//for all inspections
	return false;
}