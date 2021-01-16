function assignInspectionDepartment(dept, inspType) {
    if (dept == null || dept == "")
        return;

    var inspId = getInspId(inspType);
    if(!inspId) return;

    var inspObj = aa.inspection.getInspection(capId, inspId).getOutput();

    var inspModelObj = inspObj.getInspection();
    var inspModelActivityObj = inspModelObj.getActivity();

    if (inspModelActivityObj.getSysUser() == null || inspModelActivityObj.getSysUser() == "") {
        var deptArray = dept.split("/");
        if (deptArray.length < 6)
            return;
        var newPerson = aa.person.getUser("", "", "", "", "", "", "", "", "", "", "").getOutput();
        newPerson.setServiceProviderCode("AURORACO");
        newPerson.setAgencyCode(deptArray[0]);
        newPerson.setBureauCode(deptArray[1]);
        newPerson.setDivisionCode(deptArray[2]);
        newPerson.setSectionCode(deptArray[3]);
        newPerson.setGroupCode(deptArray[4]);
        newPerson.setOfficeCode(deptArray[5]);

        inspModelActivityObj.setSysUser(newPerson);
        inspModelObj.setActivity(inspModelActivityObj);
        aa.inspection.editInspection(inspObj);
    }
}