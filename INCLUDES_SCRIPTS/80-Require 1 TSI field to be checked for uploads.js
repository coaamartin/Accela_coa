/* 80-Require 1 TSI field to be checked for uploads

11/6/2018 Workflow Task – Pre Submittal Meetings and Status Email Applicant then require at least 1 TSI field to be checked.  
          If no fields are checked then display message “Email Applicant Requires at least 1 document type to be checked for the applicant to upload

*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #80 - 80-Require 1 TSI field to be checked for uploads");

if ("Pre Submital Meetings".equals(wfTask) && "Email Applicant".equals(wfStatus)) 
{

    var TSIFieldChecked = false;
    
    var tsiArray = new Array(); 
    loadTaskSpecific(tsiArray);
    
	 for (i in tsiArray)
    {
    logDebug ("JMP here .. Lets look at the tsiArray = " + tsiArray[i] + "");
    
    }
}

