/*
Script 			81
Record Types:   ​Water/Water/Wet Tap/Application
Event: 			ASA

Desc:          	for each row in Custom List "SIZE" set Complete to unchecked then Add  
				the Fees based on the tap size selections in the custom list “SIZE” as 
				follows(NOTE – Use the custom list column number of Taps as the 
				quantity input for that particular fee). Each row in the Custom List 
				should be a single Fee so that they could be paid separately

Created By: Silver Lining Solutions
*/
logDebug("Script 81 START");

tempASIT = loadASITable("SIZE");
if (tempASIT == undefined || tempASIT == null) 
{}
for (var ea in tempASIT) 
	{
	var row = tempASIT[ea];
	size 		= "" + row["Size"].fieldValue;
	quantity 	= "" + row["Number of Taps"].fieldValue;
	logDebug("Size = " + size + " | quantity = " + quantity);
		
	if ( size == 'Tap Size 4" Main Line 6 to 12"')
		{updateFee("WETTAP_01","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 4" Main Line 16 to 24"')
		{updateFee("WETTAP_02","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 4" Main Line 30 to 36"')
		{updateFee("WETTAP_03","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 6" Main Line 6 to 12"')
		{updateFee("WETTAP_04","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 6" Main Line 16 to 24"')
		{updateFee("WETTAP_05","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 6" Main Line 30 to 36"')
		{updateFee("WETTAP_06","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 8" Main Line 6 to 12"')
		{updateFee("WETTAP_07","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 8" Main Line 16 to 24"')
		{updateFee("WETTAP_08","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 8" Main Line 30 to 36"')
		{updateFee("WETTAP_09","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 12" Main Line 12"')
		{updateFee("WETTAP_10","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 12" Main Line 16"')
		{updateFee("WETTAP_11","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 12" Main Line 24 to 36"')
		{updateFee("WETTAP_12","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 16" Main Line 16"')
		{updateFee("WETTAP_13","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 16" Main Line 24"')
		{updateFee("WETTAP_14","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 16" Main Line 30"')
		{updateFee("WETTAP_15","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 16" Main Line 36"')
		{updateFee("WETTAP_16","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 24" Main Line 16 Weld-on')
		{updateFee("WETTAP_19","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 30" Main Line 16 Weld-on')
		{updateFee("WETTAP_20","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 36" Main Line 16 Weld-on')
		{updateFee("WETTAP_21","WAT_WETTAP","FINAL",quantity,"Y");}
	}
logDebug("Script 81 END");

//Part of Script 401 - Re Link to Parent after record is converted from a TMP to a real record
var vParentId;
vParentId = "" + aa.env.getValue("ParentCapID");
if (vParentId == false || vParentId == null || vParentId == "") {
    var permitNumber = getAppSpecific("Utility Permit Number");
    if (permitNumber != null) {
    	var parentCapId = aa.cap.getCapID(permitNumber).getOutput();
    	addParent(parentCapId);
    }
}