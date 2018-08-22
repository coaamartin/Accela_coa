/* 26 DUPLICATE RECORDS */
var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}
function addDate(iDate, nDays){ 
	if(isNaN(nDays)){
		throw("Day is a invalid number!");
	}
	return expression.addDate(iDate,parseInt(nDays));
}

function diffDate(iDate1,iDate2){
	return expression.diffDate(iDate1,iDate2);
}

function parseDate(dateString){
	return expression.parseDate(dateString);
}

function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}


try{
	function getRelatedCapsByAddressBefore(ats) 
	{
	    
 	    // get caps with same address
 	    capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
	    if (capAddResult.getSuccess())
	    	{ var capIdArray=capAddResult.getOutput(); }
	    else
	    	{ logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());  return false; }
        
        
	    // loop through related caps
	    for (cappy in capIdArray)
	    	{
	    	// get file date
	    	relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
        
	    	// get cap type
        
	    	reltype = relcap.getCapType().toString();
        
	    	var isMatch = true;
	    	var ata = ats.split("/");
	    	if (ata.length != 4)
	    		logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
	    	else
	    		for (xx in ata)
	    			if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
	    				isMatch = false;
        
	    	if (isMatch)			
	    		retArr.push(capIdArray[cappy]);
        
	    	} // loop through related caps
        
	    if (retArr.length > 0)
	    	return retArr;
		
	}
	
    var aa = expression.getScriptRoot();
    var id1=expression.getValue("$$capID1$$").value;
    var id2=expression.getValue("$$capID2$$").value;
    var id3=expression.getValue("$$capID3$$").value;
    var altId = expression.getValue("CAP::capModel*altID").value;
    var capId = aa.cap.getCapID(altId).getOutput();
	var currentUserID = expression.getValue("$$userID$$").value;
	

    var servProvCode=expression.getValue("$$servProvCode$$").value;
	var dtlForm = expression.getValue("CAP::FORM");
    var appTypeString=expression.getValue("CAP::capType").value;
    var dtlDesc=expression.getValue("CAP::capWorkDescriptionModel*description");


    var totalRowCount = expression.getTotalRowCount();

	if(currentUserID == "TLEDEZMA")
	if(appTypeString.startsWith("Forestry/Request")){
		var addrs = dtlDesc.value;
		var addrsParts = addrs.split(",");
		var capIdArray = [];
		var dupRecs = "";
		
		var AddressHouseNumber = addrsParts[0];
		var AddressStreetName = addrsParts[1];
		var AddressStreetSuffix = addrsParts[2];
		var AddressZip = addrsParts[3];
		var AddressStreetDirection = addrsParts[4];
		
		var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
	    if (capAddResult.getSuccess()){ capIdArray=capAddResult.getOutput(); }
		
		
	    for (cappy in capIdArray){
	    	var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
			dupRecs += relcap.getCapID().getCustomID() + ",";
		}
		
		dtlDesc.value = "Possible duplicate records " + dupRecs.substring(0, dupRecs.length -1);
		expression.setReturn(dtlDesc);
	}
	
}
catch(err){
    dtlDesc.message = "Error:" + err + ".";
    expression.setReturn(dtlDesc);
	
}
