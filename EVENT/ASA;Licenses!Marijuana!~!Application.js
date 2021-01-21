//showDebug = true;
//JMAIN - MJ Application Submittal
/*if(!publicUser){
include("28_AMEDEmailApplicantAtRecordCreation");
}*/

//ACA FEE Invoice
if(!publicUser){
	invoiceAllFees();
}
//assess State MJ Licensing Fee on application submit
//include("246_AssessStateMJFee");

//SWAKIL
//required docs conditions
//include("495_Add_Required_Docs_Conditions");