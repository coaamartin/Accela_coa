function addStdVarsToEmail(vEParams, vCapId) {
	//Define variables
	var servProvCode;
	var cap;
	var capId;
	var capIDString;
	var currentUserID;
	var currentUserGroup;
	var appTypeResult;
	var appTypeString;
	var appTypeArray;
	var capTypeAlias;
	var capName;
	var fileDateObj;
	var fileDate;
	var fileDateYYYYMMDD;
	var parcelArea;
	var valobj;
	var estValue;
	var calcValue;
	var feeFactor;
	var capDetailObjResult;
	var capDetail;
	var houseCount;
	var feesInvoicedTotal;
	var balanceDue;
	var parentCapString;
	var parentArray;
	var parentCapId;
	var addressLine;
	
	//get standard variables for the record provided
	if(vCapId != null){
		capId = vCapId;
		servProvCode = capId.getServiceProviderCode();
		capIDString = capId.getCustomID();
		cap = aa.cap.getCap(capId).getOutput();	
		appTypeResult = cap.getCapType();
		appTypeString = appTypeResult.toString();
		capTypeAlias = cap.getCapType().getAlias();
		capName = cap.getSpecialText();
		capStatus = cap.getCapStatus();
		fileDateObj = cap.getFileDate();
		fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
		fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(),fileDateObj.getDayOfMonth(),fileDateObj.getYear(),"YYYY-MM-DD");
		valobj = aa.finance.getContractorSuppliedValuation(vCapId,null).getOutput();	
		if (valobj.length) {
			estValue = valobj[0].getEstimatedValue();
			calcValue = valobj[0].getCalculatedValue();
			feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
		}
		
		var capDetailObjResult = aa.cap.getCapDetail(vCapId);		
		if (capDetailObjResult.getSuccess())
		{
			capDetail = capDetailObjResult.getOutput();
			houseCount = capDetail.getHouseCount();
			feesInvoicedTotal = capDetail.getTotalFee();
			balanceDue = capDetail.getBalance();
			if (Number(balanceDue) != 'NaN') {
				balanceDue = Number(balanceDue).toFixed(2);
			}
		}
		parentCapString = "" + aa.env.getValue("ParentCapID");
		if (parentCapString.length > 0) {
			parentArray = parentCapString.split("-"); 
			parentCapId = aa.cap.getCapID(parentArray[0], parentArray[1], parentArray[2]).getOutput(); 
		}
		if (!parentCapId) {
			parentCapId = getParent(); 
		}
		if (!parentCapId) {
			parentCapId = getParentLicenseCapID(vCapId); 
		}		
		addressLine = getAddressInALine();
		currentUserID = aa.env.getValue("CurrentUserID");
		appTypeArray = appTypeString.split("/");
		if(appTypeArray[0].substr(0,1) !="_") 
		{
			var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
			if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
		}
		parcelArea = 0;;

		//save variables to email paramater hashtable
		addParameter(vEParams,"$$altid$$",capIDString);	
		addParameter(vEParams,"$$capIDString$$",capIDString);
		addParameter(vEParams,"$$currentUserID$$",currentUserID); // seems to cause the issue
		addParameter(vEParams,"$$currentUserGroup$$",currentUserGroup); // seems to cause the issue
		addParameter(vEParams,"$$appTypeString$$",appTypeString);
		addParameter(vEParams,"$$capAlias$$",capTypeAlias);
		addParameter(vEParams,"$$capName$$",capName);
		addParameter(vEParams,"$$capStatus$$",capStatus);
		addParameter(vEParams,"$$fileDate$$",fileDate);
		addParameter(vEParams,"$$fileDateYYYYMMDD$$",fileDateYYYYMMDD);
		addParameter(vEParams,"$$parcelArea$$",parcelArea); // seems to cause the issue
		addParameter(vEParams,"$$estValue$$",estValue);
		addParameter(vEParams,"$$calcValue$$",calcValue);
		addParameter(vEParams,"$$feeFactor$$",feeFactor);
		addParameter(vEParams,"$$houseCount$$",houseCount);
		addParameter(vEParams,"$$feesInvoicedTotal$$",feesInvoicedTotal);
		addParameter(vEParams,"$$balanceDue$$",balanceDue);	
		if (parentCapId) {
			addParameter(vEParams,"$$parentCapId$$",parentCapId.getCustomID());
		}
		//Add ACA Urls to Email Variables
		addACAUrlsVarToEmail(vEParams);
		//Add address information
		if (addressLine != null) {
			addParameter(vEParams,"$$capAddress$$",addressLine);
		}
	}
	return vEParams;
}