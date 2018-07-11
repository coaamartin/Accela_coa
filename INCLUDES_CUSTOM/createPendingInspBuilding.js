
function createPendingInspBuilding() {
	var asiValues = new Array();
	   if (useAppSpecificGroupName) {
		   var olduseAppSpecificGroupName = useAppSpecificGroupName;
		   useAppSpecificGroupName = false;
		   loadAppSpecific(asiValues);
		   useAppSpecificGroupName = olduseAppSpecificGroupName;
	   } else {
		   asiValues = AInfo;
	   }
	   
	  
   var permitType = asiValues["Permit Fee Type"];
    
   logDebug ("Permit Type" + permitType );
   
   if (permitType == "Gas Pipe Installation or Modification" || permitType == "Furnace Replacement" || permitType == "Furnace and Water Heater Replacement"
      || permitType == "Air Conditioner Replacement" || permitType == "Evaporative Cooler Replacement" || permitType == "Boiler Replacement" 
      || permitType == "Furnace and Air Conditioner" || permitType == "Rooftop Unit Replacement"
      || permitType == "Air Conditioner Furnace and Water Heater Replacement" || permitType == "Air Conditioner and Water Heater Replacement"
     )
   {
   createPendingInspection("BLD_NEW_CON", "Mechanical Final")
   }
   
   if (permitType == "Air Conditioner Replacement" || permitType == "Evaporative Cooler Replacement" || permitType == "Boiler Replacement" 
      || permitType == "Furnace and Air Conditioner" || permitType == "Rooftop Unit Replacement"
      || permitType == "Air Conditioner Furnace and Water Heater Replacement" || permitType == "Air Conditioner and Water Heater Replacement"
     )
   {
   createPendingInspection("BLD_NEW_CON", "ELectrical Final")
    } 
       
   if (permitType == "Water Heater Replacement" || permitType == "Boiler Replacement" || permitType == "Furnace and Water Heater Replacement"  
      || permitType == "Air Conditioner Furnace and Water Heater Replacement" || permitType == "Air Conditioner and Water Heater Replacement"
     )
   {
   createPendingInspection("BLD_NEW_CON", "Plumbing Final")
   } 
      
   if (permitType == "Siding Replacement")
   {
   createPendingInspection("BLD_NEW_CON", "Framing Final")
   } 
  
   if (permitType == "Commercial Roof Replacement" || permitType == "Single-Family Residential Roof Replacement")
   {
   createPendingInspection("BLD_NEW_CON", "Reroof Final")
   } 
  
   }
   
