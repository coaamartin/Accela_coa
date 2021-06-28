/*
Title : Establish Civil Plan Parent Relationship (ApplicationSubmitAfter)

Purpose : If the custom field “Civil Plan number” value matches a record alt id for the record type PublicWorks/Civil Plan/Review/NA
and the current record is not already a parent or grandparent of a record then make this record a child of the Civil Plan

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	establishCivilPlanParentRelationship("Civil Plan number", "PublicWorks/Civil Plan/Review/NA");
*/

establishCivilPlanParentRelationship("Civil Plan number", "PublicWorks/Civil Plan/Review/NA");
/* moving to WTUA
if ("Public Water Utility Permit".equals(AInfo["Utility Permit Type"]) || "Private Fire Lines".equals(AInfo["Utility Permit Type"])) {
	createTempWaterWetTapCopyDataAndSendEmail("WATER CREATE WET TAP TEMP RECORD #401");
}
*/

// 1313 Create water tap based on ASIT entry
try{
	var thisTableName = "SIZE"
    var itemCap = capId;
	var SIZEASIT = loadASITable(thisTableName, itemCap) || new Array();
    var atLeastOne = false;
	
    //add permits
    for (var p in SIZEASIT)
    {
            if (isBlank(SIZEASIT[p]["WET Record ID"]))
            {
                var cWETApplication = createChild("Water", "Water", "Wet Tap", "Application", "", itemCap);
                copyASITableByTName("SIZE", capId, cWETApplication);
				copyAddress(capId, cWETApplication);
				copyParcels(capId, cWETApplication);
				copyOwner(capId, cWETApplication);
				copyContacts(capId, cWETApplication);
				
				editAppSpecific("Application ID",capId.getCustomID());
				editAppSpecific("Utility Permit Number",capId.getCustomID(), cWETApplication);
				editAppSpecific("Civil Plan Number", AInfo["Civil Plan number"], cWETApplication);
                          
                SIZEASIT[p]["WET Record ID"] = cWETApplication.getCustomID();
                atLeastOne = true;
            }
        
    }
    if (atLeastOne)
    {
        removeASITable(thisTableName, itemCap);
        addASITable(thisTableName, SIZEASIT, itemCap);
    }
    
}
catch (err) {
    logDebug("Error occurred: ASIUA: " + err.message);
    logDebug(err.stack)
}
