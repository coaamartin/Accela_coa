// script 148

updateFee("LIC_CONT_A01", "LIC_CONTRACTOR_ARBORIST ", "FINAL", 1, "Y");

var thisDate = new Date();
if ((thisDate.getMonth() == 1 && thisDate.getDate() > 1) || thisDate.getMonth > 1) {
	updateFee("LIC_CONT_A02", "LIC_CONTRACTOR_ARBORIST ", "FINAL", 1, "Y");
}