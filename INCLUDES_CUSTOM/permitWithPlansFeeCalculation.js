
/**
 * calculate and add a Fee based on criteria 
 * @param workFlowTask add the fee when wfTask match this, optional send null to ignore (for ASA)
 * @param workflowStatusArray add the fee when wfStatus match one of this, optional send null to ignore (for ASA)
 * @returns {Boolean}
 */
function permitWithPlansFeeCalculation(workFlowTask, workflowStatusArray, permitFeeTypeAsiName, permitFeeTypeTotalAsiName, gisSvcName, gisLayerName, gisAttrName) {
    logDebug("permitWithPlansFeeCalculation started.");
	var canAddFees = false;

	if (workFlowTask && workFlowTask != null && workflowStatusArray && workflowStatusArray != null) {
		if (wfTask == workFlowTask) {

			for (s in workflowStatusArray) {
				if (wfStatus == workflowStatusArray[s]) {
					canAddFees = true;
					break;
				}
			}//for all status options
		} else {
			return false;
		}
	} else {
		//not Workflow related (most probably ASA) always true
		canAddFees = true;
	}

	if (!canAddFees) {
		return false;
	}

	//check if AInfo is loaded with useAppSpecificGroupName=true,
	//we need it useAppSpecificGroupName=false, most of time we don't have subgroup name
	var asiValues = new Array();
	if (useAppSpecificGroupName) {
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
	} else {
		asiValues = AInfo;
	}

	//determine Fee Code / Fee Sched to sue based on record type
	var feeSched = null;
	var feeCodesAry = [];
	if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("Plans")) {
		feeSched = "BLD_PWP";
		feeCodesAry["BUILDING_FEE_FLAT"] = "BLD_PWP_01";
		feeCodesAry["BUILDING_FEE_VALUATION"] = "BLD_PWP_06";
		feeCodesAry["ARAPAHOE_FEE_1"] = "BLD_PWP_03";
		feeCodesAry["ARAPAHOE_FEE_2"] = "BLD_PWP_04";
		feeCodesAry["BUILDING_USE_TAX_FEE"] = "BLD_PWP_02";
		feeCodesAry["BUILDING_DRIVEWAY_FEE"] = "BLD_PWP_11";
	} else if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("No Plans")) {
		feeSched = "BLD_PNP";
	//	feeCodesAry["BUILDING_FEE_FLAT"] = "BLD_PNP_06";
		feeCodesAry["BUILDING_FEE_VALUATION"] = "BLD_PNP_01";
		feeCodesAry["ARAPAHOE_FEE_1"] = "BLD_PNP_03";
		feeCodesAry["ARAPAHOE_FEE_2"] = "BLD_PNP_04";
		feeCodesAry["BUILDING_USE_TAX_FEE"] = "BLD_PNP_02";
		feeCodesAry["BUILDING_DRIVEWAY_FEE"] = "BLD_PNP_11";
	}

	if (feeSched == null) {
		logDebug("**WARN could not obtain Fee Schedule from App Type " + appTypeArray);
		return false;
	}

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
			updateFee(feeCodesAry["ARAPAHOE_FEE_1"], feeSched, "FINAL", feeQty, "N");
			updateFee(feeCodesAry["ARAPAHOE_FEE_2"], feeSched, "FINAL", feeQty, "N");
		}
	}//county = Arapahoe   
	
		//Driveway Fee
		var feeQty = 0;
		var driveways = asiValues["# of Driveways"];
		if (driveways && driveways != null && driveways != "") {
			feeQty = parseFloat(driveways);
		}

		if (feeQty > 0) {
			updateFee(feeCodesAry["BUILDING_DRIVEWAY_FEE"], feeSched, "FINAL", feeQty, "N");
		}

	//Building Use Tax Fee
	var feeQty = 0;
	var materialsCost = asiValues["Materials Cost"];
	var valuation = asiValues["Valuation"];

	if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
			&& parseFloat(materialsCost) == (parseFloat(valuation) / 2)) {
		feeQty = parseFloat(materialsCost);
	} else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
			&& parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
		feeQty = parseFloat(valuation);
	}

	if (feeQty > 0) {
		updateFee(feeCodesAry["BUILDING_USE_TAX_FEE"], feeSched, "FINAL", feeQty, "N");
	}
try{	
	//Building Fee (Flat Fee)
	var permitTypeTotal = asiValues[permitFeeTypeTotalAsiName];
	if (asiValues[permitFeeTypeAsiName] && asiValues[permitFeeTypeAsiName] != null && asiValues[permitFeeTypeAsiName] != "" && asiValues[permitFeeTypeAsiName] != "Other" && parseFloat(permitTypeTotal)> 0) {
		var permitTypeTotal = asiValues[permitFeeTypeTotalAsiName];
		if (permitTypeTotal && permitTypeTotal != null && permitTypeTotal != "" && parseFloat(permitTypeTotal ) > 0) {
			if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("Plans")){
			updateFee(feeCodesAry["BUILDING_FEE_FLAT"], feeSched, "FINAL", parseFloat(permitTypeTotal), "N");
			}
		} else {
			logDebug("**WARN " + permitFeeTypeAsiName + " is NOT empty and " + permitFeeTypeTotalAsiName + " is empty, no fees added");
		}
	} else if (!asiValues[permitFeeTypeAsiName] || asiValues[permitFeeTypeAsiName] == null || asiValues[permitFeeTypeAsiName] == "" || asiValues[permitFeeTypeAsiName] == "Other" || parseFloat(permitTypeTotal ) == 0) 
	{
		////Building Fee (Valuation) -- add logic for Other (dropdown)
		var valuation = asiValues["Valuation"];
		if (valuation && valuation != null && valuation != "") {
			updateFee(feeCodesAry["BUILDING_FEE_VALUATION"], feeSched, "FINAL", parseFloat(valuation), "N");
		} else {
			logDebug("**WARN " + permitFeeTypeAsiName + " is empty and Valuation is empty, no fees added");
		}
	}
	
}
catch (err) {
    handleError(err, "Error on Building Fee script");
}
	logDebug("permitWithPlansFeeCalculation ended.");
	return true;
}