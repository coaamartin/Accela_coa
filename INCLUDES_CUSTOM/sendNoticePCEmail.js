function sendNoticePCEmail(){
//use the correct wftask name
if (wfTask.indexOf("Prepare Signs and Notice") == 0 && wfStatus=="Complete"){
	//Please use the correct email template name & report name
	var emailTemplate="PLN PREPARE SIGNS #290";
	var reportName="WorkFlowTasksOverdue";
	sendEmailNotification(emailTemplate,reportName);
	}
}