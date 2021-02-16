// script 148

var thisDate = new Date();
if ((thisDate.getMonth() == 1 && thisDate.getDate() > 1) || thisDate.getMonth() > 1) {
	updateFee("LIC_CONT_A02", "LIC_CONTRACTOR_ARBORIST", "FINAL", 1, "Y");
}