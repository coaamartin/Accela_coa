var $iTrc = ifTracer;
//written by JMAIN
include("24_realpropertyApplicationAcceptanceIncomplete");

//SWAKIL
include("25_PlatEmailResubmittal");

//SWAKIL
include("20_PlatFinalDocRequest");


if ($iTrc(wfTask=="Recordation" && wfStatus=="Recorded", 'wfTask=="Recordation" && wfStatus=="Recorded"')){
	//Script 289
	pWrksScript289_subPlatNotification();
}