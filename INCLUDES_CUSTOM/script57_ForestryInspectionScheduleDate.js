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
		var thisCapModel = thisCap.getCapModel();
		var thisWorkDesc = thisCapModel.getCapWorkDesModel().description;
		
		//Get Tree Info List data, loop through them and add to a text var 
		var thisAppSpecTable = loadASITable("TREE INFORMATION", capId);
		var row, treeId, mgtUnit;
		var addThisText = "" + thisWorkDesc + "\n";
		
		for (var ea in thisAppSpecTable) {
	 		row = thisAppSpecTable[ea];
	        treeID = "" + row["Tree ID"].fieldValue;
			mgtUnit = "" + row["Management Unit"].fieldValue;
			addThisText += "\n" + "TREE ID: " + treeID;
			addThisText += "\n" + "Mgt Unit: " + mgtUnit;
		}

		var inspIdArr = aa.env.getValue("InspectionIDArray");	
		for (var inInsp in inspIdArr) {
			var thisInspectionID = inspIdArr[inInsp];
			var thisInsp = aa.inspection.getInspection(capId, thisInspectionID ).getOutput();
			var thisScheduledDate = sysDate;
			var thisRequestComment = thisInsp.requestComment == null ? "" + "\n" + addThisText : thisInsp.requestComment+ "\n" + addThisText;
			thisInsp.setScheduledDate(thisScheduledDate);
			thisInsp.setInspectionComments(thisRequestComment);
			aa.inspection.editInspection(thisInsp);
		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script57_ForestryInspectionScheduleDate(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script57_ForestryInspectionScheduleDate(). Please contact administrator. Err: " + err);
	}
	logDebug("script57_ForestryInspectionScheduleDate() ended.");
}
//END script57_ForestryInspectionScheduleDate();
