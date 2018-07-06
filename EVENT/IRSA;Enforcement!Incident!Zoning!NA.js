
// Script 421
if ("Zoning Initial Inspection".equals(inspType) && "Citation/Summons".equals(inspResult) {
	var holdId = capId;
	var r = getRelatedCapsByAddress("Enforcement/Incident/Summons/NA");
	if (r && r.length > 0) {
		for (var i in r) {
			var capId = aa.cap.getCapID(r[i].getID1(), r[i].getID2(), r[i].getID3()).getOutput();
			var thisCap = aa.cap.getCapBasicInfo(capId).getOutput();
			logDebug("related summons address: " + capId.getCustomID() + " has status " + thisCap.getCapStatus());
			if ("NFZV - 1 Year".equals(thisCap.getCapStatus())) {
				activateTask("Pre Summons Photos");
				updateAppStatus("Pending Citation", "Updated by Script 421");
				var thisInsp = scheduleInspectDate("Summons Issuance", dateAdd(null, 0));
				logDebug("inspection is " + thisInsp);
			}
		}

	}
	capId = holdId;
}
// End Script 421