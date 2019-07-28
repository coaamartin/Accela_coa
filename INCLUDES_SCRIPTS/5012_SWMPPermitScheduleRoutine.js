//created by swakil

eval(getScriptText("STDBASE_INSPECTION_AUTOMATION"));
var inspResultComment = "";
if ("ECKO and Initial Inspection".equals(inspType) && "Passed".equals(inspResult))
{
    //Schedule a Routine Inspection in child SWMP Permit record (SWMP Permit Inspection group) for 30 business days 
    //to the same Inspector who did this status
    var cRecords = getChildren("Water/Water/SWMP/Permit", capId);
    //assuming only 1 permit child record
    if (cRecords && cRecords.length > 0)
    {
        var wPermit = cRecords[0];
        //save capId
        var tempCapId = capId;
        capId = wPermit;
        schedInspection("Routine Inspections", true, "Days", 30, "");
        //restore capId
        capId = tempCapId;
        //update wfTask and set app status to closed
		updateTask("Permit Issued","Complete","Updated by script COA #12","Updated by script COA #12");
        updateAppStatus("Closed", "Closed Via Script");
    }
    else
    {
        logDebug("Problem locating child permit for record " + capId.getCustomID());
    }
    

}
else if ("ECKO and Initial Inspection".equals(inspType) && "Failed".equals(inspResult))
{
    //Auto send email with inspection comments included to applicant (need email template) 
    //(Need to know if schedule another inspection or will Applicant schedule in ACA from COA Water staff)  
    var contact = "Applicant";
    var template = "SWMP ECKO INITIAL INSPECTION FAIL # 363";
    var emailparams = aa.util.newHashtable();
    emailparams.put("$$inspComments$$", inspResultComment);
    emailContacts(contact, template, emailparams, "", "", "N", "");

    //SWAKIL 06/18/2019
    //create new pending inspection and copy failed guidesheet items
    var failedStatusArray = ["Violation", "Needs", "Yes/Violation"];
    var newInspId = createPendingInspectionReturnId("WAT_SW_APP", "ECKO and Initial Inspection");
    copyGuideSheetItemsByGuideSheetStatus(inspId, newInspId, failedStatusArray);

    //SWAKIL Water Eorsion Script ID 9
    //add fee everytime after 3rd fail

    var typeArray = ["ECKO and Initial Inspection"];
    var statusArray = ["Failed"];
    inspCount = inspectionStatusCheck(typeArray, statusArray);

    if(inspCount >=3){
        addFee("WAT_SWMP_28","WAT_SWMP_APP","FINAL", 1, "Y");
        updateAppStatus("Payment Pending", "Updated via script");
    }
}
function inspectionStatusCheck(typeArray, statusArray) {
    var count = 0;
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();
        var processedInspTypes = [];

        for (xx in inspList) {
            if(exists(inspList[xx].getInspectionType(), typeArray) && exists(inspList[xx].getInspectionStatus(), statusArray)){
                processedInspTypes.push(inspList[xx].getInspectionType());      
            }
        }
        count = processedInspTypes.length;
    }
    return count;
}
function copyGuideSheetItemsByGuideSheetStatus(fromInspId, toInspId, statusArray)
{
    try 
        {
            //use capId by default
            var itemCap = capId;
            //previous inspection and current inspection
            var pInsp, cInsp;

            //optional capId
            if (arguments.length > 3) itemCap = arguments[3];

            //Get inspections
            var insps = aa.inspection.getInspections(itemCap).getOutput();
            if (!insps || insps.length == 0) return false;

            for (var i in insps)
            {
                if (insps[i].getIdNumber() == fromInspId)
                {
                    pInsp = insps[i].getInspection();
                }
                else if (insps[i].getIdNumber() == toInspId)
                {
                    cInsp = insps[i].getInspection();
                }
            }

            //If cannot find inspections then return false
            if (!pInsp || !cInsp) return false;

            //Clear the guidesheet items on current inspection before copying
            var gGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
            if (!gGuideSheetBusiness) {
                throw "Could not invoke GGuideSheetBusiness";
            }
            gGuideSheetBusiness.removeGGuideSheetByCap(itemCap, toInspId, aa.getAuditID());

            //if previous inspection has no guidesheet then theres nothing to copy
            if (!pInsp.getGuideSheets() || pInsp.getGuideSheets().size() == 0) return false;

            // Copy prev guidesheets
            var gsArr = pInsp.getGuideSheets().toArray();
            var guideSheetList = aa.util.newArrayList();            
            for (gsIdx in gsArr) {
                var gGuideSheetModel = gsArr[gsIdx];
                var guideSheetItemList = aa.util.newArrayList();
                var gGuideSheetItemModels = gGuideSheetModel.getItems();
                if (gGuideSheetItemModels) {
                    for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
                        var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
                        if (exists(gGuideSheetItemModel.getGuideItemStatus(), statusArray))
                            guideSheetItemList.add(gGuideSheetItemModel);
                    }
                }

                if (guideSheetItemList.size() > 0) {
                    var gGuideSheet = gGuideSheetModel.clone();
                    gGuideSheet.setItems(guideSheetItemList);
                    guideSheetList.add(gGuideSheet);
                }
            }
            if (guideSheetList.size() > 0) {
                
                var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, itemCap, parseInt(toInspId), aa.getAuditID());
                if (copyResult.getSuccess()) {
                    logDebug("Successfully copy guideSheet items");
                    return true;
                } else {
                    logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
                    return false;
                }
            }           
        }
    catch (e) 
        {
            showDebug = true;
            showMessage = true;
            logDebug(e);
        }
}

function createPendingInspectionReturnId(iGroup,iType) // optional Cap ID
    {
    var itemCap = capId;
    if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

    var itmResult = aa.inspection.getInspectionType(iGroup,iType)
    
    if (!itmResult.getSuccess())
        {
        logDebug("**WARNING error retrieving inspection types: " + itmResult.getErrorMessage);
        return false;
        }

    var itmArray = itmResult.getOutput();
    
    if (!itmArray)
        {
        logDebug("**WARNING could not find any matches for inspection group " + iGroup + " and type " + iType);
        return false;
        }

    var itmSeq = null;
    
    for (thisItm in itmArray)
        {
        var it = itmArray[thisItm];
        if (it.getGroupCode().toUpperCase().equals(iGroup.toUpperCase()) && it.getType().toUpperCase().equals(iType.toUpperCase()))
            itmSeq = it.getSequenceNumber();
        }

    if (!itmSeq)
        {
        logDebug("**WARNING could not find an exact match for inspection group " + iGroup + " and type " + iType);
        return false;
        }
        
    var inspModel = aa.inspection.getInspectionScriptModel().getOutput().getInspection();
    
    var activityModel = inspModel.getActivity();
    activityModel.setInspSequenceNumber(itmSeq);
    activityModel.setCapIDModel(itemCap);

    pendingResult = aa.inspection.pendingInspection(inspModel)

    if (pendingResult.getSuccess())
        {
        logDebug("Successfully created pending inspection group " + iGroup + " and type " + iType);
        return pendingResult.getOutput();
        }
    else
        {
        logDebug("**WARNING could not create pending inspection group " + iGroup + " and type " + iType + " Message: " + pendingResult.getErrorMessage());
        return false;
        }
    
}
    
    

