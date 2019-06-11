// SCRIPTNUMBER: 5103
// SCRIPTFILENAME: 5103_Building_NewBuilding_Plans_COA_Check
// PURPOSE: Make sure final WF steaps for New Building & Permit with Plans record type have correctly passed WF Status
// DATECREATED: 05/08/2019
// BY: JMPorter

logDebug('Started script 5103_Building_NewBuilding_Plans_COA_Check');
var SetCancel = false;

if ((wfStatus == "Final CO Issued") && (wfTask == "Certificate of Occupancy"))
{
   
  SetCancel = true;
  var workflowResult = aa.workflow.getTasks(capId);
  wfObj = workflowResult.getOutput();
  
  if (workflowResult.getSuccess())
  {   

    if(appMatch("Building/Permit/New Building/NA"))    
    {
      var ListDidNotMake = ""; 
      var DoesMeet = true;
      for (i in wfObj) 
      {
        fTask = wfObj[i];
        if ("Water Meter".equals(fTask.getTaskDescription()))
        {
          if (("Ready for CO" == fTask.getDisposition()) || ("Backflow Preventor" == fTask.getDisposition()))
          {
          }
          else
          {
           DoesMeet = false; 
           ListDidNotMake = ListDidNotMake + "Water Meter;";
          }
        }
        
        if ("Backflow Preventor".equals(fTask.getTaskDescription()))
        {
          if (("Not Required" == fTask.getDisposition()) || ("Ready for CO" == fTask.getDisposition()))
          {
          }
          else             
          {
           DoesMeet = false; 
           ListDidNotMake = ListDidNotMake + "Backflow Preventor;";           
          }
        }
        
         if ("Waste Water".equals(fTask.getTaskDescription()))
        {
          if ("Ready for CO" == fTask.getDisposition())
          {
          }
          else          
          {
           DoesMeet = false;    
           ListDidNotMake = ListDidNotMake + "Waste Water;";   
          }
        } 

         if ("Special Inspections Check".equals(fTask.getTaskDescription()))
        {
          if ("Ready for CO" == fTask.getDisposition())
          {
          }
          else                    
          {
           DoesMeet = false;    
           ListDidNotMake = ListDidNotMake + "Special Inspections Check;";              
          }
        } 
        
        if ("FEMA Elevation Certification".equals(fTask.getTaskDescription()))
        {
          if ("Ready for CO" == fTask.getDisposition())
          {
          }
          else                    
          {
           DoesMeet = false;    
           ListDidNotMake = ListDidNotMake + "FEMA Elevation Certification;";          
          }
        } 
        
        if ("Inspection Phase".equals(fTask.getTaskDescription()))
        {
          if ("Ready for CO" == fTask.getDisposition())
          {
          }
          else                    
          {
           DoesMeet = false;  
           ListDidNotMake = ListDidNotMake + "Inspection Phase;";       
          }
        } 
        
      }
    }
     
      SetCancel == DoesMeet;         
   }
   else if(appMatch("Building/Permit/Plans/NA"))
   {  
      SetCancel = true;
      var DoesMeet = true;
      var ListDidNotMake = "";
      
      for (i in wfObj) 
      {
        fTask = wfObj[i];
        if ("Inspection Phase".equals(fTask.getTaskDescription()))
        {
          if ("Ready for CO" !== fTask.getDisposition())
          {
           DoesMeet = false;  
           ListDidNotMake = ListDidNotMake + "Inspection Phase;";             
          }
        }
        
        if ("Backflow Preventor".equals(fTask.getTaskDescription()))
        {
          if ("Certificate of CO" !== fTask.getDisposition())
          {
           DoesMeet = false; 
           ListDidNotMake = ListDidNotMake + "Backflow Preventor;";             
          }
        }
        
         if ("Waste Water".equals(fTask.getTaskDescription()))
        {
          if ("Certificate of CO" !== fTask.getDisposition())
          {
           DoesMeet = false;   
           ListDidNotMake = ListDidNotMake + "Waste Water;";                 
          }
        } 

         if ("Special Inspections Check".equals(fTask.getTaskDescription()))
        {
          if ("Report Received" !== fTask.getDisposition())
          {
           DoesMeet = false;    
           ListDidNotMake = ListDidNotMake + "Special Inspections Check;";                 
          }
        } 
      }
     
      SetCancel == DoesMeet;      
   }
   
}

if (SetCancel)
{
   
 logDebug("Script 5103: WARNING - not all workflows have an acceptable status to allow Certificate of Occupancy");
 comment("<B><Font Color=RED>WARNING - not all workflows have an acceptable status to allow Certificate of Occupancy</Font></B>");
 comment(ListDidNotMake);
     
 cancel = true;
}

logDebug('Ended script 5103_Building_NewBuilding_Plans_COA_Check');