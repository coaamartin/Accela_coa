// SCRIPTNUMBER: 8
// SCRIPTFILENAME: 8_allInspectionsResultedWF.js
// PURPOSE: Once all 5 application inspection types have been been resulted "Passed" or "Passed - Minor Violations", 
//              on a Licenses/Marijuana/*/Application, updates Workflow Task "Inspection Phase" with the Task Status "Complete"
// DATECREATED: 05/17/2019
// BY: SWAKIL
// CHANGELOG: 05/17/2019 , SWAKIL Created this file. It calls allInspectionsResulted function, that is added to includes_custom

var typeArray = ["MJ AMED Inspections",
                "MJ Building Inspections",
                "MJ Code Enforcement Inspections",
                "MJ Planning Inspections",
                "MJ Security Inspections - Police"
                ];

var statusArray = ["Passed", "Passed - Minor Violations"]             
resulted = allInspectionsResulted(typeArray, statusArray);
if(resulted){
    closeTask("Inspection Phase", "Complete", "Set via script", "Set via Script");
}