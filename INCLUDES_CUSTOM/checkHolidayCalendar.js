/*
* Checks all agency holiday calendars for an event on the specified date
* Returns true if there is an event, else false
* date - javascript date object
*/
function checkHolidayCalendar(date){
	try{
	//check if this is a weekend and return true if yes
	var dayOfWeek = date.getDay();
 	if (dayOfWeek == 0 || dayOfWeek == 6) return true;
 	//now check the calendar
	var holiday = false;
	var calArr = new Array();
	var agency = aa.getServiceProviderCode()
	//get the holiday calendars
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var selectString = "select * from CALENDAR WHERE SERV_PROV_CODE = ? AND CALENDAR_TYPE='AGENCY HOLIDAY' AND  REC_STATUS='A'";
	var sStmt = conn.prepareStatement(selectString);
	sStmt.setString(1, agency);
	var rSet = sStmt.executeQuery();
	while (rSet.next()) {
		calArr.push(rSet.getString("CALENDAR_ID"));
	}
	sStmt.close();
	for (var c in calArr){
		var cal = aa.calendar.getCalendar(calArr[c]).getOutput();
		var events = aa.calendar.getEventSeriesByCalendarID(calArr[c], date.getYear()+1900, date.getMonth()+1).getOutput();
		for (var e in events){
			var event = events[e];
			var startDate = new Date(event.getStartDate().getTime());
			var startTime = event.getStartTime();
			var endDate = event.getEndDate();
			var allDay = event.isAllDayEvent();
			var duration = event.getEventDuration();
			if (dateDiff(startDate,date) >= 0  && dateDiff(startDate,date) < 1){
				holiday = true;
			}
		}
	}
	return holiday;
	}
	catch(r){aa.print(r);}
}
