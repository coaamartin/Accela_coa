
//SWAKIL
if ("Traffic Investigation".equals(wfTask) && "Draft Work Order".equals(wfStatus))
{	var currentUserID = aa.env.getValue("CurrentUserID");
	var systemUserObj = aa.person.getUser(currentUserID).getOutput();
	assignTask("Draft Workorder", currentUserID);
}

