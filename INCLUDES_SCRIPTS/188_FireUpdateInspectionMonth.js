// Begin script to set the Inspection Month to same month as submitted date Script 188

if ((publicUser && vEventName == "ConvertToRealCAPAfter") || (!publicUser && vEventName == "ApplicationSubmitAfter")) {

var vToday = new Date();
var vDay = vToday.getDate();
var vMonthNum = vToday.getMonth() + 1;
var vMonthName;
var vYear = vToday.getFullYear();
var vDateFormatted;

switch (vMonthNum) {
case 1:
    vMonthName = "January";
    break;
case 2:
    vMonthName = "February";
    break;
case 3:
    vMonthName = "March";
    break;
case 4:
    vMonthName = "April";
    break;
case 5:
    vMonthName = "May";
    break;
case 6:
    vMonthName = "June";
    break;
case 7:
    vMonthName = "July";
    break;
case 8:
    vMonthName = "August";
    break;
case 9:
    vMonthName = "September";
    break;
case 10:
    vMonthName = "October";
    break;
case 11:
    vMonthName = "November";
    break;
case 12:
    vMonthName = "December";
    break;
}
if (vMonthNum < 10) {
    vMonthNum = "0" + vMonthNum;
}
//vDateFormatted = vDay + " " vMonthName + " " vYear;
vDateFormatted = vMonthNum + " " + vMonthName;
editAppSpecific("Inspection Month",vDateFormatted)

// End script to set the Inspection Month to same month as submitted date
