function treeCreatePlantingRecordFromInsp(inspId)
	{
	// Script 201
		/* 
		Updated requirements 8/29/2018
		
		run off InspectionSubmitAfter
		If Forestry Inspection has result "Complete" and Checklist Plant = Yes and OK toPlant = Yes Then
		1.create the child planting record and from Plant Checklist item in FORESTRY INSPECTOR -
		concatinate rows from Custom List and put it in to the newly created child record

		2.  for the Parent
		do status "Assigned" on the Tree Request Intake",
		Status of "Complete" on workflow task Inspection Phase task
		Status "Complete" the Crew Work task
		update the record status to Complete
		3. In the newly created child Planting record
		enter the status of "Add to List" in workflow task Tree Planting Intake.
		Plus enter status of "Plant" in Site Review Task
		Status of "Plant Tree" in task Property Owner Responce
		activate the Quality Control task
		schedule a "Planting" Inspection for 5 business days from today's date.
		 */

		var doPlant = false;
		var fgs = getGuideSheetObjects(inspId);
		if (fgs) {
			for (var gsitems in fgs) {
				var fgsi = fgs[gsitems]; // guidesheet item
				if ("Plant".equals(fgsi.text) && "Yes".equals(fgsi.status)) {
					fgsi.loadInfo();
					logDebug("info : " + fgsi.info.length);
					for (var i in fgsi.info) { logDebug(i + " = " + fgsi.info[i]); }
					if (fgsi.info["Ok to Plant"] == "Yes") {
						doPlant = true;
						break;
					}
				}
			}
		}
		
		if (doPlant) {
			resultWorkflowTask("Tree Request Intake", "Assigned", "", "Updated by Script 201");
			resultWorkflowTask("Inspection Phase", "Complete", "", "Updated by Script 201");
			resultWorkflowTask("Crew Work", "Complete", "", "Updated by Script 201");
			updateAppStatus("Complete","Updated by Script 201");

			var options = {
				parentCapID: capId,
				appName: (inspObj.getInspection().getActivity().vehicleID) ? "Tree ID removed" + (inspObj.getInspection().getActivity().vehicleID) : "",
				createAsTempRecord: false,
				copyParcels: true,
				copyAddresses: true,
				copyOwner: true,
				copyContacts: true
			}
			var plantingRecordId = createChildGeneric("Forestry", "Request", "Planting", "NA", options);
			var tmpId = capId;
			capId = plantingRecordId;
			resultWorkflowTask("Tree Planting Intake", "Add to List", "", "");
			resultWorkflowTask("Site Review", "Plant", "", "");
			resultWorkflowTask("Property Owner Response", "Plant Tree", "", "");
			activateTask("Quality Control");
			scheduleInspection("Planting", dateAdd(null,5,true));
			//get GIS objects
			logDebug("DB1")
			var gisIdForLayer = "";
			var gisObjResult = aa.gis.getCapGISObjects(plantingRecordId); // get gis objects on the cap
			if (gisObjResult.getSuccess()) 	
				var fGisObj = gisObjResult.getOutput();	
				logDebug("DB2")
			else
				{ logDebug("**WARNING: Getting GIS objects for CAP.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); }
			treeInventoryPopulate(capId)
			if (plantingRecordId) {
				fgsi.loadInfoTables();
				if (fgsi.validTables) {
					var g = (fgsi.infoTables["NEW TREE PLANTING"] ? fgsi.infoTables["NEW TREE PLANTING"] : []);
					for (var fvi in g) {
						var fvit = g[fvi];
						var thisViolation = [{
								colName: "Location",
								colValue: String(fvit["Location"])
							}, {
								colName: "Quantity",
								colValue: String(fvit["Quantity"])
							}, {
								colName: "Species",
								colValue: String(fvit["Species"])
							}, {
								colName: "Comments",
								colValue: String(fvit["Comments"])
							}
						];
						addAsiTableRow("NEW TREE PLANTING", thisViolation);
					}
				}
			}
			capId = tmpId;
		}
	}