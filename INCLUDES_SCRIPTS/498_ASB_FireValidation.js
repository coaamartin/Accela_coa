//This was updated by Raymond Provinc on 1/8/2019 to remove fire compliant from running this code.
var contacts = getContactArrayBefore();
if (!appMatch("Fire/Complaint/NA/NA")(contacts.length == 0))
{
	cancel = true;
	showMessage = true;
	comment("Must at least have 1 contact");
}