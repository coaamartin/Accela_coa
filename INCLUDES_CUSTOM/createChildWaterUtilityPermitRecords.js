/* Script 337 
 *
 * Create water permit child.
 *
 */
function createChildWaterUtilityPermitRecords() {
    logDebug("createChildWaterUtilityPermitRecords() started");
    try {
        var $iTrc = ifTracer2;
        if ($iTrc(wfTask == "Fire Life Safety Review" && wfStatus == "Approved", 'wfTask == "Fire Life Safety Review" && wfStatus == "Approved"')) {
            var tsiArray = new Array();
            loadTaskSpecific(tsiArray);
            var pFireLine = tsiArray["Private Fire Line"];
            var NoOfFireLines = tsiArray["Number of Private Fire Lines"];
            aa.print("pFireLine: "+ pFireLine);
            aa.print("NoOfFireLines: " + NoOfFireLines);
            
            if (pFireLine == "Yes" && (NoOfFireLines != null && parseInt(NoOfFireLines) > 0)) {

                for (var i = 0; i < parseInt(NoOfFireLines); i++) {
                    var cCapId = createChild("Water", "Utility", "Permit","NA", "Water Utility Permit"); // this function
                                                            // copies address,
                                                            // parcel,and
                                                            // contact
                                                            // information
                    if (cCapId != null) {
                        // copy Owner
                        copyOwner(capId, cCapId);
                    }

                }
                editAppSpecific("Utility Permit Type", "Private Fire Lines",cCapId);
            }
        }
    } catch (e) {
        logDebug("****ERROR IN WTUA:BUILDING/PERMIT/NEW BUILDING/NA:**** " + e);
    }
    logDebug("createChildWaterUtilityPermitRecords() ended");
}//END createChildWaterUtilityPermitRecords()