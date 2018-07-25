function createChildAbatement(iType, iResult, schedIType, setFieldValue)
{
    if (inspType == iType && inspResult == iResult)
    {
        logDebug("function createChildAbatement criteria met:  inspection type = " + iType + " and result = " + iResult);
        
        var currentCapId = capId;
        var appName = "Abatement created for Record Number " + capId.customID;
        var newChild = createChild('Enforcement','Incident','Abatement','NA',appName);
        var appHierarchy = aa.cap.createAppHierarchy(capId, newChild);
        copyRecordDetailsLocal(capId, newChild);
        copyContacts(capId, newChild);
        copyAddresses(capId, newChild);
        copyParcels(capId, newChild);
        copyOwner(capId, newChild);
        
        // get the inspector from GIS and assign the rec to this user
        inspUserObj = null;
        x = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","OFFICER_NAME");
        logDebug(x[0]["OFFICER_NAME"]);
        
        capId = newChild;
        
        var offFullName = x[0]["OFFICER_NAME"];
        
        var offFname = offFullName.substr(0,offFullName.indexOf(' '));
        logDebug(offFname);
        
        var offLname = offFullName.substr(offFullName.indexOf(' ')+1);
        logDebug(offLname);
        
        inspUserObj = aa.person.getUser(offFname,null,offLname).getOutput();
        if(inspUserObj != null)
            { assignCap(inspUserObj.getUserID()); }

        scheduleInspection(schedIType,0, currentUserID);
        
        capId = currentCapId;
    
        editAppSpecific("Abatement Type", setFieldValue, newChild); 

    }
}