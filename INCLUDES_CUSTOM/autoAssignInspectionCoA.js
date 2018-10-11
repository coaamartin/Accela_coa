function autoAssignInspectionCoA(iNumber){
	// updates the inspection and assigns to a new user
	// requires the inspection id
	//

	iObjResult = aa.inspection.getInspection(capId,iNumber);
	if (!iObjResult.getSuccess()) {
		logDebug("**ERROR retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage()) ;
		return false ;
	}
	
	iObj = iObjResult.getOutput();

	inspTypeResult = aa.inspection.getInspectionType(iObj.getInspection().getInspectionGroup(), iObj.getInspectionType())

	if (!inspTypeResult.getSuccess()){
		logDebug("**ERROR retrieving inspection Type " + inspTypeResult.getErrorMessage()) ;
		return false ;
	}
	
	inspTypeArr = inspTypeResult.getOutput();

    if (inspTypeArr == null || inspTypeArr.length == 0) {
		logDebug("ERROR no inspection type found using inspection group. Trying with no inspection group") ;
		inspTypeResult = aa.inspection.getInspectionType("", iObj.getInspectionType())

	    if (!inspTypeResult.getSuccess()){
	    	logDebug("**ERROR retrieving inspection Type " + inspTypeResult.getErrorMessage()) ;
	    	return false ;
	    }
		
		inspTypeArr = inspTypeResult.getOutput();
	}

	if (inspTypeArr == null || inspTypeArr.length == 0)
		{ logDebug("**ERROR no inspection type found") ; return false ; }
	
	thisInspType = inspTypeArr[0]; // assume first

	inspSeq = thisInspType.getSequenceNumber();

	inspSchedDate = iObj.getScheduledDate().getYear() + "-" + iObj.getScheduledDate().getMonth() + "-" + iObj.getScheduledDate().getDayOfMonth()

 	logDebug(inspSchedDate)

	iout =  aa.inspection.autoAssignInspector(capId.getID1(),capId.getID2(),capId.getID3(), inspSeq, inspSchedDate)

	if (!iout.getSuccess()){
		logDebug("**ERROR retrieving auto assign inspector " + iout.getErrorMessage()) ;
		return false ;
	}

	inspectorArr = iout.getOutput();

	if (inspectorArr == null || inspectorArr.length == 0){
		logDebug("**WARNING no auto-assign inspector found") ;
		return false ;
	}
	
	inspectorObj = inspectorArr[0];  // assume first
	
	iObj.setInspector(inspectorObj);

	assignResult = aa.inspection.editInspection(iObj)

	if (!assignResult.getSuccess()){
		logDebug("**ERROR re-assigning inspection " + assignResult.getErrorMessage()) ;
		return false ;
	}
	else
		logDebug("Successfully reassigned inspection " + iObj.getInspectionType() + " to user " + inspectorObj.getUserID());
}