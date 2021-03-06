//************************************************ >>  2057_LicenseFees.js  << ****************************
// SCRIPTNUMBER: 2057
// SCRIPTFILENAME: 2057_LicenseFees.js
// PURPOSE: When application or renewals are submitted, the script runs to assess the fees.
// DATECREATED: 2020-08-05
// BY: Alex Charlton TruePointSolutions


if (appMatch('Licenses/Supplemental/*/*')){
	var unit = AInfo['Number of Units'];
	logDebug('Unit value is '+unit);
	//Start of Class 1 Fees
	if (appMatch('Licenses/Supplemental/Amusement Device Distributor/Application')){
		updateFee('CL1001', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1012', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
	if (appMatch('Licenses/Supplemental/Amusement Device Distributor/Renewal')){
		updateFee('CL1001', 'L_CLASS1', 'FINAL', 1, 'Y');
		//updateFee('CL1012', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
	if (appMatch('Licenses/Supplemental/Amusement Device/Application')){
		updateFee('CL1002', 'L_CLASS1', 'FINAL', unit, 'Y');
        updateFee('CL1001', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
	if (appMatch('Licenses/Supplemental/Amusement Device/Renewal')){
		updateFee('CL1002', 'L_CLASS1', 'FINAL', unit, 'Y');
        //updateFee('CL1001', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
	
	//Commenting out per Lisa Keith and Cherwell ticket #355622
	// if (appMatch('Licenses/Supplemental/Door ID Badge/*')){
	// 	updateFee('CL1005', 'L_CLASS1', 'FINAL', 1, 'Y');
	// 	}

	if (appMatch('Licenses/Supplemental/Door Seller/Application')){
		updateFee('CL1003', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1004', 'L_CLASS1', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Door Seller/Renewal')){
		//updateFee('CL1003', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1004', 'L_CLASS1', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Stable/Application')){
		updateFee('CL1006', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1007', 'L_CLASS1', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Stable/Renewal')){
		//updateFee('CL1006', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1007', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
	if (appMatch('Licenses/Supplemental/Trash Hauler/Application')){
		updateFee('CL1008', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1009', 'L_CLASS1', 'FINAL', unit, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Trash Hauler/Renewal')){
		//updateFee('CL1008', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1009', 'L_CLASS1', 'FINAL', unit, 'Y');
		}
//End of Class 1 Fees
}

//Start of Class 2 Fees
	if (appMatch('Licenses/Supplemental/After Hours/Application')){
		updateFee('CL2001', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2002', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
		
	if (appMatch('Licenses/Supplemental/After Hours/Renewal')){
		//updateFee('CL2001', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2002', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Massage Facility/Renewal')){
		//updateFee('CL2005', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2006', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Massage Facility/Application')){
		updateFee('CL2005', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2006', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Pawnbroker/Application')){
		updateFee('CL2008', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2009', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Pawnbroker/Renewal')){
		//updateFee('CL2008', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2009', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
		
	if (appMatch('Licenses/Supplemental/Second Hand Dealer/Application')){
		updateFee('CL2012', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2013', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Second Hand Dealer/Renewal')){
		//updateFee('CL2012', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2013', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Sexually Oriented Business/Application')){
		updateFee('CL2014', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2015', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Sexually Oriented Business/Renewal')){
		//updateFee('CL2014', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2015', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
		
	if (appMatch('Licenses/Supplemental/Teen Club/Application')){
		updateFee('CL2018', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2019', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (appMatch('Licenses/Supplemental/Teen Club/Renewal')){
		//updateFee('CL2018', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2019', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
//End of Class 2 Fees
//Start of Temp Permit Fees
	if (AInfo['Type of License'] == 'Carnival/Circus (Amusement Enterprise)'){
		updateFee('TMP001', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		updateFee('TMP008', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		var tableRowCount = countTableRows(EVENTDATES);
		logDebug("Table Count = "+tableRowCount);
		if(tableRowCount == '2'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		}
		if(tableRowCount == '3'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 2, 'Y');
		}
		if(tableRowCount == '4'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 3, 'Y');
		}
		if(tableRowCount == '5'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 4, 'Y');
		}
		if(tableRowCount == '6'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 5, 'Y');
		}
		if(tableRowCount == '7'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 6, 'Y');
		}
		if(tableRowCount == '8'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 7, 'Y');
		}
		if(tableRowCount == '9'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 8, 'Y');
		}
		if(tableRowCount == '10'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 9, 'Y');
		}
		if(tableRowCount == '11'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 10, 'Y');
		}
		if(tableRowCount == '12'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 11, 'Y');
		}
		if(tableRowCount == '13'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 12, 'Y');
		}
		if(tableRowCount == '14'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 13, 'Y');
		}
		if(tableRowCount == '15'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 14, 'Y');
		}
		if(tableRowCount == '16'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 15, 'Y');
		}
		if(tableRowCount > '17'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 16, 'Y');
		}
	}

	if (AInfo['Type of License'] == 'Christmas Tree Lot'){
		updateFee('TMP003', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		updateFee('TMP004', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		updateFee('TMP005', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Fireworks Stand License'){
		updateFee('TMP006', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		updateFee('TMP007', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
		}
//End of Class 2 Fees

//Start of Liquor Renewal Fees

if (appMatch('Licenses/Liquor/*/Renewal')){
	var unit = AInfo['Unit'];
	logDebug('Unit value is '+unit);
	if (AInfo['Type of License'] == 'Arts'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL006', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Bed and Breakfast'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL007', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}
	
	if (AInfo['Type of License'] == 'Beer and Wine'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 450, 'Y');
		updateFee('LL008', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Brew Pub'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL009', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Club'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL011', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Distillery Pub'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL012', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Fermented Malt Beverage Off Premises'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL022', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Fermented Malt Beverage On Premises'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 500, 'Y');
		updateFee('LL021', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Hotel and Restaurant'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL013', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Hotel and Restaurant with Optional Premise'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL013', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Liquor Licensed Drugstore'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 400, 'Y');
		updateFee('LL014', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Lodging and Entertainment'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL015', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Racetrack Liquor'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL016', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Retail Liquor Store'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 400, 'Y');
		updateFee('LL018', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Tavern Liquor'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL019', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Vintners Restaurant Liquor'){
		updateFee('LL002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL020', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}
}
	//End of Liquor Renewal Fees

	// Start of Common Consumption Fees
if (appMatch('Licenses/Common Consumption/*/Renewal')){
		updateFee('LL029', 'L_LIQUOR', 'FINAL', 1, 'Y');
}
	// End of Common Consumption Fees

// Start of Cabaret Fees
if (appMatch('Licenses/Cabaret/*/Renewal')){
		updateFee('LL024', 'L_LIQUOR', 'FINAL', 1, 'Y');
		updateFee('LL025', 'L_LIQUOR', 'FINAL', 1, 'Y');
}
// End of Cabaret Fees
