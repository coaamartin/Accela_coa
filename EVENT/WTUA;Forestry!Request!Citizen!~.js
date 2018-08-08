/*
Script 200
Record Types:	Forestry/Request/Citizen

Event: 	WTUA
Desc:		If the workflow task = "Crew Work" and the workflow status = "Removal" then activate the workflow task "Stump Grind" and
set the custom field "Stump Grind Priority" to the value of 2 if the workflow task "Tree Request Intake" has a status of "No
Plant".
Created By: Silver Lining Solutions
 */
if (wfTask == "Crew Work" && wfStatus == "Removal") {

	// Script 200

	activateTask("Stump Grind");
	var parentTask = aa.workflow.getTask(capId, "Tree Request Intake").getOutput();
	if (parentTask != null && parentTask != "") {
		if (parentTask.getDisposition() == "No Plant") {

			editAppSpecific("Stump Grind Priority", 2);
		}
	}

	/*
	
	Script 201

	If workflow task = 'Crew Work' and workflow status = 'Removal'
	and an Inspection type of "Forestry Inspection" has a checklist of "Forestry Inspector"
	and a checklist item of Plant which has a custom field called
	"Ok to Plant" with a value of "Yes"
	then create a planting record(Forestry/Request/Planting/NA)
	and copy over address, parcel, owner, contacts and the get the
	Tree ID number (Vehicle Id from the Forestry Inspection)
	put "Tree ID removed + "Tree ID number", example Tree ID
	removed 12345 into the record detail description of
	the newly created child record,
	 */

	var fInspections = getInspections({
			"inspType": "Forestry Inspection"
		});
	if (fInspections) {
		for (var i in fInspections) {
			var thisForInsp = fInspections[i];
			var fgs = getGuideSheetObjects(thisForInsp.getIdNumber());
			if (fgs) {
				for (var gsitems in fgs) {
					var fgsi = fgs[gsitems]; // guidesheet item
					if ("Plant".equals(fgsi.text) && "Yes".equals(fgsi.status)) {
						fgsi.loadInfo();
						var options = {
							parentCapID: capId,
							appName: (thisForInsp.getInspection().getActivity().vehicleID) ? "Tree ID removed" + (thisForInsp.getInspection().getActivity().vehicleID) : "",
							createAsTempRecord: false,
							copyParcels: true,
							copyAddresses: true,
							copyOwner: true,
							copyContacts: true
						}
						var plantingRecordId = createChildGeneric("Forestry", "Request", "Planting", "NA", options);
					}
				}
			}
		}
	}

}
