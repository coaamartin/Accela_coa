function dateAddHC2(td, amt)
// perform date arithmetic on a string; uses the agency holiday calendar to test for business days
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
{

	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) {
		dDate = new Date();
	}
	else {
		logDebug("trying to convert date...");
		dDate = convertDate(td);
	}
	logDebug("date: " + dDate);
	var i = 0;
	var nonWorking = false;
	var failsafe = 0;
	// incorporate logic that will increment the date without counting non-working days
	if (useWorking){
		while (i < Math.abs(amt) && failsafe < 200) {
			// handle positive date changes
			if (amt > 0) {
				nonWorking = checkHolidayCalendar(dDate);
				if (!nonWorking){
					dDate = convertDate(dateAdd(dDate,1));
					i++;
					failsafe++;
					logDebug("nonWorking = " + nonWorking + " || amt = " + amt + " || i = " + i + " || failsafe = " + failsafe + " || dDate = " + dDate );
				}
				else {
					dDate = convertDate(dateAdd(dDate,1));
					failsafe++;
					logDebug("nonWorking = " + nonWorking + " || amt = " + amt + " || i = " + i + " || failsafe = " + failsafe + " || dDate = " + dDate );
				}				
			} 
			// handle negative date changes
			else {
				if (!checkHolidayCalendar(dDate)){
					dDate = convertDate(dateAdd(dDate,-1));
					i++;
					failsafe++;
				}
				else {
					dDate = convertDate(dateAdd(dDate,-1));
					failsafe++;
				}
			}
		}
	}
	// ignore non-working days and simply use calendar days increment
	else{
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));
	}
	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}
