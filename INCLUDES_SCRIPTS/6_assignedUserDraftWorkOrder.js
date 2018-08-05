//SWAKIL
if ("Traffic Investigation".equals(wfTask) && "Draft Work Order".equals(wfStatus))
{	
	var userID = aa.env.getValue("CurrentUserID");
	assignTask("Draft Workorder", userID);
}


