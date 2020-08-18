//************************************************ >>  2057_LicenseFees.js  << ****************************
// SCRIPTNUMBER: 2057
// SCRIPTFILENAME: 2057_LicenseFees.js
// PURPOSE: When application or renewals are submitted, the script runs to assess the fees.
// DATECREATED: 2020-08-05
// BY: Alex Charlton TruePointSolutions


if (appMatch('Licenses/Supplemental/*/*')){
	var unit = AInfo['Unit'];
	logDebug('Unit value is '+unit);
	//Start of Class 1 Fees
	if (AInfo['Type of License'] == 'Amusement Device Distributor'){
		updateFee('CL1001', 'L_CLASS1', 'FINAL', 1, 'Y');
        updateFee('CL1021', 'L_CLASS1', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Coin Amusement Device'){
		updateFee('CL1002', 'L_CLASS1', 'FINAL', unit, 'Y');
        updateFee('CL1021', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Door Badge'){
		updateFee('CL105', 'L_CLASS1', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Door Sellers License'){
		updateFee('CL1003', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1004', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
//	if (AInfo['Type of License'] == 'Manufactured Home Park License'){
//		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
//       updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
//		}

	if (AInfo['Type of License'] == 'Stable License'){
		updateFee('CL1006', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1007', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Trash Haulers License'){
		updateFee('CL1008', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1009', 'L_CLASS1', 'FINAL', unit, 'Y');
		}
//End of Class 1 Fees
}

//Start of Class 2 Fees
	if (AInfo['Type of License'] == 'After Hours'){
		updateFee('CL2001', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2002', 'L_CLASS2', 'FINAL', 1, 'Y');

		}
		
/*	if (AInfo['Type of License'] == 'Escort Bureau'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Escort Runner'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
*/
	if (AInfo['Type of License'] == 'Massage Facility'){
		updateFee('CL2005', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2006', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
		
//	if (AInfo['Type of License'] == 'Massage Solo Practitioner'){
//		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
//       updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
//		}

	if (AInfo['Type of License'] == 'Pawnbroker'){
		updateFee('CL2008', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2009', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Second Hand Dealer'){
		updateFee('CL2012', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2013', 'L_CLASS2', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Sexually Oriented Business'){
		updateFee('CL2014', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2015', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Teen Club'){
		updateFee('CL2018', 'L_CLASS2', 'FINAL', 1, 'Y');
		updateFee('CL2019', 'L_CLASS2', 'FINAL', 1, 'Y');
		}
//End of Class 2 Fees
//Start of Temp Permit Fees
	if (AInfo['Type of License'] == 'Carnival/Circus (Amusement Enterprise)'){
		updateFee('TMP001', 'L_TEMPSUPP', 'FINAL', 1, 'Y');
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
		if(tableRowCount > '6'){
		updateFee('TMP002', 'L_TEMPSUPP', 'FINAL', 5, 'Y');
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
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL0006', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Bed and Breakfast'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL0007', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}
	
	if (AInfo['Type of License'] == 'Beer and Wine'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 450, 'Y');
		updateFee('LL0008', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Brew Pub'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0009', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Club'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL0011', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Distillery Pub'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0012', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Fermented Malt Beverage Off Premises'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 275, 'Y');
		updateFee('LL0022', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Fermented Malt Beverage On Premises'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 500, 'Y');
		updateFee('LL0021', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Hotel and Restaurant'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0013', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Hotel and Restaurant with Optional Premise'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0013', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Liquor Licensed Drugstore'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 400, 'Y');
		updateFee('LL0014', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Lodging and Entertainment'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 750, 'Y');
		updateFee('LL0015', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Racetrack Liquor'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0016', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Retail Liquor Store'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 400, 'Y');
		updateFee('LL0018', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Tavern Liquor'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0019', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Vintners Restaurant Liquor'){
		updateFee('LL0002', 'L_LIQUOR', 'FINAL', 1, 'Y');
        updateFee('LL0005', 'L_LIQUOR', 'FINAL', 650, 'Y');
		updateFee('LL0020', 'L_LIQUOR', 'FINAL', 1, 'Y');
		}
}
	//End of Liquor Renewal Fees

	// Start of Common Consumption Fees
if (appMatch('Licenses/Common Consumption/*/Renewal')){
		updateFee('LL0029', 'L_LIQUOR', 'FINAL', 1, 'Y');
}
	// End of Common Consumption Fees

// Start of Cabaret Fees
if (appMatch('Licenses/Cabaret/*/Renewal')){
		updateFee('LL0024', 'L_LIQUOR', 'FINAL', 1, 'Y');
		updateFee('LL0025', 'L_LIQUOR', 'FINAL', 1, 'Y');
}
// End of Cabaret Fees
