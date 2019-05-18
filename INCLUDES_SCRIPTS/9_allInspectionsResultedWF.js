// SCRIPTNUMBER: 9
// SCRIPTFILENAME: 9_allInspectionsResultedWF.js
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
    if(!resulted){
      cancel = true;
      showMessage = true;
      logDebug("<B>Inspections are not completed </B>");
    } 

    if (balanceDue > 0){
      cancel = true;
      showMessage = true;
      logDebug("<B>There is balance due.</B>");
    }


}
