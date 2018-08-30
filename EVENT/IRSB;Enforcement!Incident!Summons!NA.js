// script 424
if ("Summons Issuance".equals(inspType)) {
	if (matches(inspResult,"Visit/Attempted Contact","Letter to be Sent","Personal Service","Compliance","Cancelled")) {
		if (inspId && "Scheduled".equals(String(aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus()))) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Initial status must be 'Taken and Stored - Summons' or 'Taken and Stored - Citation");
		}
	}
}

if("Pre Court Action".equals(inspType)){
	var currInspStatus = aa.inspection.getInspection(capId,inspId).getOutput().getInspectionStatus();
	if (matches(inspResult,"5 - Summons File to CA")){
		if (inspId && currInspStatus != "4 - Summons to Docketing" ) {
			cancel = true;
			showMessage = true;
			comment("Inspection can't be resulted with this status.   Previous status must be '4 - Summons to Docketing'");
		}
	}
	else{
	    if (matches(inspResult,"4 - Summons to Docketing")){
	    	if (inspId && currInspStatus != "3 - File to Court Liaison" ) {
	    		cancel = true;
	    		showMessage = true;
	    		comment("Inspection can't be resulted with this status.   Previous status must be '3 - File to Court Liaison'");
	    	}
	    }
	    else{
	        if (matches(inspResult,"3 - File to Court Liaison")){
	        	if (inspId && currInspStatus != "2 - Summons to Court Liaiso" ) {
	        		cancel = true;
	        		showMessage = true;
	        		comment("Inspection can't be resulted with this status.   Previous status must be '2 - Summons to Court Liaiso'");
	        	}
	        }
			else{
	            if (matches(inspResult,"2 - Summons to Court Liaison")){
	            	if (inspId && currInspStatus != "1 - Create Summons File" ) {
	            		cancel = true;
	            		showMessage = true;
	            		comment("Inspection can't be resulted with this status.   Previous status must be '1 - Create Summons File'");
	            	}
	            }
				else{
					if (matches(inspResult,"1 - Create Summons File")){
	                	if (inspId && currInspStatus != "Scheduled" ) {
	                		cancel = true;
	                		showMessage = true;
	                		comment("Inspection can't be resulted with this status.   Initial status has to be 1 - Create Summons File");
	                	}
	                }
				}
			}
		}
	}
	
	if(inspResult == "7 - Citation File to CA"){
	    if (inspId && currInspStatus != "6 - Citation File to Liaison" ) {
	    		cancel = true;
	    		showMessage = true;
	    		comment("Inspection can't be resulted with this status.   Initial status has to be 6 - Citation File to Liaison");
	    	}
	    }
	}
}
// end script 424
