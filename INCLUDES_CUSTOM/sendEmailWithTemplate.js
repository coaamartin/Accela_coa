
/**
 *  
 * @param emailTemplate email template
 * @param emailAddress email address	
 * @param checkListItem1 check list item to include it in the template
 * @param checkListItem2 check list item to include it in the template
 * @param itemComment1 check list item comment to include it in the template
 * @param itemComment2  check list item comment to include it in the template
 * @returns {Boolean} returns true if the email has been send otherwise will return false 
 */
function sendEmailWithTemplate(emailTemplate, emailAddress, checkListItem1, checkListItem2, itemComment1, itemComment2) {

	var files = new Array();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$inspType$$", inspType);
	addParameter(eParams, "$$inspResult$$", inspResult);
	addParameter(eParams, "$$checkListItem1$$", checkListItem1 + "Comment : " + itemComment1);
	addParameter(eParams, "$$checkListItem2$$", checkListItem2 + "Comment : " + itemComment2);

	var sent = aa.document.sendEmailByTemplateName("", emailAddress, "", emailTemplate, eParams, files);
	if (!sent.getSuccess()) {
		logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	return true;

}
