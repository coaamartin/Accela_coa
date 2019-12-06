var contacts = getContactArrayBefore();
if (contacts.length == 0)
{
	cancel = true;
	showMessage = true;
	comment("Must at least have 1 contact");
}