function getAssignInspectorID(inspectorName) {
    var arrInspectorName = inspectorName.split(' ');
    if (arrInspectorName != null && arrInspectorName.length > 0) {
        var firstName = arrInspectorName[0];
        var middleName = null;
        var lastName = arrInspectorName[1];
        var personResult = aa.person.getUser(firstName, middleName, lastName);
        if (personResult.getSuccess()) {
            var objPerson = personResult.getOutput();
            var inspectorID = objPerson.getUserID();
            var inspectorDepartment = objPerson.getDeptOfUser();
            if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "" && typeof (inspectorDepartment) != "undefined" && inspectorDepartment != null && inspectorDepartment != "")
                updateRecordDetails(inspectorID, inspectorDepartment);
        }
    }
}