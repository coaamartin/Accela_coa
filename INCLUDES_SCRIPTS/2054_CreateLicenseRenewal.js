if(matches(currentUserID,"ACHARLTO")){
showDebug =3;
}

if (appMatch('Licenses/*/*/Renewal')) {
		parentLicenseCAPID = getParentCapIDForReview(capId);
		comment('ParentLic CAPID = ' + parentLicenseCAPID);

		updateAppStatus('Active - Pending Renewal', 'Renewal Record Activated: ' + capIDString, parentLicenseCAPID);

                today = new Date(); comment("Today = " + today); 
                theMonth = today.getMonth(); comment("the month = " + theMonth);
                theYear = today.getFullYear(); comment("The Year = " + theYear);
                nextYear = theYear + 1; comment("Next Year = " + nextYear);
                if (matches(theMonth,"11")){ 
                     renewalYear = nextYear; 
                }
                else {
                     renewalYear = theYear;
                }

                parentLicenseCAPID = getParentCapIDForReview(capId); comment("ParentLic CAPID = " + parentLicenseCAPID);


                saveCap = cap
                cap = aa.cap.getCap(parentLicenseCAPID).getOutput();	
                pCapIdSplit = String(parentLicenseCAPID).split("-"); pCapIdObj = aa.cap.getCapID(pCapIdSplit[0],pCapIdSplit[1],pCapIdSplit[2]).getOutput(); pCapIDString = pCapIdObj.getCustomID();comment("ParentLic CAPID String= " + pCapIDString);
                stringYear = renewalYear.toString(); editIdString = pCapIDString.substr(0,10)+"R"+stringYear.substr(2,3); aa.cap.updateCapAltID(capId,editIdString);
	
                logDebug('Running CTRCA4Renew');
		aa.runScript('CONVERT2REALCAPAFTER4RENEW');
		logDebug('Return from CTRCA4Renewal: ' + aa.env.getValue('ScriptReturnMessage'));
	}
