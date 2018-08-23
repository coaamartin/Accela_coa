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
	function matches(eVal, argList) {
    	for (var i = 1; i < arguments.length; i++) {
    		if (arguments[i] == eVal) {
    			return true;
    		}
    	}
    	return false;
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
		var AddressStreetDirection = addrsParts[1];
		var AddressStreetName = addrsParts[2];
		var AddressStreetSuffix = addrsParts[3];
		var AddressZip = addrsParts[4];
		/*1,N,DEL MAR,CIR,80011 */
		var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
	    if (capAddResult.getSuccess()){ capIdArray=capAddResult.getOutput(); }
		
		
	    for (cappy in capIdArray){
	    	var relCap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
			var relCapTypeString = relCap.getCapType().toString();
            var relCapStatus = relCap.getCapStatus();
			if(relCapTypeString.startsWith("Forestry/Request") && matches(relCapStatus, "Wait List", "Assigned", "Submitted", "Working")){
			    dupRecs += relCap.getCapID().getCustomID() + ",";
			}
		}
		
		if(dupRecs.length > 0){
			dtlDesc.message = "There are possible duplicates";
		    dtlDesc.value = "Possible duplicate records " + dupRecs.substring(0, dupRecs.length -1);
		    expression.setReturn(dtlDesc);
		}
		else{
			dtlDesc.message = "No possible duplicates";
		    expression.setReturn(dtlDesc);
		}
	}
	
}
catch(err){
    dtlDesc.message = "Error:" + err + ". Line: " + err.lineNumber;
    expression.setReturn(dtlDesc);
	
}
