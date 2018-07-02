function loadUserProperties(usrArr, usrId){
    var usrObjResult = aa.person.getUser(usrId);
    
    if(!usrObjResult.getSuccess()) return false;
    
    var usrObj = usrObjResult.getOutput();
    var usrDept = usrObj.getDeptOfUser();
    var dpt = aa.people.getDepartmentList(null).getOutput();
    for (var thisdpt in dpt){
        var m = dpt[thisdpt]
        var n = m.getServiceProviderCode() + "/" + m.getAgencyCode() + "/" + m.getBureauCode() + "/" + m.getDivisionCode() + "/" + m.getSectionCode() + "/" + m.getGroupCode() + "/" + m.getOfficeCode() 
      
        if (n.equals(usrDept)) usrDept = m.getDeptName();
    }
    
    usrArr["FullName"] = usrObj.getFullName();
    usrArr["PhoneNumer"] = usrObj.getPhoneNumber();
    usrArr["Email"] = usrObj.getEmail();
    usrArr["Department"] = usrDept;
}