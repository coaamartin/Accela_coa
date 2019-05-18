
/*
2001_OTC_Permits_ASA - Code from TruePoint from Keith to test new record type
Event: ASA:Building/Permit/OTC/*
Title : OTC Permit Fee Calculation and Pending Inspections (ApplicationSubmitAfter) 
Purpose : Add fees and Pending inspections for OTC permits.
Functional Area : Records
Sample Call:
Notes: ASA:Building/Permit/OTC/*
	- When try to read COUNTY from parcel it's being read from Parcel Attributes (COUNTY)
*/

var asiValues = new Array();
loadAppSpecific(asiValues);

comment("Looking for OTC Fees and Pending Inspections - UPDATED 2/4 JMPorter-CoA to Script #501");
      if (appMatch('*/*/*/AC Only')) {
         updateFee('BLD_OTC_01', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         }

      if (appMatch('*/*/*/Furnace')) {
         updateFee('BLD_OTC_02', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         if (asiValues['Electric Service Upgrade Required'] == 'CHECKED'){
              createPendingInspection("BLD_OTC", "Electrical Final");
              }
         }

      if (appMatch('*/*/*/Furnace and AC')) {
         updateFee('BLD_OTC_03', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         }

      if (appMatch('*/*/*/Furnace AC and Water Heater')) {
         updateFee('BLD_OTC_04', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Egress Window')) {
         updateFee('BLD_OTC_05', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Framing Final");
         }

      if (appMatch('*/*/*/Gas Pipe')) {
         updateFee('BLD_OTC_06', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         }

      if (appMatch('*/*/*/Commercial Roof')) {
         updateFee('BLD_OTC_07', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Reroof Final");
         }


      if (appMatch('*/*/*/Residential Roof')) {
         updateFee('BLD_OTC_08', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Reroof Final");
         }


      if (appMatch('*/*/*/Residential Electrical Service')) {
         updateFee('BLD_OTC_09', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
		 createPendingInspection("BLD_OTC", "Electrical Final"); 
         }

      if (appMatch('*/*/*/Siding')) {
         updateFee('BLD_OTC_10', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Framing Final");
         }
  
      if (appMatch('*/*/*/Tankless Water Heater')) {
         updateFee('BLD_OTC_14', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Water Heater')) {
         updateFee('BLD_OTC_11', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Water Heater and AC')) {
         updateFee('BLD_OTC_12', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }

      if (appMatch('*/*/*/Water Heater and Furnace')) {
         updateFee('BLD_OTC_13', 'BLD_OTC_FEES', 'FINAL',1, 'Y');
         createPendingInspection("BLD_OTC", "Mechanical Final");
         createPendingInspection("BLD_OTC", "Electrical Final");
         createPendingInspection("BLD_OTC", "Plumbing Final");
         }
comment("Finished Looking for OTC Fees and Pending Inspections to Add");


//County Fees
comment("Checking for County");
    //check County in address:
    var county = null;

    var addResult = aa.address.getAddressByCapId(capId);
    if (addResult.getSuccess()) {
        var addResult = addResult.getOutput();
        if (addResult != null && addResult.length > 0) {
            addResult = addResult[0];
            county = addResult.getCounty();
        }//has address(es)
    }//get address success

    //still null? try parcel:
    if (county == null || county == "") {
        var parcels = aa.parcel.getParcelByCapId(capId, null);
        if (parcels.getSuccess()) {
            parcels = parcels.getOutput();

            if (parcels != null && parcels.size() > 0) {
                var attributes = parcels.get(0).getParcelAttribute().toArray();
                for (p in attributes) {
                    if (attributes[p].getB1AttributeName().toUpperCase().indexOf("COUNTY") != -1) {
                        county = attributes[p].getB1AttributeValue();
                        break;
                    }
                }//for parcel attributes
            }//cap has parcel
        }//get parcel success
    }//county is null

    //still null? try GIS:
    if (county == null || county == "") {

        var gisSvcName = 'AURORACO';
        var gisLayerName = 'PARCELS';
        var gisAttrName = 'COUNTY';

        var PARCEL_COUNTY = getGISInfo(gisSvcName, gisLayerName, gisAttrName);
        if (PARCEL_COUNTY) {
            county = PARCEL_COUNTY;
        }
    }

    //Arapahoe county Fee  
    if (county == "ARAPAHOE") {
        var feeQty = 0;
        var materialsCost = asiValues["Materials Cost"];
        var valuation = asiValues["Valuation"];
        if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
            feeQty = parseFloat(valuation)/2;
        } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
            feeQty = parseFloat(materialsCost);
        }

        if (feeQty > 0) {
             updateFee("BLD_OTC_30", "BLD_OTC_FEES", "FINAL", feeQty, "Y");
             updateFee("BLD_OTC_31", "BLD_OTC_FEES", "FINAL", feeQty, "Y");
        }
    }//county = Arapahoe   
 comment("Finished Checking for County");  


       
//Building Use Tax Fee
comment("Building Use Tax Fee"); 
    var feeQty = 0;
    var materialsCost = asiValues["Materials Cost"];
    var valuation = asiValues["Valuation"];

    if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
            && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
        feeQty = parseFloat(valuation)/2;
    } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
            && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
        feeQty = parseFloat(materialsCost);
    }

    if (feeQty > 0) {
        updateFee("BLD_OTC_32", "BLD_OTC_FEES", "FINAL", feeQty, "Y");
    }//END Building Use Tax Fee

comment("Finished with Building Use Tax Fee");