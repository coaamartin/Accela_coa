/* JMP - 10/4/2018 - Script Item #66 - 66_Building_Inspection_Failed_Passed_Final
// ​When any Inspection is resulted with ‘Failed’, ‘Passed’ or ‘Final’ the Permit  
// expiration Date needs to change to 180 days from the current date
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #66_Building_Inspection_Failed_Passed_Final");

var inspResultObj = aa.inspection.getInspections(capId);
		if (inspResultObj.getSuccess()) 
      {
			var inspList = inspResultObj.getOutput();
			for (index in inspList) 
         {
            
				//if (matches(inspList[index].getInspectionStatus().toUpperCase(), "FAILED", "PASSED", "FINAL")) {
  		   var ShowInspName = inspList[index].get    

         logDebug("Hello JP - Print Object = " + printObject(inspList[index]));
         
               //scheduleInspectDate(INSPECTION_NAME, nextInspectionDate)
               
         logDebug("JMP JMP Alert: ------------------------>> Script Item #66 = " + ShowInspName);
				

         }
      }