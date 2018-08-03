
/**
 * 
 * @param workflowTask work flow task that need to be checked
 * @param worflowStatus work flow status that need to be checked
 * @param LicenseType 4 levels for the license record to be created 
 * @param emailTemplate email template
 * @param reportName report name    
 * @param rptParams report param if exists
 */
function createArboristLicenseAndCopyDataAndSendEmail(LicenseType, emailTemplate, reportName, rptParams) {
    logDebug("createArboristLicenseAndCopyDataAndSendEmail() Started");
    try{
        var applicantEmail = "";
        var licTypeArray = LicenseType.split("/");
        var appName = cap.getSpecialText();
        var createdApp = aa.cap.createApp(licTypeArray[0], licTypeArray[1], licTypeArray[2], licTypeArray[3], appName);
        
        if (!createdApp.getSuccess()) {
            logDebug("**ERROR creating app failed, error: " + createdApp.getErrorMessage());
        }
        
        createdApp = createdApp.getOutput();
        logDebug("Creating Parent License : " + createdApp.getCustomID());
        //add as parent:
        var related = aa.cap.createAppHierarchy(createdApp, capId);
        if (!related.getSuccess()) {
            logDebug("**ERROR createAppHierarchy failed, error: " + related.getErrorMessage());
        }
        if (createdApp != null) {
            copyContacts(capId, createdApp);
            copyAppSpecific(createdApp);
            var rNewLicIdString = createdApp.getCustomID();
            
            updateAppStatus("Issued", "Issued via script", createdApp);
            
            //vExpDate = new Date();
            vNewExpDate = new Date(vExpDate.getFullYear(), 11, 31);
            
            createRefLP4Lookup(rNewLicIdString, "Business", "Arborist Applicant", null);
            var rNewLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, rNewLicIdString).getOutput();
            if(rNewLP) {
                var theRefLP = rNewLP[0];
                aa.licenseScript.associateLpWithCap(capId, theRefLP);
                theRefLP.setLicenseExpirationDate(aa.date.getScriptDateTime(vNewExpDate));
                var editRefResult = aa.licenseScript.editRefLicenseProf(theRefLP);
            }
                
                var rB1ExpResult = aa.expiration.getLicensesByCapID(createdApp).getOutput();
                rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
                rB1ExpResult.setExpStatus("Active");
                aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
            
            var recordApplicant = getContactByType("Arborist Applicant", capId);
            if (recordApplicant) {
                applicantEmail = recordApplicant.getEmail();
            }
            if (applicantEmail == null || applicantEmail == "") {
                logDebug("**WARN Applicant on record " + capId + " has no email");
        
            } else {
        
                var emailParams = aa.util.newHashtable();
                addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
                //addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
                //addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
                //addParameter(emailParams, "$$wfComment$$", wfComment);
                //addParameter(emailParams, "$$wfTask$$", wfTask);
                //addParameter(emailParams, "$$wfStatus$$", wfStatus);
        
                //sendEmailWithReport(applicantEmail, "", emailTemplate, reportName, rptParams, emailParams)
                emailContacts("Arborist Applicant",emailTemplate, emailParams, reportName,rptParams);
        
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function createArboristLicenseAndCopyDataAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function createArboristLicenseAndCopyDataAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("createArboristLicenseAndCopyDataAndSendEmail() ended");
}//END
