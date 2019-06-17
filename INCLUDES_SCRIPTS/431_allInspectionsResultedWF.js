// SCRIPTNUMBER: 431
// SCRIPTFILENAME: 431_allInspectionsResultedWF.js
// PURPOSE: Prevent wfTask "License Issuance" from being statused "Issued" if:
//              inspection types on an MJ Application has not yet been resulted "Passed" or "Passed - Minor Violations".
//              there is a balance greater than 0 on any FEE ITEM in the "New" or "Invoiced" status
// DATECREATED: 05/17/2019
// BY: SWAKIL
// CHANGELOG: 05/17/2019 , SWAKIL Created this file. It calls allInspectionsResulted function, that is added to includes_custom

if (wfTask == "License Issuance" && wfStatus == "Issued"){
   var typeArray = ["MJ AMED Inspections",
                "MJ Building Inspections",
                "MJ Code Enforcement Inspections",
                "MJ Planning Inspections",
                "MJ Security Inspections - Police"
                ];

    var statusArray = ["Passed", "Passed - Minor Violations"]             
    resulted = allInspectionsResulted(typeArray, statusArray);
    logDebug(resulted)
    if(!resulted){
      cancel = true;
      showMessage = true;
      logDebug("<B>Inspections are not completed </B>");
    } 

    if (balanceDue > 0 || getAssessedFees().length > 0){
      cancel = true;
      showMessage = true;
      logDebug("<B>There is balance due.</B>");
    }


}

function getAssessedFees()
{
  var result = new Array();
  var itemCap = capId;
  if (arguments.length > 0) itemCap = arguments[1];

  var feeItemsArray = aa.finance.getFeeItemByCapID(itemCap)
  if (!feeItemsArray.getSuccess())
  {
    logDebug("Problem retrieving fee items from $record$ ".replace("$record$", capId.getCustomID()) + feeItemsArray.getErrorMessage());
    return result;
  }
  var feeItems = feeItemsArray.getOutput();
  for (var x in feeItems)
  {
    if ("NEW".equals(feeItems[x].getFeeitemStatus()))
    {
      result.push(feeItems[x]);
    }
  }
  return result;  
}