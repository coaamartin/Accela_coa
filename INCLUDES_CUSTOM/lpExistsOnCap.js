function lpExistsOnCap(itemCap){
    var licProfResult = aa.licenseScript.getLicenseProf(itemCap);
    if (!licProfResult.getSuccess()){
        logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
        //return false;
    }
    else{
        var licProfList = licProfResult.getOutput();
        if(licProfList && licProfList.length > 0) return true;
    }
	return false;
}