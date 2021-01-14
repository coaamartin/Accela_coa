//ISA:LICENSES/MARIJUANA/*/LICENSE 
if (inspType.indexOf("MJ Building Inspections") != -1) {
    assignInspectionDepartment("BUILDING/NA/NA/NA/NA/BI", inspType);
}
//AU434 Assign all to Dusty
//assignInspection(inspId,"DALLEN")

/*
//allow manual assignment override
if(matches(inspInspector,null,undefined,"")){
	if(inspType.indexOf("MJ Building Inspections") >-1 ){
		//get assignment designation
		var assignTo = lookup("MARIJUANA_INSPECTION_ASSIGNMENT",inspType);
		if(assignTo){
			assignInspection(inspId,assignTo)
		}
		
	}
}
*/

