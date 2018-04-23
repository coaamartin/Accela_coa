var vIsWithinProximity = proximity("AURORACO","Caution Homes","1000","feet");

if (vIsWithinProximity == true) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within 1000 feet of a caution home</B></Font>.");
}