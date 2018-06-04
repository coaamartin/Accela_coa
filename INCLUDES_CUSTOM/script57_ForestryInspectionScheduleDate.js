//@ts-check
//Script 57
//Record Types:	Forestry/*/*/*
//Event: 		ISA (Inspection Scheduled After)
//Desc:			When an inspection is scheduled, Then automatically set the scheduled date of 
//				the inspection to the current system date and insert the RECORD detailed description 
//				text and the tree ID and Unit Number(both come from the Custom list Tree Information) 
//				into the inspection request/comments field.  
//Created By: Silver Lining Solutions

function script57_ForestryInspectionScheduleDate() {
	logDebug("script57_ForestryInspectionScheduleDate() started.");
	try{
		
		//Get the Record Work Description
		var thisCap = aa.cap.getCap(capId).getOutput();
		if (thisCap != null ) {
			var thisCapModel = thisCap.getCapModel();
			if (thisCapModel != null) {
				var thisWorkDesc = thisCapModel.getCapWorkDesModel().description;
				//Get Tree Info List data, loop through them and add to a text var 
				var thisAppSpecTable = loadASITable("TREE INFORMATION", capId);
				var row, treeId, treeMgtUnit;
				var addThisText = "" + thisWorkDesc + "\n";

logDebug("script57: got the tree info and the cap description!");
logDebug("script57: desc:"+thisWorkDesc);
logDebug("script57: tree info table ***************************");
				
				for (var ea in thisAppSpecTable) {
					row = thisAppSpecTable[ea];
					
logDebug("script57: tree info row:"+row);
logDebug("script57: row tree id:"+row["Tree ID"]);
logDebug("script57: row tree qty:"+row["Management Unit"]);

					treeID = "" + row["Tree ID"].fieldValue;
					treeMgtUnit = "" + row["Management Unit"].fieldValue;
					addThisText += "\n" + "TREE ID: " + treeID;
					addThisText += "\n" + "Management Unit: " + treeMgtUnit;
				}

		//		var inspIdArr = aa.env.getValue("InspectionIDArray");	
				var inspIdArr = InspectionIdArray;
				
logDebug("script57: the insp array is:"+inspIdArr);		
				
				for (var inInsp in inspIdArr) {
					var thisInspectionID = inspIdArr[inInsp];
					var thisInsp = aa.inspection.getInspection(capId, thisInspectionID ).getOutput();
					var thisScheduledDate = sysDate;

logDebug("script57: the request comment is>"+thisInsp.requestComment + "<");
logDebug("script57: the inspection comments are >"+thisInsp.InspectionComment + "<");

					var thisRequestComment = thisInsp.requestComment == null ? "" + "\n" + addThisText : thisInsp.requestComment+ "\n" + addThisText;
					thisInsp.setScheduledDate(thisScheduledDate);
					thisInsp.setInspectionComments(thisRequestComment);
					aa.inspection.editInspection(thisInsp);
				}
			} else logDebug("script57: could not get cap Model!");
		} else logDebug("script57: could not get cap!");
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script57_ForestryInspectionScheduleDate(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script57_ForestryInspectionScheduleDate(). Please contact administrator. Err: " + err);
	}
	logDebug("script57_ForestryInspectionScheduleDate() ended.");
} //END script57_ForestryInspectionScheduleDate()
