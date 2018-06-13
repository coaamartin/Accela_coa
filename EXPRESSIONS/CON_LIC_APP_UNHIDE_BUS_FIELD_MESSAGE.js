/*
script 110
check to see if the record is created yet using the alt id
*/

var altID=expression.getValue("CAP::capModel*altID");

if (("" + altID.value).indexOf("-CL") == -1) {  // real record

	var variable0 = expression.getValue("ASI::GENERAL INFORMATION::Do you have a City of Aurora Business License?");
	var variable1 = expression.getValue("ASI::GENERAL INFORMATION::City of Aurora Business License #");

	if ((variable0.value != null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y') || variable0.value.equalsIgnoreCase('CHECKED') || variable0.value.equalsIgnoreCase('SELECTED') || variable0.value.equalsIgnoreCase('TRUE') || variable0.value.equalsIgnoreCase('ON')))) {

		variable1.required = true;
		expression.setReturn(variable1);

		variable1.hidden = false;
		expression.setReturn(variable1);
	} else {
		variable1.required = false;
		expression.setReturn(variable1);
		variable1.hidden = true;
		expression.setReturn(variable1);
	}
	if ((variable0.value != null && (variable0.value.equalsIgnoreCase('NO') || variable0.value.equalsIgnoreCase('N') || variable0.value.equalsIgnoreCase('UNCHECKED') || variable0.value.equalsIgnoreCase('UNSELECTED') || variable0.value.equalsIgnoreCase('FALSE') || variable0.value.equalsIgnoreCase('OFF')))) {

		variable0.message = "Ok I have added the Business License Application that will be available once you finish this application.";
		expression.setReturn(variable0);
	}
}
