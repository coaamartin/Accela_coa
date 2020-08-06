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
		updateFee('CL1010', 'L_CLASS1', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Door Sellers License'){
		updateFee('CL1008', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1009', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
//	if (AInfo['Type of License'] == 'Manufactured Home Park License'){
//		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
//       updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
//		}

	if (AInfo['Type of License'] == 'Stable License'){
		updateFee('CL1013', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1014', 'L_CLASS1', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Trash Haulers License'){
		updateFee('CL1018', 'L_CLASS1', 'FINAL', 1, 'Y');
		updateFee('CL1019', 'L_CLASS1', 'FINAL', unit, 'Y');
		}
//End of Class 1 Fees
/*
//Start of Class 2 Fees
	if (AInfo['Type of License'] == 'After Hours'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Escort Bureau'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Escort Runner'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Massage Facility'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Massage Solo Practitioner'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Pawnbroker'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Second Hand Dealer'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Sexually Oriented Business'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Teen Club'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
//End of Class 2 Fees
//Start of Temp Permit Fees
	if (AInfo['Type of License'] == 'Carnival/Circus (Amusement Enterprise)'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}

	if (AInfo['Type of License'] == 'Christmas Tree Lot'){
		updateFee('S_1', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
		
	if (AInfo['Type of License'] == 'Fireworks Stand License'){
		updateFee('S_2', 'L_SECURITY', 'FINAL', 1, 'Y');
        updateFee('S_5', 'L_SECURITY', 'FINAL', 1, 'Y');
		}
//End of Class 2 Fees
*/
}