function civPlnsScript10_addReviewerContact(){
    logDebug("civPlnsScript10_addReviewerContact() started");
    try{
        var stdChoice = "AGENCY REVIEWER";
        var outsideReviews = getASIgroup("OUTSIDE AGENCY REVIEWS", capId);
        
        if(outsideReviews == null || outsideReviews == undefined) return;
        
        for(eachRev in outsideReviews){
            var reviewObj = outsideReviews[eachRev];
            var review = reviewObj.getCheckboxDesc();
            var reviewValue = reviewObj.getChecklistComment();
            
            if(reviewValue == "CHECKED"){
                var contact = lookup(stdChoice, review);
                if(contactByBusNameExistsOnCap(contact, capId, "Outside Agency")){ 
                    logDebug("Contact " + contact + " already exists as 'Outside Agency' contact type.  Skipping");
                    continue;
                }
                
                logDebug("Trying to add contact " + contact);
                var contactAdded = addReferenceContactByBusinessName(contact, capId);
                if(!contactAdded) { logDebug("Unable to add contact."); return false; }
                logDebug("Contact added " + contactAdded);
                
                var peopResult = aa.people.getCapContactByContactID(contactAdded);
                if (peopResult.getSuccess()) {
                    var peop = peopResult.getOutput();
                    var capConObj = peop[0];
                    var capConEml = capConObj.getEmail();
                    
                    if(capConEml){
                        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
                        var reportFile = [];
                        var eParams = aa.util.newHashtable();
                        addParameter(eParams, "$$altID$$", capIDString);
                        addParameter(eParams, "$$fileDate$$", fileDate);
                        addParameter(eParams, "$$ApplicationName$$", cap.getSpecialText());
                        addParameter(eParams, "$$workDesc$$", workDescGet(capId));
                        addParameter(eParams, "$$ReviewDueDate$$", dateAdd(null, 7, true));
                        
                        var sendResult = sendNotification("noreply@aurora.gov",capConEml,"","PW OUTSIDE REVIEWER EMAIL #10",eParams,reportFile,capID4Email);
                        if (!sendResult) { logDebug("civPlnsScript10_addReviewerContact: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
                        else { logDebug("civPlnsScript10_addReviewerContact: Sent email to outside reviewer "+capConEml)}
                    }
                }
                else {
                    logDebug("WARNING: Unable to get cap contact to send email. Message: " + peopResult.getErrorMessage());
                }
            }
        }
    }
    catch(err){
        showMessage = true;
        errorMessage = "Error on civPlnsScript10_addReviewerContact(). Err: " + err + ". Line Number: " + err.lineNumber + ". stack: " + err.stack;
        comment(errorMessage);
        logDebug(errorMessage);
    }
    logDebug("civPlnsScript10_addReviewerContact() ended");
}//END civPlnsScript10_addReviewerContact()