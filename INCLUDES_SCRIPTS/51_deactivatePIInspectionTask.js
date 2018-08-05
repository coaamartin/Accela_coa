//SWAKIL
if ("Permit Issuance".equals(wfTask) && "Issued".equals(wfStatus))
{
	deactivateTask("PI Inspection");
}
