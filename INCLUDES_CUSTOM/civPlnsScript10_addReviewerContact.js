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
                logDebug("Trying to add contact " + contact);
                var contactAdded = addReferenceContactByBusinessName(contact, capId);
                if(!contactAdded) logDebug("Unable to add contact.");
                logDebug("Contact added " + contactAdded);
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