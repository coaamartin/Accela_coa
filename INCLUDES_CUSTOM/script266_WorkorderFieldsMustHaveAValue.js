//Script 266
//Record Types:	PublicWorks/Traffic/Traffic Engineering Request/NA
//Event: 		WTUB
//Desc:			Event WorkflowTaskUpdateBefore
//
//              Criteria wfTask = Draft Workorder status = Workorder Drafted
//                                and If Custom Fields Location, Desription, and Priority is null 
//
//              Action Raise Message “Content incomplete please populate workflow information to use this status.”
//
//Created By: Silver Lining Solutions_Darren

function script266_WorkorderFieldsMustHaveAValue(){
	logDebug("script266_WorkorderFieldsMustHaveAValue() started.");
	try
	{
		if ( wfTask == "Draft Workorder" && wfStatus == "Workorder Drafted")
		{
			// determine if the record has values in custome fields for Location, Description, and Priority. if not throw error
/*			if ({Description}== null || {Location}== null || {Work Order Priority}== null)
				throw "Content incomplete please populate workflow information to use this status.";			
*/		}
	}
	catch(err)
	{
		cancel = true;
		showMessage = true;
		comment(err);
	}
	logDebug("script266_WorkorderFieldsMustHaveAValue() ended.");
};//END script266_WorkorderFieldsMustHaveAValue
