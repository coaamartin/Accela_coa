/* Script 337 
 *
 * Create water permit child.
 *
 */
function createChildWaterUtilityPermitRecords() {
    logDebug("createChildWaterUtilityPermitRecords() started");
    try {
        var $iTrc = ifTracer;
        if ($iTrc(wfTask == "Fire Life Safety Review" && wfStatus == "Approved", 'wfTask == "Fire Life Safety Review" && wfStatus == "Approved"')) {
            var tsiArray = new Array();
            loadTaskSpecific(tsiArray);
            var pFireLine = tsiArray["Is there a private fire line?"];
            var NoOfFireLines = tsiArray["Number of Fire Lines"];
            logDebug("pFireLine: "+ pFireLine);
            logDebug("NoOfFireLines: " + NoOfFireLines);
            
            if ($iTrc(pFireLine == "Yes" && (NoOfFireLines != null && parseInt(NoOfFireLines) > 0), 'pFireLine == "Yes" && (NoOfFireLines != null && parseInt(NoOfFireLines) > 0)')) {

                for (var i = 0; i < parseInt(NoOfFireLines); i++) {
                    var cCapId = createChild("Water", "Utility", "Permit","NA", "Water Utility Permit"); // this function
                                                            // copies address,
                                                            // parcel,and
                                                            // contact
                                                            // information
                    if ($iTrc(cCapId, 'cCapId')) {
                        logDebug("Created Child " + cCapId.getCustomID());
                        // copy Owner
                        copyOwner(capId, cCapId);
                        editAppSpecific("Utility Permit Type", "Private Fire Line Permit",cCapId);
                    }
                }
            }
        }
    } catch (e) {
        logDebug("****ERROR IN WTUA:BUILDING/PERMIT/NEW BUILDING/NA:**** " + e);
    }
    logDebug("createChildWaterUtilityPermitRecords() ended");
}//END createChildWaterUtilityPermitRecords()