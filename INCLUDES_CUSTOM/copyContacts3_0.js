/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 12/3/14 copyContacts3_0
/--------------------------------------------------------------------------------------------------------------------*/
function copyContacts3_0(srcCapId, targetCapId) {
    //1. Get people with source CAPID.
    var capPeoples = getPeople3_0(srcCapId);
    if (capPeoples == null || capPeoples.length == 0) {
        return;
    }
    //2. Get people with target CAPID.
    var targetPeople = getPeople3_0(targetCapId);
    //3. Check to see which people is matched in both source and target.
    for (loopk in capPeoples) {
        sourcePeopleModel = capPeoples[loopk];
        //3.1 Set target CAPID to source people.
        sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
        targetPeopleModel = null;
        //3.2 Check to see if sourcePeople exist.
        if (targetPeople != null && targetPeople.length > 0) {
            for (loop2 in targetPeople) {
                if (isMatchPeople3_0(sourcePeopleModel, targetPeople[loop2])) {
                    targetPeopleModel = targetPeople[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched people model.
        if (targetPeopleModel != null) {
            //3.3.1 Copy information from source to target.
            aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
            //3.3.2 Copy contact address from source to target.
            if (targetPeopleModel.getCapContactModel().getPeople() != null && sourcePeopleModel.getCapContactModel().getPeople()) {
                targetPeopleModel.getCapContactModel().getPeople().setContactAddressList(sourcePeopleModel.getCapContactModel().getPeople().getContactAddressList());
            }
            //3.3.3 Edit People with source People information.
            aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
        }
            //3.4 It is new People model.
        else {
            //3.4.1 Create new people.
            aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
        }
    }
}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 12/3/14 copyContacts3_0
/--------------------------------------------------------------------------------------------------------------------*/

