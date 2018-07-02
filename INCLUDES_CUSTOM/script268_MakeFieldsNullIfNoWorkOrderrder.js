//Script        script268_MakeFieldsNullIfNoWorkOrderrder
//Record Types: PublicWorks\Traffic\Traffic Engineering Request\NA​​
//Event:        WTUA - WorkflowTaskUpdateAfter 
//Desc:         Make Fields Null if no work order
//                  if 
//                      wfTask = Traffic Investigation status = No Change Warranted, Refer to Forestry, Refer to Code Enforcement 
//                  then
//                      Make Custom Fields Location, Description and Work Order Priority null. 
//Created By: Silver Lining Solutions

function script268_MakeFieldsNullIfNoWorkOrderrder() {
    logDebug("script268_MakeFieldsNullIfNoWorkOrderrder() started.");
    try{
        editAppSpecific("Location",null);
        editAppSpecific("Description",null);
        editAppSpecific("Work Order Priority",null);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script268_MakeFieldsNullIfNoWorkOrderrder(). Please contact administrator. Err: " + err);
        logDebug("script268: Error on custom function script268_MakeFieldsNullIfNoWorkOrderrder(). Please contact administrator. Err: " + err);
    }
    logDebug("script268_MakeFieldsNullIfNoWorkOrderrder() ended.");
};//END script268_MakeFieldsNullIfNoWorkOrderrder();