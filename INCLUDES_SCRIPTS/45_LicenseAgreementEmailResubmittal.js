//written by swakil edited by jmain

var checkTasks = ["Engineering Review", "Water Dept Review", "Life Safety Review", "Traffic Review", "Parks Review", "Risk Management Review", "Real Property Review", "Planning Review"];
if (exists(wfTask, checkTasks))
{
  var isAllComplete = isListComplete(checkTasks);
  var isAllStatusComplete = isListCompleteStatus(checkTasks);

  if (isAllComplete && !isAllStatusComplete)
  {
    sendEmailToApplicant();
    updateTask("Plans Coordination", "Resubmittal Requested", "Update via script COA #45");
  }
}


function isListComplete(checkList)
{
  var isComplete = true;
  for (var x in checkList)
  {
    if (!isTaskComplete(checkList[x])) return false;
  }
  return isComplete;
}


function isListCompleteStatus(tasks2Check)
{
  for (var y in tasks2Check)
  {
    if (!"Complete".equals(taskStatus(tasks2Check[y]))) return false;
  }
  return true;
}

function sendEmailToApplicant(){
  var contacts = "Applicant";
  var template = "PW_UPDATE_PLANS_FOR_LICENSE_AGREEMENT";
  var lictype = getAppSpecific("LICENSE AGREEMENT INFORMATION") + ""; //force string
  var wireless = getAppSpecific("Wireless Facility") + ""; //force string
  var flagpole = getAppSpecific("Flag Poles") + ""; //force string
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$lictype$$", lictype)
  emailparams.put("$$wireless$$", wireless);
  emailparams.put("$$flagpole$$", flagpole);
  emailContacts(contacts, template, emailparams, "", "", "N", "");
}