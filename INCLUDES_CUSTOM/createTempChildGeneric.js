function createTempChildGeneric(grp, type, stype, cat, options) {  
    //cvm not tested 6/21/2018 
    var settings = {
        parentCapID: capId,
        appName = null,
        capClass = "INCOMPLETE CAP",
        accessByACA = false,
        copyParcels: false,
        copyAddresses: false,
        copyOwner: false,
        copyContacts: false,
        customFields: []    // array of key/val objects { key: "Awesome Guy", val: "waterMainUtilityPermit" }
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var emptyCm = aa.cap.getCapModel().getOutput();
    var emptyCt = emptyCm.getCapType();
    emptyCt.setGroup(grp); 
    emptyCt.setType(type); 
    emptyCt.setSubType(stype);
    emptyCt.setCategory(cat);
    emptyCm.setCapType(emptyCt);

    var childCapId = aa.cap.createSimplePartialRecord(emptyCt, settings.appName, settings.capClass).getOutput();
    aa.cap.createAppHierarchy(capId, childCapId);

    if(accessByACA) {
        aa.cap.updateAccessByACA(childCapId, "Y");
    }

    if(copyParcels) {
        copyParcels(parentCapID, childCapId);
    }

    if(copyAddresses) {
        copyAddresses(parentCapID, childCapId);
    }

    if(copyOwner) {
        copyOwner(parentCapID, childCapId);
    }

    if(copyContacts) {
        copyContacts(parentCapID, childCapId);
    }

    for(var idxCF in options.customFields) {
        var objCF = options.customFields[idxCF];
        editAppSpecific(objCF.key, objCF.val, childCapId);
    }

    return childCapId;  

 }