/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 12/3/14 isMatchPeople3_0
/--------------------------------------------------------------------------------------------------------------------*/
function isMatchPeople3_0(capContactScriptModel, capContactScriptModel2) {
    if (capContactScriptModel == null || capContactScriptModel2 == null) {
        return false;
    }

    var contactType1 = capContactScriptModel.getCapContactModel().getPeople().getContactType();
    var contactType2 = capContactScriptModel2.getCapContactModel().getPeople().getContactType();
    var firstName1 = capContactScriptModel.getCapContactModel().getPeople().getFirstName();
    var firstName2 = capContactScriptModel2.getCapContactModel().getPeople().getFirstName();
    var lastName1 = capContactScriptModel.getCapContactModel().getPeople().getLastName();
    var lastName2 = capContactScriptModel2.getCapContactModel().getPeople().getLastName();
    var fullName1 = capContactScriptModel.getCapContactModel().getPeople().getFullName();
    var fullName2 = capContactScriptModel2.getCapContactModel().getPeople().getFullName();

    if ((contactType1 == null && contactType2 != null) || (contactType1 != null && contactType2 == null)) {
        return false;
    }

    if (contactType1 != null && !contactType1.equals(contactType2)) {
        return false;
    }

    if ((firstName1 == null && firstName2 != null) || (firstName1 != null && firstName2 == null)) {
        return false;
    }

    if (firstName1 != null && !firstName1.equals(firstName2)) {
        return false;
    }

    if ((lastName1 == null && lastName2 != null) || (lastName1 != null && lastName2 == null)) {
        return false;
    }

    if (lastName1 != null && !lastName1.equals(lastName2)) {
        return false;
    }

    if ((fullName1 == null && fullName2 != null) || (fullName1 != null && fullName2 == null)) {
        return false;
    }

    if (fullName1 != null && !fullName1.equals(fullName2)) {
        return false;
    }

    return true;
}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 12/3/14 isMatchPeople3_0
/--------------------------------------------------------------------------------------------------------------------*/