// WTUA:Building/*/*/*

/* following block of code was in Accela but not Github... it was added by "ADMIN" 12-22-2016
if (wfTask == "Permit Issuance" && wfStatus == "Issued")
editAppSpecific("Permit Issued Date", sysDateMMDDYYYY);
if (wfTask == "Permit Issuance" && wfStatus == "Issued")
editAppSpecific("Permit Expiration Date", dateAdd(null, 180));
if (wfTask == "Permit Status" && wfStatus == "Permit Issued")
editAppSpecific("Permit Issued Date", sysDateMMDDYYYY);
if (wfTask == "Permit Status" && wfStatus == "Permit Issued")
editAppSpecific("Permit Expiration Date", dateAdd(null, 180));
if (wfTask == "Permit Issuance" && wfStatus == "Issued")
licEditExpInfo(null, AInfo["Permit Expiration Date"]);
if (wfTask == "Permit Status" && wfStatus == "Permit Issued")
licEditExpInfo(null, AInfo["Permit Expiration Date"]);
// end ADMIN code
*/
//script205_DeactivateSpecInsp();

//Script 202 - Auto create inspections for Building
/*------------------------------------------------------------------------------------------------------/
| Purpose		: Auto create inspections for building
| Notes			: Assumed the following mapping (between the approved wftask & the inspection type to be scheduled):
			 wfTask :Electrical Plan Review/ InspTypes : Electrical Final,Electrical Rough
                         wfTask :Mechanical Plan Review/ InspTypes : :Mechanical Final,:Mechanical Rough
                         wfTask :Plumbing Plan Review/ InspTypes : Plumbing Final,Plumbing Rough
                         wfTask :Structural Plan Review/ InspTypes : Framing Final,Framing Rough
| Created by	: ISRAA
| Created at	: 01/02/2018 16:19:04
|
/------------------------------------------------------------------------------------------------------*/

if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	var tasksToCheck = [ "Mechanical Plan Review", "Electrical Plan Review", "Plumbing Plan Review", "Structural Plan Review" ];
	createAutoInspection(tasksToCheck);
}

// Script #205

if (wfTask == "Permit Issuance" && wfStatus == "Issued") {

	if(AInfo["Special Inspections"] != "Yes")

		{

		deactivateTask("Special Inspections Check","BLD_NEWCON_INSPSUB")

		deactivateTask("Special Inspections Check","BLD_MASTER_INSPSUB")

		}

	if(!isTaskStatus("Engineering Review","Approved with FEMA Cert Required"))

		{

		deactivateTask("FEMA Elevation Certification","BLD_NEWCON_INSPSUB")

		}

}

if(isTaskActive("Subtasks Complete","BLD_NEWCON_INSPSUB")&& allTasksComplete("BLD_NEWCON_INSPSUB","Subtasks Complete"))

	{

	closeTask("Subtasks Complete","Complete","","", "BLD_NEWCON_INSPSUB")

	}

// Script#206

if(isTaskActive("Subtasks Complete","BLD_MASTER_INSPSUB") && allTasksComplete("BLD_MASTER_INSPSUB","Subtasks Complete"))

	{

	closeTask("Subtasks Complete","Complete","","", "BLD_MASTER_INSPSUB")

	}



