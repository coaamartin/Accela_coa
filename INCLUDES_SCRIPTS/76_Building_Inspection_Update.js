/* JMP - 10/10/2018 - Script Item #76 - 76_Building_Inspection_Update
// ​Building/Permit/New Building/NA – When Permit Issuance workflow task has a status of ‘Issued’, 
// then Inspection Types “Roofing”, “Engineering Inspection”, “Grade Inspection”, “Zoning Inspection”, “Water Service/Sanitary Service Inspection” and “Irrigation Inspection” 
// are to automatically move to ‘Pending’ status in the Inspection tab. 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #76 - 76_Building_Inspection_Update");

//var inspectionArray = ["Roofing", "Engineering Inspection", "Grade Inspection", "Zoning Inspection", "Water Service/Sanitary Service Inspection", "Irrigation Inspection"];
//var foundInspecionArray = [0, 0, 0, 0, 0];

var foundInspecion = false;

if(wfTask =="Permit Issuance" && wfStatus== "Issued") 
{
  
  var inspResultObj = aa.inspection.getInspections(capId);
  if (inspResultObj.getSuccess()) 
  {      
		var inspList = inspResultObj.getOutput();
      var showInspName = ''; 
      
      for (index in inspList)          
      {            
         showInspName = inspList[index].getInspectionType() + "";
         
         if ((showInspName == "Roofing") || (showInspName == "Engineering Inspection") || (showInspName == "Grade Inspection") || (showInspName == "Zoning Inspection") || (showInspName == "Water Service/Sanitary Service Inspection") || (showInspName == "Irrigation Inspection"))
         { 
            
          foundInspecion = true;    

           //inspList[index].setInspectionStatus("Pending");
           //aa.inspection.editInspection(inspList[index]);                  
         } 
      
      }
  }   
  
  
  if (!foundInspecion)   
  {   
     createInspection("Roofing",  aa.date.parseDate(dateAdd(null, 1, true))); 
     createInspection("Engineering Inspection",  aa.date.parseDate(dateAdd(null, 1, true))); 
     createInspection("Grade Inspection",  aa.date.parseDate(dateAdd(null, 1, true))); 
     createInspection("Zoning Inspection",  aa.date.parseDate(dateAdd(null, 1, true))); 
     createInspection("Water Service/Sanitary Service Inspection",  aa.date.parseDate(dateAdd(null, 1, true))); 
     createInspection("Irrigation Inspection",  aa.date.parseDate(dateAdd(null, 1, true)));      
      
  } 
  
  // Create inspections not existing 
  
  
  
  


}