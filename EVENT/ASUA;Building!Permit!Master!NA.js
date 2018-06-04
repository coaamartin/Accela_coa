/*
Title : Remove Master Plan from Shared Drop Down List (ApplicationStatusUpdateAfter) 
Script 325

Change Log:
6/1/2018 - Tony L. Updated the purpose per new comments on SharePoint script tracker.

Purpose : Event ApplicationStatusUpdateAfter Criteria
          If New Status = unapproved or withdrawn
		  Action Delete row from
		  Shared Drop-down list where Application Name = Value in the shared Drop-down list based on Custom Field "Master Plan Type".
          Ie;
		  if "Master Plan Type" = Single Family then delete row in Shared Drop-down list BLD SINGLE FAMILY MASTER or
		  if "Master Plan Type" = Multi Family then delete row in Shared Drop-down list BLD MULTI FAMILY MASTER or
		  if "Master Plan Type" = Other than delete row in Shard Drop-down BLD OTHER MASTER.
		  
		  If the above delete was the last row in the Shared drop-down then check if there is an Inactive row where value = Code Change
		  if so activate it if not then add row with value of Code Change and status of Active. (Shared drop-down list needs to have something for the user to pick)

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	removeMasterPlanDataFromShrdDDList([ "Unapproved", "Withdrawn" ], "BLD_CODE_REF");

Notes:
	- could not find delete for standard-choice, used INACTIVE instead
*/
var masterTypePlan = AInfo["Master Plan Type"];
var sDList2Update = "";

if(masterTypePlan == "Single Family") sDList2Update = "BLD SINGLE FAMILY MASTER";
if(masterTypePlan == "Multi Family") sDList2Update = "BLD MULTI FAMILY MASTER";
if(masterTypePlan == "Other") sDList2Update = "BLD OTHER MASTER";

logDebug("Shared Drop-Down to update: " + sDList2Update);
if(sDList2Update != "")
    removeMasterPlanDataFromShrdDDList([ "Unapproved", "Withdrawn" ], sDList2Update);

/*
Title : Add Master Plan Data to Share Dropdown for Building Records (ApplicationStatusUpdateAfter) 

Purpose : Based on ASI value, check and inactivate a row in a shared DDL, and insert a row in Shared DDL

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");
*/

addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");
