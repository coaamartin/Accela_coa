var checkTasks = ["Water Revenue Review","Parks Review","Water Dept Review","Easement Review","Real Property Review","Addressing Review","Engineering Review",
"Life Safety Review","Planning Review","Traffic Review"];

var statusCheck = "Resubmittal Requested";

var listIsComplete = isListComplete(checkTasks);

if(listIsComplete){
  var listHasResubmittal = isResubmittal(checkTasks);
  if(listHasResubmittal){
    sendEmailToApplicant();
  }
}

function isListComplete(checkTasks){
  for(i in checkTasks){
    complete = isTaskComplete(checkTasks[i]);
    if(complete){
      continue;
    }else{
      return false;
    }
  }
  return true;
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