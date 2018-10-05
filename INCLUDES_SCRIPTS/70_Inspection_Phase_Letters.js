/* JMP - 10/3/2018 - Script Item #70 - 70_Inspection_Phase_Letters - Inspection Phase has the status of Ready for CO
// ​If Inspection Phase has the status of ‘Ready for CO’ check that Letters have all been received; for any Checked Custom Field under Subgroup (ENGINEER LETTERS:
// ILC Letter Required, Foundation Letter Required, Footing - Pier - Cassion Letter Required, Drain Letter Required, Waterproofing Letter Required) 
// then see if the matching received field is also checked under Subgroup (ENGINEER LETTERS: ILC Letter Received, Foundation Letter Received, Footing - Pier - Cassion Letter Received, 
// Drain Letter Received, Waterproofing Letter Received) if all matching fields are checked then allow the workflow to progress 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #70 - 70_Inspection_Phase_Letters");

if(wfTask =="Inspection Phase" && wfStatus== "Ready for CO") 
{
   
    var OhNoBadMatch = false;
   
    var Let1 = getAppSpecific("Waterproofing Letter Required") + "";
    var Let2 = getAppSpecific("ILC Letter Required") + "";
    var Let3 = getAppSpecific("Foundation Letter Required") + "";
    var Let4 = getAppSpecific("Footing - Pier - Cassion Letter Required") + "";
    var Let5 = getAppSpecific("Drain Letter Required") + "";
    
    var Let1a = getAppSpecific("Waterproofing Letter Received") + "";
    var Let2a = getAppSpecific("ILC Letter Received") + "";
    var Let3a = getAppSpecific("Foundation Letter Received") + "";
    var Let4a = getAppSpecific("Footing - Pier - Cassion Letter Received") + "";
    var Let5a = getAppSpecific("Drain Letter Received") + "";
    
    if Let1 !== Let1a 
    {
      OhNoBadMatch = true;
    }  
    
    if Let2 !== Let2a 
    {
      OhNoBadMatch = true;
    }   
    
    if Let3 !== Let3a 
    {
      OhNoBadMatch = true;
    }  

    if Let4 !== Let4a 
    {
      OhNoBadMatch = true;
    }   
    
    if Let5 !== Let5a 
    {
      OhNoBadMatch = true;
    }       


}