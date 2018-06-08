function checkIfPassedInspections(InspectionType){
	try{
		if (String(InspectionType).indexOf("Final")>0){
			var result=checkInspectionType(InspectionType);
			if (result==null) {
				throw "There must be an initial inspection of status passed for the inspection type " + InspectionType ;
			}else if (result!=""){
				throw result + " is not passed" ;
			}		
		}
		
	}catch(e){
		cancel = true;
		showDebug = false;
		showMessage = true;
		comment(e);
	}
}
