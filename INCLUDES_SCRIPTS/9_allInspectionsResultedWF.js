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
}
