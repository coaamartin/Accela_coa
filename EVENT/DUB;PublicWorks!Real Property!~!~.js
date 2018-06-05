var defaultValidationMsg = "The following documents are required to continue:";
validationMsg = defaultValidationMsg;

cancel = true;
showMessage = true;
if (isPublicUser) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", validationMsg);
	comment(validationMsg);
} else {
	comment(validationMsg);
}
