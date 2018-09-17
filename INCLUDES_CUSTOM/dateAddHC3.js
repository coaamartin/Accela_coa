function dateAddHC2(td, amt)
// perform date arithmetic on a string; uses the agency holiday calendar to test for business days
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
// 
// function corrected by SLS Eric Koontz
//     correctly adjust the target date to ensure that the date returned is a workind day
//     correctly handle a zero date adjustment 
{
   	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) {
		dDate = new Date();
	}
	else {
		dDate = convertDate(td);
	}
	var i = 0;
	var nonWorking = false;
	var failsafe = 0;

	// incorporate logic that will increment the date without counting non-working days
	if (useWorking){
		while (i < Math.abs(amt) && failsafe < 600) {
			// handle positive date changes
			if (amt >= 0) {
				nonWorking = checkHolidayCalendarIgnoreWeekends(dDate);
				if (!nonWorking){
					i++;
					failsafe++;
					dDate = convertDate(dateAdd(dDate,1));
				}
				else {
					failsafe++;
					dDate = convertDate(dateAdd(dDate,1));
				}				
			} 
			// handle negative date changes
			else {
				if (!checkHolidayCalendarIgnoreWeekends(dDate)){
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
		
		// we have identified the target date using the working calendar, now we need
		// to confirm that the target date is a working day
		nonWorking = checkHolidayCalendarIgnoreWeekends(dDate);
		while (nonWorking) 
		{
			i++;
			failsafe++
			if (amt >= 0 ) {
				dDate = convertDate(dateAdd(dDate,1));
			}
			else{
				dDate = convertDate(dateAdd(dDate,-1));
			}
				nonWorking = checkHolidayCalendarIgnoreWeekends(dDate);
		}
	}
	// ignore non-working days and simply use calendar days increment
	else{
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));
	}
	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}
