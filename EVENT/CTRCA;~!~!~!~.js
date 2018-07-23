//Needed to get GIS feature associated when created by ACA
//Copy Parcel GIS Objects to Record using function copyParcelGisObjects()
try{
	copyParcelGisObjects();
	var codeDistrict = new Array;
	codeDistrict = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","CODE_NUMBER")
	if(codeDistrict && codeDistrict.length > 0){
		addParcelDistrict(null,codeDistrict[0]["CODE_NUMBER"]);
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: CTRCA:*/*/*/*: copyParcelGisObjects():" + err.lineNumber + ". Err Message: " + err.message);
	logDebug("Stack: " + err.stack);
};