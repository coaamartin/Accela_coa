//Check for Required License to pull permit if not Homeowner

comment("Start 2003 - Check for Required License to pull permit if not Homeowner");
comment('Homeowner as Contractor = '+getAppSpecific('Homeowner acting as Contractor',capId));

if (getAppSpecific('Homeowner acting as Contractor',capId) == 'Yes'{    
    theLicNumber = null ; 
	capLicenseArr = aa.licenseScript.getLicenseProf(capId).getOutput();

	if (capLicenseArr && capLicenseArr.length > 0){ 
	    theLicNumber = capLicenseArr[0].getLicenseNbr();
		comment('LicNumber = '+theLicNumber);
		contractorType == getAppSpecific('Contractor Type',theLicNumber)
	    comment('Contractor Type = '+contractor Type);

		if (contractorType != null){
			
			if (appMatch('*/*/*/AC Only' && contractorType != 'Mechanical Systems')) {
                showMessage = true;
				comment('<font size=small><b>Invalid Contractor Type:</b></font><br><br>The contractor license you selected does not allow you to pull this type of permit, please contact the Building Division at 303-739-7420.<br><br>');
				cancel = true;
				}

				
			if (appMatch('*/*/*/Furnace')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Furnace and AC')) {
				comment('Contractor Type = '+contractor Type);         
				}

			if (appMatch('*/*/*/Furnace AC and Water Heater')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Egress Window')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Gas Pipe')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Commercial Roof')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Residential Roof')) {
				comment('Contractor Type = '+contractor Type);
				}	

			if (appMatch('*/*/*/Residential Electrical Service')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Siding')) {
				comment('Contractor Type = '+contractor Type);
				}
  
			if (appMatch('*/*/*/Tankless Water Heater')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Water Heater')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Water Heater and AC')) {
				comment('Contractor Type = '+contractor Type);
				}

			if (appMatch('*/*/*/Water Heater and Furnace')) {
				comment('Contractor Type = '+contractor Type);
				}
		}		
	}
}
		comment("Finish 2003 - Check for Required License to pull permit if not Homeowner");