var inspnsComplete = inspectionsComplete();
var inspnComplete = inspectionComplete("Initial Acceptance");

if(inspnsComplete && inspnComplete){
    closeTask("Utility Inspection", "Completed", "EMSE ID 9", "EMSE ID 9");
    activateTask("Request Materials Testing", "EMSE ID 9", "EMSE ID 9");  
}

function inspectionsComplete() {
  var t = aa.inspection.getInspections(capId);
  if (t.getSuccess()) {
    var n = t.getOutput();
    if(n.length > 0){
      for (xx in n){
          inspStatus = n[xx].getInspectionStatus().toUpperCase();
          if (!( inspStatus.equals("PASSED") || inspStatus.equals("CANCELED") || inspStatus.equals("COMPLETE")) ) 
          {
              return false;
          }
      }
      return true; 
    } 
  } 
  return false;
}

function inspectionComplete(type) {
  var t = aa.inspection.getInspections(capId);
  if (t.getSuccess()) {
    var n = t.getOutput();
    if(n.length > 0){
      for (xx in n){
          inspType = n[xx].getInspectionType();
          inspStatus = n[xx].getInspectionStatus().toUpperCase();
          if ( inspType.equals(type) && inspStatus.equals("COMPLETE"))  
          {
              return true;
          }
      }
    } 
  } 
  return false;
}