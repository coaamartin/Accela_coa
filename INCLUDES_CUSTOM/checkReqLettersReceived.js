/* 
 * Check if all required letters for building have been received
 * @returns {Boolean} true if all required letters have been received
 */
function checkReqLettersReceived(){
	var drainLtrReq = AInfo["Drain Letter Required"] == "CHECKED",
		footgLtrReq = AInfo["Footing - Pier - Cassion Letter Required"] == "CHECKED",
		foundLtrReq = AInfo["Foundation Letter Required"] == "CHECKED",
		ilcLtrReq   = AInfo["ILC Letter Required"] == "CHECKED",
		waterLtrReq = AInfo["Waterproofing Letter Required"] == "CHECKED",
		drainLtrRec = AInfo["Drain Letter Received"] == "CHECKED",
		footgLtrRec = AInfo["Footing - Pier - Cassion Letter Received"] == "CHECKED",
		foundLtrRec = AInfo["Foundation Letter Received"] == "CHECKED",
		ilcLtrRec   = AInfo["ILC Letter Received"] == "CHECKED",
		waterLtrRec = AInfo["Waterproofing Letter Received"] == "CHECKED";
		
	if(drainLtrReq && !drainLtrRec) return false;
	if(footgLtrReq && !footgLtrRec) return false;
	if(foundLtrReq && !foundLtrRec) return false;
	if(ilcLtrReq   && !ilcLtrRec)   return false;
	if(waterLtrReq && !waterLtrRec) return false;
		
	return true;	
}