function getParcelOwnersBySQL(vParcelNbr) {
	//Correct parcel number if it has "-" within.
	if (vParcelNbr.indexOf("-") != -1) {
		vParcelNbr = vParcelNbr.replace(/-/g,"");
	}

	////Read
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();

	//var vRtField = "a.L1_OWNER_NBR,b,SOURCE_SEQ_NBR,b.L1_EVENT_ID,b.L1_PRIMARY_OWNER,b.L1_OWNER_STATUS,b.L1_OWNER_FULL_NAME,b.L1_OWNER_TITLE,b.L1_OWNER_FNAME,b.L1_OWNER_MNAME,b.L1_OWNER_LNAME,b.L1_TAX_ID,b.L1_ADDRESS1,b.L1_ADDRESS2,b.L1_ADDRESS3,b.L1_CITY,b.L1_STATE,b.L1_ZIP,b.L1_COUNTRY,b.L1_PHONE,b.L1_FAX,b.L1_MAIL_ADDRESS1,b.L1_MAIL_ADDRESS2,b.L1_MAIL_ADDRESS3,b.L1_MAIL_CITY,b.L1_MAIL_STATE,b.L1_MAIL_ZIP,b.L1_MAIL_COUNTRY,b.L1_UDF1,b.L1_UDF2,b.L1_UDF3,b.L1_UDF4,b.GA_IVR_PIN,b.L1_EMAIL,b.EXT_UID,b.L1_PHONE_COUNTRY_CODE,b.L1_FAX_COUNTRY_CODE,b.REC_DATE,b.REC_FUL_NAM,b.REC_STATUS";
	var vRtField = "*";
	
	var selectString = "select " + vRtField + " from XPAROWNR a inner join L3OWNERS b on a.SOURCE_SEQ_NBR = b.SOURCE_SEQ_NBR and a.L1_OWNER_NBR = b.L1_OWNER_NBR where a.SOURCE_SEQ_NBR = '1' and a.L1_PARCEL_NBR = '" + vParcelNbr + "'";
	var sStmt = conn.prepareStatement(selectString);
	var rSet = sStmt.executeQuery();
	//var retVal;
	//var retArr = [];
	var ownArr = [];
	var x = 0;
	var vOwnerModel;
	while (rSet.next()) {
		//retVal = rSet.getString('L1_OWNER_NBR');
		//retArr.push(retVal);
		// convert to capOwnerScriptModel
		vOwnerModel = aa.owner.getCapOwnerScriptModel().getOutput();
		vOwnerModel.setL1OwnerNumber(rSet.getString('L1_OWNER_NBR'));
		vOwnerModel.setAddress1(rSet.getString('L1_ADDRESS1'));
		vOwnerModel.setAddress2(rSet.getString('L1_ADDRESS2'));
		vOwnerModel.setAddress3(rSet.getString('L1_ADDRESS3'));
		vOwnerModel.setCity(rSet.getString('L1_CITY'));
		vOwnerModel.setCountry(rSet.getString('L1_COUNTRY'));
		vOwnerModel.setEmail(rSet.getString('L1_EMAIL'));
		vOwnerModel.setFax(rSet.getString('L1_FAX'));
		vOwnerModel.setMailAddress1(rSet.getString('L1_MAIL_ADDRESS1'));
		vOwnerModel.setMailAddress2(rSet.getString('L1_MAIL_ADDRESS2'));
		vOwnerModel.setMailAddress3(rSet.getString('L1_MAIL_ADDRESS3'));
		vOwnerModel.setMailCity(rSet.getString('L1_MAIL_CITY'));
		vOwnerModel.setMailCountry(rSet.getString('L1_MAIL_COUNTRY'));
		vOwnerModel.setMailState(rSet.getString('L1_MAIL_STATE'));
		vOwnerModel.setMailZip(rSet.getString('L1_MAIL_ZIP'));
		vOwnerModel.setOwnerFirstName(rSet.getString('L1_OWNER_FNAME'));
		vOwnerModel.setOwnerFullName(rSet.getString('L1_OWNER_FULL_NAME'));
		vOwnerModel.setOwnerLastName(rSet.getString('L1_OWNER_LNAME'));
		vOwnerModel.setOwnerMiddleName(rSet.getString('L1_OWNER_MNAME'));
		vOwnerModel.setOwnerStatus(rSet.getString('L1_OWNER_STATUS'));
		vOwnerModel.setOwnerTitle(rSet.getString('L1_OWNER_TITLE'));
		vOwnerModel.setPhone(rSet.getString('L1_PHONE'));
		vOwnerModel.setPrimaryOwner(rSet.getString('L1_PRIMARY_OWNER'));
		vOwnerModel.setState(rSet.getString('L1_STATE'));
		vOwnerModel.setTaxID(rSet.getString('L1_TAX_ID'));
		vOwnerModel.setUID(rSet.getString('EXT_UID'));
		vOwnerModel.setZip(rSet.getString('L1_ZIP'));
		ownArr.push(vOwnerModel);
	}
	sStmt.close();
	conn.close();
	
	return ownArr;
}