//SWAKIL
var uid = aa.env.getValue("CurrentUserID");
if ("Traffic Investigation".equals(wfTask) && "Draft Work Order".equals(wfStatus))
{	
	assignTask("Traffic Investigation",uid);
}



