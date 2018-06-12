 function Script332_scheduleInspectionTSI()  {
            
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
   if(dd<10) {
    dd = '0'+dd
    } 
   if(mm<10) {
    mm = '0'+mm
   } 
today = mm + '/' + dd + '/' + yyyy;
  
var tsiArray = new Array();
            //var today = new Date();
			
            loadTaskSpecific(tsiArray);
            var pPreHearingDate = tsiArray["Pre hearing inspection date"];
            var inspectorID = getInspectorID();
			var noOfDays = dateDiff(today, pPreHearingDate);
            logDebug("pPreHearingDate: "+ pPreHearingDate);
            logDebug("noOfDays: "+ noOfDays);
            
            if (pPreHearingDate != null ) {
                scheduleInspection("Pre Court Inspection", noOfDays, inspectorID);
            }
 }        