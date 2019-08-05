logDebug("484_autoCreate_PPBMP");
if ("Plans Coordination".equals(wfTask) && "Approved".equals(wfStatus))
{
	if ("No".equals(AInfo["Storm Water Permit Required"]) && PONDTYPES && PONDTYPES.length > 0)
	{
		var cusIDList = [];
		for (var row in PONDTYPES)
		{
			var appMessage = PONDTYPES[row]["Pond Type"] + " - " + PONDTYPES[row]["Pond Number"];
			var child = createCap("Water/Water/PPBMP/NA", appMessage);
			//update child status
			updateAppStatus("Inactive", "Created via script", child);
			//relate
			addChild(child.getCustomID() + "");
			//update app name
			//editAppName(PONDTYPES[row]["Pond Type"] + " - " + PONDTYPES[row]["Pond Number"], child);
			//copy APO
			copyAddresses(capId, child);
			copyParcels(capId, child);
			copyOwner(capId, child);
			//copy contact
			copyContactsByType(capId, child, "Project Owner");
			//change to applicant
			editContactType("Project Owner", "Applicant", child);
			//update custom field of child
			editAppSpecific("Pond Type", PONDTYPES[row]["Pond Type"], child);
			//editAppSpecific("Asset Number", PONDTYPES[row]["Asset Number"], child);
			PONDTYPES[row]["PPBMP ID"] = child.getCustomID()+"";

		}
		removeASITable("POND TYPES");
    	addASITable("POND TYPES", PONDTYPES);   


		var emailTemplate = "WAT_PPBMP_NEW_INACTIVE",
		contactTypes = 'Applicant',
		emailparams = aa.util.newHashtable();
		emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");		
	}
}

function addChild(childAppNum)
{
var itemCap = capId;
if (arguments.length > 1) itemCap = arguments[1];
if (typeof(childAppNum) != "object")  // is this one an object or string?
	{
	var getCapResult = aa.cap.getCapID(childAppNum);
	if (getCapResult.getSuccess())
		{
		var childId = getCapResult.getOutput();
		}
	else
		{ logDebug( "**ERROR: getting child cap id (" + childAppNum + "): " + getCapResult.getErrorMessage());
			return false;}
	}
else
	{
	childId = childAppNum;
	}

var linkResult = aa.cap.createAppHierarchy(itemCap, childId);
if (linkResult.getSuccess())
	logDebug("Successfully added child Application : " + childAppNum);
else
	logDebug( "**ERROR: linking to application to child record cap id (" + childAppNum + "): " + linkResult.getErrorMessage());

}