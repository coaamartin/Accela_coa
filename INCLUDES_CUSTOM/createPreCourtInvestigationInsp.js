//Bld Script 332
function createPreCourtInvestigationInsp(){
	var $iTrc = ifTracer;
	logDebug("createPreCourtInvestigationInsp() started");
	var tsis = [];
    loadTaskSpecific(tsis);
    var preHearInspDte = tsis["Pre hearing inspection date"];
	var inspector = getInspectorID();
	
	if($iTrc(preHearInspDte, 'preHearInspDt')){
		var inspDaysAhead = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(preHearInspDte));
		scheduleInspection("Pre Court Investigation", inspDaysAhead, inspector, null, "Issue Summons");
	}
	
	logDebug("createPreCourtInvestigationInsp() ended");
}//END createPreCourtInvestigationInsp();