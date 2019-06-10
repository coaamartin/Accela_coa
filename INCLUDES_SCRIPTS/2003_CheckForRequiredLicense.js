//Check for Required License to pull permit if not Homeowner

comment("Start 2003 - Check for Required License to pull permit if not Homeowner");
comment("Homeowner as Contractor = "+AInfo['Homeowner acting as Contractor']);

if (AInfo['Homeowner acting as Contractor'] == 'No'){    
    theLicNumber = null ; 
	capLicenseArr = lpArray = cap.getLicenseProfessionalList().toArray(); 
	//capLicenseArr = aa.licenseScript.getLicenseProf(capId).getOutput(); 
	comment('License Array = '+capLicenseArr);

	if (capLicenseArr){ 
	    theLicNumber = capLicenseArr[0].getLicenseNbr();
		comment('LicNumber = '+theLicNumber);
		contractorType == getAppSpecific('Contractor Type',theLicNumber);
	    comment('Contractor Type = '+contractorType);

		if (contractorType != null){
			
			if (appMatch('*/*/*/AC Only' && contractorType != 'Mechanical Systems')) {
                showMessage = true;
				comment('<font size=small><b>Invalid Contractor Type:</b></font><br><br>The contractor license you selected does not allow you to pull this type of permit, please contact the Building Division at 303-739-7420.<br><br>');
				cancel = true;
				}

				
			if (appMatch('*/*/*/Furnace')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Furnace and AC')) {
				comment('Contractor Type = '+contractorType);         
				}

			if (appMatch('*/*/*/Furnace AC and Water Heater')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Egress Window')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Gas Pipe')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Commercial Roof')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Residential Roof')) {
				comment('Contractor Type = '+contractorType);
				}	

			if (appMatch('*/*/*/Residential Electrical Service')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Siding')) {
				comment('Contractor Type = '+contractorType);
				}
  
			if (appMatch('*/*/*/Tankless Water Heater')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Water Heater')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Water Heater and AC')) {
				comment('Contractor Type = '+contractorType);
				}

			if (appMatch('*/*/*/Water Heater and Furnace')) {
				comment('Contractor Type = '+contractorType);
				}
		}		
	}
}
		bla
		comment("Finish 2003 - Check for Required License to pull permit if not Homeowner");