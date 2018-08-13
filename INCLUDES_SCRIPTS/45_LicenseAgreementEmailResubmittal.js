var checkTasks = ["Engineering Review", "Water Dept Review", "Life Safety Review", "Traffic Review", "Parks Review"];
if (exists(wfTask, checkTasks))
{
  var isAllComplete = isListComplete(checkTasks);
  var isAllStatusComplete = isListCompleteStatus(checkTasks);

  if (isAllComplete && !isAllStatusComplete)
  {
    sendEmailToApplicant();
    updateTask("Plans Coordination", "Resubmittal Requested", "Update via script");
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
  var contact = "Applicant";
  var template = "JD_TEST_TEMPLATE";
  var joke = "Where there's a will, there's a relative.";
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$Joke$$", joke);
  emailContacts(contact, template, emailparams, "", "", "N", "");
}