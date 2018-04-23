var vIsWithinProximity = proximity("AURORACO","Pawn and Cash Advance","1000","feet");

if (vIsWithinProximity == true) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within 1000 feet of a pawn shop or cash advance</B></Font>.");
}