//This was updated by Raymond Provinc on 1/8/2019 to remove fire compliant from running this code.

if(!appMatch("Fire/Complaint/*/*")){
var contacts = getContactArrayBefore();
if (contacts.length == 0)
{
	cancel = true;
	showMessage = true;
	comment("Must at least have 1 contact");
}
}

//if (!appMatch("Fire/Complaint/*/*")(contacts.length == 0))