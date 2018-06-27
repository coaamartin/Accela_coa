function createTempChildGeneric(grp, type, stype, cat, options) {  
    //cvm not tested 6/21/2018 
    var settings = {
        parentCapID: capId,
        appName: null,
        capClass: "INCOMPLETE CAP",
        accessByACA: false,
        copyParcels: false,
        copyAddresses: false,   
        copyOwner: false,
        copyContacts: false,
        customFields: []    // array of key/val objects { key: "Awesome_Guy", val: "Charlie" }
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

    if(settings.accessByACA) {
        aa.cap.updateAccessByACA(childCapId, "Y");
    }

    if(settings.copyParcels) {
        copyParcels(settings.parentCapID, childCapId);
    }

    if(settings.copyAddresses) {
        copyAddresses(settings.parentCapID, childCapId);
    }

    if(settings.copyOwner) {
        copyOwner(settings.parentCapID, childCapId);
    }

    if(settings.copyContacts) {
        copyContacts(settings.parentCapID, childCapId);
    }

    for(var idxCF in settings.customFields) {
        var objCF = settings.customFields[idxCF];
        editAppSpecific(objCF.key, objCF.val, childCapId);
    }

    return childCapId;  

 }
 