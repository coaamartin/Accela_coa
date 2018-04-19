
/**
 * 
 * @param InspectionType the insp type that need to be checked
 * @param checkListItem1 the check list item that need to be checked 
 * @param checkListItem2 the check list item that need to be checked 
 * @param checkListItemValue the check list item value that need to be checked 
 * @param emailTemplate email template
 * @param emailAddress email address
 */
function sendEmailBasedOnInspectionResult(InspectionType, checkListItem1, checkListItem2, checkListItemValue, emailTemplate, emailAddress) {
	var itemComment1 = "";
	var itemComment2 = "";
	for (i in InspectionType) {
		if (inspResult != null && inspResult != "" && inspType == InspectionType[i]) {
			var Insp = inspObj.getIdNumber();
			if (inspObj.getInspectionType().equalsIgnoreCase(InspectionType[i])) {
				var objeclist = getGuideSheetObjects(Insp);
				for ( var ob in objeclist) {
					if (objeclist[ob].text.equalsIgnoreCase(checkListItem1)) {
						if (objeclist[ob].status.equalsIgnoreCase(checkListItemValue)) {
							itemComment1 = objeclist[ob].comment;
						}
					}
					if (objeclist[ob].text.equalsIgnoreCase(checkListItem2)) {
						if (objeclist[ob].status.equalsIgnoreCase(checkListItemValue)) {
							itemComment2 = objeclist[ob].comment;
						}
					}
				}
			}
			break;
		}
	}//for all insp types to check

	if (itemComment1 != "" || itemComment2 != "") {
		sendEmailWithTemplate(emailTemplate, emailAddress, checkListItem1, checkListItem2, itemComment1, itemComment2);
	}
}
