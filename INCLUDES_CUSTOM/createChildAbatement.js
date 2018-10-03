function createChildAbatement(iType, iResult, schedIType, setFieldValue)
{
    if (inspType == iType && inspResult == iResult)
    {
        logDebug("function createChildAbatement criteria met:  inspection type = " + iType + " and result = " + iResult);
        
        var currentCapId = capId;
        var appName = "Abatement created for Record Number " + capId.customID;
        var newChildCapId = createChild('Enforcement','Incident','Abatement','NA',appName);
        var appHierarchy = aa.cap.createAppHierarchy(capId, newChildCapId);
        copyRecordDetailsLocal(capId, newChildCapId);
        copyContacts(capId, newChildCapId);
        copyAddresses(capId, newChildCapId);
        copyParcels(capId, newChildCapId);
        copyOwner(capId, newChildCapId);
        
        // get the inspector from GIS and assign the rec to this user
        inspUserObj = null;
        x = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","OFFICER_NAME");
		if(x[0]){
            logDebug(x[0]["OFFICER_NAME"]);
            
            var offFullName = x[0]["OFFICER_NAME"];
            
            var offFname = offFullName.substr(0,offFullName.indexOf(' '));
            logDebug(offFname);
            
            var offLname = offFullName.substr(offFullName.indexOf(' ')+1);
            logDebug(offLname);
            
            inspUserObj = aa.person.getUser(offFname,null,offLname).getOutput();
		}
		
        if(inspUserObj != null)
        { assignCap(inspUserObj.getUserID(), newChildCapId); }

		var newInspId = scheduleInspectionCustom4CapId(newChildCapId, schedIType,0, currentUserID);
		
		if(newInspId){
            var clItemStatus2Copy = ["Abate/Record", "Abate/Summons", "Abate"];
		
            if(clItemStatus2Copy.length > 0) copyCheckListByItemStatus(inspId, newInspId, clItemStatus2Copy, capId, newChildCapId);
		}
    
        editAppSpecific("Abatement Type", setFieldValue, newChildCapId); 

    }
}