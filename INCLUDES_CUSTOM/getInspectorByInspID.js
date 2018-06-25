//Get inspector by inspection ID
function getInspectorByInspID(iNumber){
        // optional capId
    // updates the inspection and assigns to a new user
    // requires the inspection id and the user name
    // V2 8/3/2011.  If user name not found, looks for the department instead
    //

    var itemCap = capId
    if (arguments.length > 2)
        itemCap = arguments[2]; // use cap ID specified in args

    var iObjResult = aa.inspection.getInspection(itemCap, iNumber);
    if (!iObjResult.getSuccess()) {
        logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
        return false;
    }
    
    iObj = iObjResult.getOutput();
    inspUserObj = aa.person.getUser(iObj.getInspector().getFirstName(),iObj.getInspector().getMiddleName(),iObj.getInspector().getLastName()).getOutput();
    return inspUserObj.getUserID();
}