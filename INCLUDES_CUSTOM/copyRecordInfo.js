function copyRecordInfo(fromCapId, toCapId, infoToCopy) {
/***********************************************************
Parameters:
	fromCapId - cap id object of the record to copy from
	toCapId - cap id object of the record to copy to
	infoToCopy - semi colon delimited string identifying what information to copy. E.g. CONTACTS;ASI;ASIT:RECORDDETAILS;CONDITIONS;ADDRESS;PARCEL;OWNER;LICENSEDPROFESSIONALS;ADDITIONALINFO;EDUCATION;CONTEDUCATION;EXAM;DOCUMENT
************************************************************/

	if (!fromCapId || !toCapId) { logDebug("From or to capID is null"); return; }
	infoTypeArray = infoToCopy.split(';');
	if (infoTypeArray && infoTypeArray.length > 0) {
		for (var iIndex in infoTypeArray) {
			infoType = infoTypeArray[iIndex];
			switch ("" + infoType) {
				case "CONTACTS":
					var capContactResult = aa.people.getCapContactByCapID(toCapId);
					if (capContactResult.getSuccess()) {
						var Contacts = capContactResult.getOutput();
						for (yy in Contacts) {
							var con = Contacts[yy];				
							var capContactId = con.getPeople().getContactSeqNumber();
							delResult = aa.people.removeCapContact(toCapId, capContactId);
							if (!delResult.getSuccess()) {
								logDebug("Error removing contacts on target Cap " + delResult.getErrorMessage());
							}
						}
					}
					copyContacts(fromCapId, toCapId);
					break;
				case "ASI":
					fromCap = aa.cap.getCap(fromCapId).getOutput();
					fromAppTypeResult = fromCap.getCapType();
					fromAppTypeString = fromAppTypeResult.toString();
					var ignore = lookup("EMSE:ASI Copy Exceptions",fromAppTypeString); 
					var ignoreArr = new Array(); 
					if(ignore != null) ignoreArr = ignore.split("|"); 
					var AppSpecInfo = new Array();
					useAppSpecificGroupName = true;
					loadAppSpecific(AppSpecInfo,fromCapId);
					for (asi in AppSpecInfo){
						var ignore=false;
						for(var i = 0; i < ignoreArr.length; i++) {
							if (asi.indexOf(ignoreArr[i]) == 0) {
								ignore=true;
								break;
							}
						}
						if (!ignore) editAppSpecific(asi,AppSpecInfo[asi],toCapId);
					}
					useAppSpecificGroupName = true;
					break;
				case "ASIT":
					var srcTableNameArray = aa.appSpecificTableScript.getAppSpecificGroupTableNames(fromCapId).getOutput();
					var targetTableNameArray = aa.appSpecificTableScript.getAppSpecificGroupTableNames(fromCapId).getOutput();
					logDebug("targetTableNameArray: " + targetTableNameArray.join(";"));
					for (var tIndex in srcTableNameArray) {
						var tableName = srcTableNameArray[tIndex];
						if (exists(tableName,targetTableNameArray)) { // 03/20/2020 RS: Replace IsStrInArry with exists.
							logDebug("Copying table: " + tableName);
							var sourceAppSpecificTable = aa.appSpecificTableScript.getAppSpecificTableModel(fromCapId,tableName).getOutput();
							var srcTableModel = null;
							if(sourceAppSpecificTable != null) {						
								srcTableModel = sourceAppSpecificTable.getAppSpecificTableModel();
								tgtTableModelResult = aa.appSpecificTableScript.getAppSpecificTableModel(toCapId, tableName);
								if (tgtTableModelResult.getSuccess()) {
									tgtTableModel = tgtTableModelResult.getOutput();
									if (tgtTableModel == null) {
										logDebug("target table model is null");
									}
									else {
										tgtGroupName = tgtTableModel.getGroupName();
										srcTableModel.setGroupName(tgtGroupName);
									}
								}
								else { logDebug("Error getting target table model " + tgtTableModelResult.getErrorMessage()); }
							}
							editResult = aa.appSpecificTableScript.editAppSpecificTableInfos(srcTableModel, toCapId, null);
							if (!editResult.getSuccess()) {					
								logDebug("Error editing appSpecificTableInfos " + editResult.getErrorMessage());
							}
						}
						else { 
							logDebug("Table " + tableName + " is not defined on target");
						}
					}
					break;
				case "RECORDDETAILS":
					/* 03/20/2020 RS: These methods return void
					ccdiResult = aa.cap.copyCapDetailInfo(fromCapId, toCapId);
					if (!ccdiResult.getSuccess()) logDebug("Error copying record details " + ccdiResult.getErrorMessage());
					ccwdiResult = aa.cap.copyCapWorkDesInfo(fromCapId, toCapId);
					if (!ccwdiResult.getSuccess()) logDebug("Error copying record details " + ccdwiResult.getErrorMessage());
					*/
					aa.cap.copyCapDetailInfo(fromCapId, toCapId);
					aa.cap.copyCapWorkDesInfo(fromCapId, toCapId);
					logDebug("Copied record details & work description from " + fromCapId + " to " + toCapId);
					break;
				case "CONDITIONS" :
					var s_result = aa.capCondition.getCapConditions(fromCapId);
					if(s_result.getSuccess()) {
						sourceCapConditions = s_result.getOutput();
						if (sourceCapConditions != null && sourceCapConditions.length >= 0) {
							targetCapConditions = aa.capCondition.getCapConditions(toCapId).getOutput();
							for (var cIndex in targetCapConditions) {
								theCondition = targetCapConditions[cIndex];
								aa.capCondition.deleteCapCondition(toCapId, theCondition.getConditionNumber());
							}
						}
						for (var sIndex in sourceCapConditions) {
							newCondition = sourceCapConditions[sIndex];
							newCondition.setCapID(toCapId);
							createResult = aa.capCondition.createCapCondition(newCondition);
							if (!createResult.getSuccess()) { logDebug("Error creating cap condition " + createResult.getErrorMessage()); }
						}
						if (sourceCapConditions != null && sourceCapConditions.length >= 0)
							logDebug("Copied conditions from " + fromCapId + " to " + toCapId);
					}
					break;
				case "ADDRESS":
					addrsToRemove = aa.address.getAddressByCapId(toCapId).getOutput();
					if (addrsToRemove) {
						for (x in addrsToRemove ) aa.address.removeAddress(toCapId, addrsToRemove[x].getAddressId());
					}
					copyAddresses(fromCapId, toCapId);
					break;
				case "PARCEL":
					var parcelListResult = aa.parcel.getParcelDailyByCapID(toCapId.getID1(), toCapId.getID2(), toCapId.getID3());
					var srcParcelList = parcelListResult.getOutput();
					parcelBiz =  aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();	 
					for (var pIndex in srcParcelList) {
						thisCapParcel = srcParcelList[pIndex];
						parcelBiz.deleteDailyParcelByPK(aa.getServiceProviderCode(), srcParcelList[pIndex], "ADMIN");
					}
					copyParcels(fromCapId, toCapId);
					break;
				case "OWNER":
					ownResult = aa.owner.getOwnerByCapId(toCapId);
					if (ownResult.getSuccess()) {
						owners = ownResult.getOutput();
						if (owners!=null && owners.length > 0) {
							for (var i=0;i<owners.length;i++)
								aa.owner.removeCapOwnerModel(owners[i])
						}
					}
					copyOwner(fromCapId, toCapId);
					break;
				case "LICENSEDPROFESSIONALS":
					var capLicenseResult = aa.licenseProfessional.getLicenseProf(fromCapId);
					var capLicenseArr = new Array();
					if (capLicenseResult.getSuccess()) {
						capLicenseArr = capLicenseResult.getOutput();
						if (capLicenseArr != null && capLicenseArr.length > 0) {
							for (var lpIndex in capLicenseArr) {
								lpObj = new licenseProfObject(capLicenseArr[lpIndex].getLicenseNbr(), capLicenseArr[lpIndex].getLicenseType());
								lpObj.copyToRecord(toCapId, true);
							}
						}
					}
					break;
				case "ADDITIONALINFO":
					var s_result = aa.cap.getBValuatn4AddtInfo(fromCapId);
					if(s_result.getSuccess()) {
						bvaluatnScriptModel = s_result.getOutput();
						if (bvaluatnScriptModel != null) {						
							var  capDetail = aa.cap.getCapDetail(fromCapId).getOutput();
							bvaluatnScriptModel.setCapID(toCapId);
							if (capDetail != null)	{	
								capDetail.setCapID(toCapId);
								editResult = aa.cap.editAddtInfo(capDetail,bvaluatnScriptModel);
								if (!editResult.getSuccess()) logDebug("Error copying additional info " + editResult.getErrorMessage());
							}
						}
					}
					break;
				case "EDUCATION":
					copyResult = aa.education.copyEducationList(fromCapId, toCapId);
					if (!copyResult.getSuccess()) logDebug("Error copying education " + copyResult.getErrorMessage());
					break;
				case "CONTEDUCATION":
					copyResult = aa.continuingEducation.copyContEducationList(fromCapId, toCapId);
					if (!copyResult.getSuccess()) logDebug("Error copying continuing education " + copyResult.getErrorMessage());
					break;
				case "EXAM":
					copyResult = aa.examination.copyExaminationList(fromCapId, toCapId);
					if (!copyResult.getSuccess()) logDebug("Error copying examination info " + copyResult.getErrorMessage())
					break;
				case "DOCUMENT":
					toCap = aa.cap.getCap(toCapId).getOutput();
					toAppTypeResult = toCap.getCapType();
					toAppTypeString = toAppTypeResult.toString();
					toAppTypeArray = toAppTypeString.split('/');
					var capDocResult = aa.document.getDocumentListByEntity(toCapId,"CAP"); 
					if(capDocResult.getSuccess()) { 
						if(capDocResult.getOutput().size() > 0)  { 
							for(index = 0; index < capDocResult.getOutput().size(); index++)  { 
								var tmpDoc = capDocResult.getOutput().get(index); 
								//remove the document first 
								aa.document.removeDocumentByPK(""+tmpDoc.getDocumentNo(),null,null,toAppTypeArray[0]); 
								logDebug("Documents removed"); 
							} 
						} 
					} 
					var capDocResult = aa.document.getDocumentListByEntity(fromCapId,"CAP");
					if(capDocResult.getSuccess()) {
						if(capDocResult.getOutput().size() > 0) {
							for(docInx = 0; docInx < capDocResult.getOutput().size(); docInx++) {
								var documentObject = capDocResult.getOutput().get(docInx);
								// download the document content
								var useDefaultUserPassword = true;
								//If useDefaultUserPassword = true, there is no need to set user name & password, but if useDefaultUserPassword = false, we need define EDMS user name & password.
								var EMDSUsername = null;
								var EMDSPassword = null;
								var downloadResult = aa.document.downloadFile2Disk(documentObject, documentObject.getModuleName(), EMDSUsername, EMDSPassword, useDefaultUserPassword);
								if(downloadResult.getSuccess()) {
									var path = downloadResult.getOutput();
								}
								var tmpEntId = toCapId.getID1() + "-" + toCapId.getID2() + "-" + toCapId.getID3();
								documentObject.setDocumentNo(null);
								documentObject.setCapID(toCapId)
								documentObject.setEntityID(tmpEntId);
					
								// Open and process file
								try {
									// put together the document content - use java.io.FileInputStream
									var newContentModel = aa.document.newDocumentContentModel().getOutput();
									inputstream = new java.io.FileInputStream(path);
									newContentModel.setDocInputStream(inputstream);
									documentObject.setDocumentContent(newContentModel);
									var newDocResult = aa.document.createDocument(documentObject);
									if (newDocResult.getSuccess()) {
										newDocResult.getOutput();
										logDebug("Successfully copied document: " + documentObject.getFileName());
									}
									else {
										logDebug("Failed to copy document: " + documentObject.getFileName());
										logDebug(newDocResult.getErrorMessage());
									}
								}
								catch (err) {
									logDebug("Error copying document: " + err.message);
									return false;
								}
							} // end for loop
						}
					}
					break;
				default: 
					logDebug("Unknown info type to copy : " + infoType);
					break;
			}
		}
	}
}