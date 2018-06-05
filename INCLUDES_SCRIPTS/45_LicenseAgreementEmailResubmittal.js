if(isTaskActive("Plans Coordination")){
  var checkTasks = ["Engineering Review", "Real Property Review", "Water Dept Review", "Life Safety Review", "Traffic Review", "Parks Review", "Risk Management Review", "Planning Review"];
  var statusCheck = "Resubmittal Requested";

  var isActive = isListActive(checkTasks);
  if(!isActive){
    var listHasResubmittal = isResubmittal(checkTasks);
    if(listHasResubmittal){
      sendEmailToApplicant();
    }
  }
}

function isListActive(checkTasks){
  for(i in checkTasks){
    active = isTaskActive(checkTasks[i]);
    if(active){
      return true;
    }
  }
  return false;
}

function isResubmittal(){
  for(i in checkTasks){
    status = taskStatus(checkTasks[i]);
    if(status.equals(statusCheck)){
      return true;
    }
  }
  return false;
}

function sendEmailToApplicant(){
  var contact = "Applicant";
  var template = "JD_TEST_TEMPLATE";
  var joke = "Where there's a will, there's a relative.";
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$Joke$$", joke);
  emailContacts(contact, template, emailparams, "", "", "N", "");
}