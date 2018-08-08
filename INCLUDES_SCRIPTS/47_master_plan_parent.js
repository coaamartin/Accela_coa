if (appMatch("Building/Permit/New Building/NA"))
{
    var masterPlan = AInfo["Single Family Master Plans"] || AInfo["Multi Family Master Plans"];
    //get the Building/Permit/Master/NA record with application name containing masterPlan
    var r = getCapsByAppNameLike("Building", "Permit", "Master", "NA", masterPlan);
    //relate as parent
    if (r)
    {
        addParent(r);
    }

}
else if (appMatch("Building/Permit/Plans/NA"))
{
    var masterPlan = AInfo["Other Master Plans"];
    //get the Building/Permit/Master/NA record with application name containing masterPlan
    if(masterPlan && masterPlan != "")
        var r = getCapsByAppNameLike("Building", "Permit", "Master", "NA", masterPlan);
    //relate as parent
    if (r)
    {
        addParent(r);
    }
}

//function to return the first record with appName like '%gaName%'
function getCapsByAppNameLike(gaGroup, gaType, gaSubTyp, gaCat, gaName)
{
    var capTypeModel = aa.cap.getCapTypeModel().getOutput();
    capTypeModel.setGroup(gaGroup);
    capTypeModel.setType(gaType);
    capTypeModel.setSubType(gaSubTyp);
    capTypeModel.setCategory(gaCat);
    // Getting Cap Model
    var capModel = aa.cap.getCapModel().getOutput();
    capModel.setCapType(capTypeModel);

    var getCapResult = aa.cap.getCapIDListByCapModel(capModel); 
    if (getCapResult.getSuccess())
        var apsArray = getCapResult.getOutput();
    else
        { logDebug( "**ERROR: getting caps by app type: " + getCapResult.getErrorMessage()) ; return null }
        

    for (aps in apsArray)
        {
        var thisCapId = aa.cap.getCapID(apsArray[aps].getID1(), apsArray[aps].getID2(), apsArray[aps].getID3()).getOutput();
        var myCap = aa.cap.getCap(thisCapId).getOutput();
        if (myCap && myCap.getSpecialText() && myCap.getSpecialText().indexOf(gaName) > -1)
            {
            logDebug("getAppIdByName(" + gaGroup + "," + gaType + "," + gaName + ") Returns " + thisCapId.getCustomID()); 
            return thisCapId;
            }
        }
    return false;       
}