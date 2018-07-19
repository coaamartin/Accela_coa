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

quantity = 2;
size = 'Tap Size 4" Main Line 6 to 12';

if ( size = 'Tap Size 4" Main Line 6 to 12')
	{updateFee("WETTAP_01","WAT_WETTAP","FINAL",quantity,"Y");}
if ( size = 'Tap Size 4" Main Line 16 to 24')
	{updateFee("WETTAP_02","WAT_WETTAP","FINAL",quantity,"Y");}
if ( size = 'Tap Size 4" Main Line 30 to 36')
	{updateFee("WETTAP_03","WAT_WETTAP","FINAL",quantity,"Y");}

if ( size = 'Tap Size 6" Main Line 6 to 12')
{}
if ( size = 'Tap Size 6" Main Line 16 to 24')
{}
if ( size = 'Tap Size 6" Main Line 30 to 36')
{}

if ( size = 'Tap Size 8" Main Line 6 to 12')
{}
if ( size = 'Tap Size 8" Main Line 16 to 24')
{}
if ( size = 'Tap Size 8" Main Line 30 to 36')
{}

if ( size = 'Tap Size 12" Main Line 12')
{}
if ( size = 'Tap Size 12" Main Line 16')
{}
if ( size = 'Tap Size 12" Main Line 24 to 36')
{}

if ( size = 'Tap Size 16" Main Line 16')
{}
if ( size = 'Tap Size 16" Main Line 24')
{}
if ( size = 'Tap Size 16" Main Line 30')
{}
if ( size = 'Tap Size 16" Main Line 36')
{}

if ( size = 'Tap Size 24" Main Line 16 Weld-on')
{}
if ( size = 'Tap Size 24" Main Line 16 Weld-on')
{}
if ( size = 'Tap Size 24" Main Line 16 Weld-on')
{}

logDebug("Script 81 END");