//include("2001_OTC_CTRCA_Prototype");

var asiValues = new Array();
loadAppSpecific(asiValues);

comment("CTRCA Pending Inspections - UPDATED 2/21 Keith- to Script #501C");
      if (appMatch('*/*/*/AC Only')) {
  
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         }

      if (appMatch('*/*/*/Furnace')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         if (asiValues['Electric Service Upgrade Required'] == 'CHECKED'){
              createPendingInspection("BLD_OTC", "Electrical Final");
              }
         }

      if (appMatch('*/*/*/Furnace and AC')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         }

      if (appMatch('*/*/*/Furnace AC and Water Heater')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Egress Window')) {
         createPendingInspection("BLD_OTC", "Framing Final");
         }

      if (appMatch('*/*/*/Gas Pipe')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         }

      if (appMatch('*/*/*/Commercial Roof')) {
         createPendingInspection("BLD_OTC", "Reroof Final");
         }


      if (appMatch('*/*/*/Residential Roof')) {
         createPendingInspection("BLD_OTC", "Reroof Final");
         }


      if (appMatch('*/*/*/Residential Electrical Service Upgrade')) {
         createPendingInspection("BLD_OTC", "Electrical Final");
         }

      if (appMatch('*/*/*/Siding')) {
         createPendingInspection("BLD_OTC", "Framing Final");
         }

	 if (appMatch('*/*/*/Tankless Water Heater')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }
  
     if (appMatch('*/*/*/Water Heater')) {
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Water Heater and AC')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Water Heater and Furnace')) {
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }
comment("Finished CTRCA Pending Inspections to Add");


editAppSpecific("Permit Issued Date",dateAdd(null,0));
editAppSpecific("Permit Expiration Date",dateAdd(null,180));


script16_FillApplicationNameWhenEmpty();


closeTask("Permit Issuance","Issued","Issued on Payment in ACA"); 
activateTask("Inspection Phase");
//updateAppStatus("Issued","Issued on Payment in ACA")


email("khobday@truepointsolutions.com", "noreply@auroragov.org", "CTRCA Script 501 testing", debug);
