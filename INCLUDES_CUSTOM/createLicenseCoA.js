function createLicenseCoA(initStatus, copyASI, licWfTask, licWfStatus){
    logDebug("createLicenseCoA() started.");
    try{
        var vParentArry;
        var vLicenseCapID;
        var tmpCap;
        var vParentLicType;
        var vParentLicTypeString;
        var vLicenseObj;

        vParentLicTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "License";
        vParentLicType = "License";

        //Check if the record already has a parent of the correct type.
        //The correct type has the same top three levels of the record type
        //hierarchy as the current record but the fourth level is
        //'License' instead of 'Application'.
        //If no license exists create one.
        //
        vParentArry = getParents(vParentLicTypeString);
        if (vParentArry != null && vParentArry != "") {
            vLicenseCapID = vParentArry[0];
        } else if (appTypeArray[3] == "Application") {
            vLicenseCapID = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], vParentLicType, getAppName(capId));
        }

        //If the current record is an application record and the parent license
        //record does not exist or the current record is a renewal record and
        //the parent license does exist then update the license records info
        if (appTypeArray[3] == "Application" && (vParentArry == null || vParentArry == "")) {
            //Copy Parcels from child to license
            copyParcels(capId, vLicenseCapID);

            //Copy addresses from child to license
            copyAddress(capId, vLicenseCapID);

            //Copy ASI from child to license
            copyASIInfo(capId, vLicenseCapID);

            //Copy ASIT from child to license
            copyASITables(capId, vLicenseCapID);

            //Copy Contacts from child to license
            copyContacts3_0(capId, vLicenseCapID);

            //Copy Work Description from child to license
            aa.cap.copyCapWorkDesInfo(capId, vLicenseCapID);

            //Copy application name from child to license
            editAppName(getAppName(capId), vLicenseCapID);

            //Activate the license records expiration cycle
            vLicenseObj = new licenseObject(null, vLicenseCapID);
            vLicenseObj.setStatus("Active");
            thisLicExpOb = vLicenseObj.b1Exp
            expUnit = thisLicExpOb.getExpUnit()
            expInt = thisLicExpOb.getExpInterval()
            if (expUnit == "MONTHS") {
                newExpDate = dateAddMonths(null, expInt);
                }
            vLicenseObj.setExpiration(newExpDate);

            var processCode = getWfProcessCodeByCapId(vLicenseCapID);
            updateTask(licWfTask, licWfStatus, "Issued via EMSE", "Issued via EMSE", processCode, vLicenseCapID);

            logDebug("createLicenseCoA() ended. Created lic: " + vLicenseCapID.getCustomID());
            return vLicenseCapID;
        }
        else{
            logDebug("createLicenseCoA() ended. A parent license was found. Lic Already exists: " + vLicenseCapID.getCustomID())
            return vLicenseCapID;
        }
        logDebug("createLicenseCoA() ended with false.");
        return false;
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function createLicenseCoA(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function createLicenseCoA(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("createLicenseCoA() ended.");
}//END createLicenseCoA()