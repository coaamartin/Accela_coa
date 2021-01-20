//SWAKIL ID 488
if ("City Application Intake".equals(wfTask) && "Complete".equals(wfStatus))
{
	include("488_Check_MJ_Renewal_Docs");
}

if(wfTask.equals("Renewal Review") && wfStatus.equals("Complete") && balanceDue > 0){
	cancel = true;
	showMessage = true;
	comment("Fee is not Paid yet");
}