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