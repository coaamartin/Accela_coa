/**
* Contact Object 
* <p>
* Properties: 
*	people - PeopleModel Object
*   capContact - CapContactModel Object
*	capContactScript - CapContactScriptModel Object
*	capId - capID Object
*	type - Contact Type
*	seqNumber - Transactional Seqence Number
*	asi - associative array of people template attributes
*	customFields - associative array of custom template fields
*	customTables - Not yet implemented
*	primary - Contact is Primary
*	relation - Contact Relation
*	addresses - associative array of address
*	validAttrs - Boolean indicating people template attributes
*	validCustomFields - Boolean indicating custom template fields
*	validCustomTables - Not implemented yet
*	infoTables - Table Array ex infoTables[name][row][column].getValue()
*	attribs - Array of LP Attributes ex attribs[name]
*	valid - Get the Attributes for LP
*	validTables - true if LP has infoTables
*	validAttrs - true if LP has attributes
* </p>
* <p>
* Methods:
*	toString() - Outputs a string of key contact fields 
*	getEmailTemplateParams(params,[vContactType]) - Contact Parameters for use in Notification Templates
*	replace(targetCapId) - send this contact to another record, optional new contact type
*	equals(contactObj) - Compares this contact to another contact by comparing key elements
*	saveBase() - Saves base information such as contact type, primary flag, relation
*	save() - Saves all current information to the transactional contact
*	syncCapContactToReference() - Synchronize the contact data from the record with the reference contact by pushing data from the record into reference.
*	syncCapContactFromReference() - Synchronize the reference contact data with the contact on the record by pulling data from reference into the record.
*	getAttribute(vAttributeName) - Get method for people template attributes
*	setAttribute(vAttributeName, vAttributeValue) - Set method for people template attributes
*	getCustomField(vFieldName) - Get method for Custom Template Fields
*	setCustomField(vFieldName,vFieldValue) - Set method for Custom Template Fields
*	remove() - Removes this contact from the transactional record
*	isSingleAddressPerType() - Boolean indicating if this contact has a Single Addresss Per Type
*	getAddressTypeCounts() - returns an associative array of how many adddresses are attached
*	createPublicUser() - For individual contact types, this function checkes to see if public user exists already based on email address then creates a public user and activates it for the agency. It also sends an Activate email and sends a Password Email. If there is a reference contact, it will assocated it with the newly created public user.
*	getCaps([record type filter]) - Returns an array of records related to the reference contact
*	getRelatedContactObjs([record type filter]) - Returns an array of contact objects related to the reference contact
*	getRelatedRefLicProfObjs() - Returns an array of Reference License Professional objects related to the reference contact
*	createRefLicProf(licNum,rlpType,addressType,licenseState, [servProvCode]) - Creates a Reference License Professional based on the contact information. If this contact is linked to a Reference Contact, it will link the new Reference License Professional to the Reference Contact.
*	linkRefContactWithRefLicProf(licnumber, [lictype]) - Link a Reference License Professional to the Reference Contact.
*	getAKA() - Returns an array of AKA Names for the assocated reference contact
*	addAKA(firstName,middleName,lastName,fullName,startDate,endDate) - Adds an AKA Name to the assocated reference contact
*	removeAKA(firstName,middleName,lastName) - Removes an AKA Name from the assocated reference contact
*	hasPublicUser() - Boolean indicating if the contact has an assocated public user account
*	linkToPublicUser(pUserId) - Links the assocated reference contact to the public user account
*	sendCreateAndLinkNotification() - Sends a Create and Link Notification using the PUBLICUSER CREATE AND LINK notification template to the contact for the scenario in AA where a paper application has been submitted
*	getRelatedRefContacts([relConsArray]) - Returns an array of related reference contacts. An optional relationship types array can be used
* </p>
* <p>
* Call Example:
* 	var vContactObj = new contactObj(vCCSM);
*	var contactRecordArray = vContactObj.getAssociatedRecords();
*	var cParams = aa.util.newHashtable();
*	vContactObj.getEmailTemplateParams(cParams);
* </p>
* @param ccsm {CapContactScriptModel}
* @return {contactObj}
*/

function contactObj(ccsm)  {
    this.people = null;         // for access to the underlying data
    this.capContact = null;     // for access to the underlying data
    this.capContactScript = null;   // for access to the underlying data
    this.capId = null;
    this.type = null;
    this.seqNumber = null;
    this.refSeqNumber = null;
    this.asiObj = null;
    this.asi = new Array();    // associative array of attributes
	this.customFieldsObj = null;
	this.customFields = new Array();
	this.customTablesObj = null;
	this.customTables = new Array();
    this.primary = null;
    this.relation = null;
    this.addresses = null;  // array of addresses
    this.validAttrs = false;
	this.validCustomFields = false;
	this.validCustomTables = false;
        
    this.capContactScript = ccsm;
    if (ccsm)  {
        if (ccsm.getCapContactModel == undefined) {  // page flow
            this.people = this.capContactScript.getPeople();
            this.refSeqNumber = this.capContactScript.getRefContactNumber();
            }
        else {
            this.capContact = ccsm.getCapContactModel();
            this.people = this.capContact.getPeople();
            this.refSeqNumber = this.capContact.getRefContactNumber();

			// contact attributes
			// Load People Template Fields
            if (this.people.getAttributes() != null) {
                this.asiObj = this.people.getAttributes().toArray();
                if (this.asiObj != null) {
                    for (var xx1 in this.asiObj) this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1];
                    this.validAttrs = true; 
                }   
            }
			// Load Custom Template Fields
			if (this.capContact.getTemplate() != null && this.capContact.getTemplate().getTemplateForms() != null) {
				var customTemplate = this.capContact.getTemplate();
				this.customFieldsObj = customTemplate.getTemplateForms();
				if (!(this.customFieldsObj == null || this.customFieldsObj.size() == 0)) {
					for (var i = 0; i < this.customFieldsObj.size(); i++) {
						var eachForm = this.customFieldsObj.get(i);
						//Sub Group
						var subGroup = eachForm.subgroups;
						if (subGroup == null) {
							continue;
						}
						for (var j = 0; j < subGroup.size(); j++) {
							var eachSubGroup = subGroup.get(j);
							if (eachSubGroup == null || eachSubGroup.fields == null) {
								continue;
							}
							var allFields = eachSubGroup.fields;
							if (!(allFields == null || allFields.size() == 0)) {
								for (var k = 0; k < allFields.size(); k++) {
									var eachField = allFields.get(k);
									this.customFields[eachField.displayFieldName] = eachField.defaultValue;
									logDebug("(contactObj) {" + eachField.displayFieldName + "} = " +  eachField.defaultValue);
									this.validCustomFields = true;
								}
							}
						}
					}
				}
			}
        }  

		// contact ASI
		var tm = this.people.getTemplate();
		if (tm)	{
			var templateGroups = tm.getTemplateForms();
			var gArray = new Array();
			if (!(templateGroups == null || templateGroups.size() == 0)) {
				var subGroups = templateGroups.get(0).getSubgroups();
				if (!(subGroups == null || subGroups.size() == 0)) {
					for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
						var subGroup = subGroups.get(subGroupIndex);
						var fields = subGroup.getFields();
						if (!(fields == null || fields.size() == 0)) {
							for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
								var field = fields.get(fieldIndex);
								this.asi[field.getDisplayFieldName()] = field.getDefaultValue();
							}
						}
					}
				}
			}
		}

        //this.primary = this.capContact.getPrimaryFlag().equals("Y");
        this.relation = this.people.relation;
        this.seqNumber = this.people.contactSeqNumber;
        this.type = this.people.getContactType();
        this.capId = this.capContactScript.getCapID();
        var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);
        if (contactAddressrs.getSuccess()) {
            this.addresses = contactAddressrs.getOutput();
            var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
            this.people.setContactAddressList(contactAddressModelArr);
            }
        else {
            pmcal = this.people.getContactAddressList();
            if (pmcal) {
                this.addresses = pmcal.toArray();
            }
        }
    }       
        this.toString = function() { return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ") #ofAddr=" + this.addresses.length + " primary=" + this.primary;  }
        
        this.getEmailTemplateParams = function (params, vContactType) {
			var contactType = "";
			if (arguments.length == 2) contactType = arguments[1];
			
            addParameter(params, "$$" + contactType + "LastName$$", this.people.getLastName());
            addParameter(params, "$$" + contactType + "FirstName$$", this.people.getFirstName());
            addParameter(params, "$$" + contactType + "MiddleName$$", this.people.getMiddleName());
            addParameter(params, "$$" + contactType + "BusinesName$$", this.people.getBusinessName());
            addParameter(params, "$$" + contactType + "ContactSeqNumber$$", this.seqNumber);
            addParameter(params, "$$ContactType$$", this.type);
            addParameter(params, "$$" + contactType + "Relation$$", this.relation);
            addParameter(params, "$$" + contactType + "Phone1$$", this.people.getPhone1());
            addParameter(params, "$$" + contactType + "Phone2$$", this.people.getPhone2());
            addParameter(params, "$$" + contactType + "Email$$", this.people.getEmail());
            addParameter(params, "$$" + contactType + "AddressLine1$$", this.people.getCompactAddress().getAddressLine1());
            addParameter(params, "$$" + contactType + "AddressLine2$$", this.people.getCompactAddress().getAddressLine2());
            addParameter(params, "$$" + contactType + "City$$", this.people.getCompactAddress().getCity());
            addParameter(params, "$$" + contactType + "State$$", this.people.getCompactAddress().getState());
            addParameter(params, "$$" + contactType + "Zip$$", this.people.getCompactAddress().getZip());
            addParameter(params, "$$" + contactType + "Fax$$", this.people.getFax());
            addParameter(params, "$$" + contactType + "Country$$", this.people.getCompactAddress().getCountry());
            addParameter(params, "$$" + contactType + "FullName$$", this.people.getFullName());
            return params;
            }
        
        this.replace = function(targetCapId) { // send to another record, optional new contact type
        
            var newType = this.type;
            if (arguments.length == 2) newType = arguments[1];
            //2. Get people with target CAPID.
            var targetPeoples = getContactObjs(targetCapId,[String(newType)]);
            //3. Check to see which people is matched in both source and target.
            for (var loopk in targetPeoples)  {
                var targetContact = targetPeoples[loopk];
                if (this.equals(targetPeoples[loopk])) {
                    targetContact.people.setContactType(newType);
                    aa.people.copyCapContactModel(this.capContact, targetContact.capContact);
                    targetContact.people.setContactAddressList(this.people.getContactAddressList());
                    overwriteResult = aa.people.editCapContactWithAttribute(targetContact.capContact);
                    if (overwriteResult.getSuccess())
                        logDebug("overwrite contact " + targetContact + " with " + this);
                    else
                        logDebug("error overwriting contact : " + this + " : " + overwriteResult.getErrorMessage());
                    return true;
                    }
                }

                var tmpCapId = this.capContact.getCapID();
                var tmpType = this.type;
                this.people.setContactType(newType);
                this.capContact.setCapID(targetCapId);
                createResult = aa.people.createCapContactWithAttribute(this.capContact);
                if (createResult.getSuccess())
                    logDebug("(contactObj) contact created : " + this);
                else
                    logDebug("(contactObj) error creating contact : " + this + " : " + createResult.getErrorMessage());
                this.capContact.setCapID(tmpCapId);
                this.type = tmpType;
                return true;
        }

        this.equals = function(t) {
            if (t == null) return false;
            if (!String(this.people.type).equals(String(t.people.type))) { return false; }
            if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) { return false; }
            if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) { return false; }
            if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) { return false; }
            if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) { return false; }
            return  true;
        }
        
        this.saveBase = function() {
            // set the values we store outside of the models.
            this.people.setContactType(this.type);
            this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
            this.people.setRelation(this.relation);
            saveResult = aa.people.editCapContact(this.capContact);
            if (saveResult.getSuccess())
                logDebug("(contactObj) base contact saved : " + this);
            else
                logDebug("(contactObj) error saving base contact : " + this + " : " + saveResult.getErrorMessage());
            }               
        
        this.save = function() {
            // set the values we store outside of the models
            this.people.setContactType(this.type);
            this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
            this.people.setRelation(this.relation);
            this.capContact.setPeople(this.people);
            saveResult = aa.people.editCapContactWithAttribute(this.capContact);
            if (saveResult.getSuccess())
                logDebug("(contactObj) contact saved : " + this);
            else
                logDebug("(contactObj) error saving contact : " + this + " : " + saveResult.getErrorMessage());
            }
			
		this.syncCapContactToReference = function() {
			
			if(this.refSeqNumber){
				var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
				var saveResult = aa.people.syncCapContactToReference(this.capContact,vRefContPeopleObj);
				if (saveResult.getSuccess())
					logDebug("(contactObj) syncCapContactToReference : " + this);
				else
					logDebug("(contactObj) error syncCapContactToReference : " + this + " : " + saveResult.getErrorMessage());
			}
			else{
				logDebug("(contactObj) error syncCapContactToReference : No Reference Contact to Syncronize With");
			}
            
		}
		this.syncCapContactFromReference = function() {
			
			if(this.refSeqNumber){
				var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
				var saveResult = aa.people.syncCapContactFromReference(this.capContact,vRefContPeopleObj);
				if (saveResult.getSuccess())
					logDebug("(contactObj) syncCapContactFromReference : " + this);
				else
					logDebug("(contactObj) error syncCapContactFromReference : " + this + " : " + saveResult.getErrorMessage());
			}
			else{
				logDebug("(contactObj) error syncCapContactFromReference : No Reference Contact to Syncronize With");
			}
            
		}

        //get method for Attributes
        this.getAttribute = function (vAttributeName){
            var retVal = null;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null)
                    retVal = tmpVal.getAttributeValue();
            }
            return retVal;
        }
        
        //Set method for Attributes
        this.setAttribute = function(vAttributeName,vAttributeValue){
			var retVal = false;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null){
                    tmpVal.setAttributeValue(vAttributeValue);
                    retVal = true;
                }
            }
            return retVal;
        }
		
		//get method for Custom Template Fields
        this.getCustomField = function(vFieldName){
            var retVal = null;
            if(this.validCustomFields){
                var tmpVal = this.customFields[vFieldName.toString()];
                if(!matches(tmpVal,undefined,null,"")){
                    retVal = tmpVal;
				}
            }
            return retVal;
        }
		
		//Set method for Custom Template Fields
        this.setCustomField = function(vFieldName,vFieldValue){
            
            var retVal = false;
            if(this.validCustomFields){
				if (!(this.customFieldsObj == null || this.customFieldsObj.size() == 0)) {
					for (var i = 0; i < this.customFieldsObj.size(); i++) {
						var eachForm = this.customFieldsObj.get(i);
						//Sub Group
						var subGroup = eachForm.subgroups;
						if (subGroup == null) {
							continue;
						}
						for (var j = 0; j < subGroup.size(); j++) {
							var eachSubGroup = subGroup.get(j);
							if (eachSubGroup == null || eachSubGroup.fields == null) {
								continue;
							}
							var allFields = eachSubGroup.fields;
							for (var k = 0; k < allFields.size(); k++) {
								var eachField = allFields.get(k);
								if(eachField.displayFieldName == vFieldName){
								logDebug("(contactObj) updating custom field {" + eachField.displayFieldName + "} = " +  eachField.defaultValue + " to " + vFieldValue);
								eachField.setDefaultValue(vFieldValue);
								retVal = true;
								}
							}
						}
					}
				}
            }
            return retVal;
        }

        this.remove = function() {
            var removeResult = aa.people.removeCapContact(this.capId, this.seqNumber)
            if (removeResult.getSuccess())
                logDebug("(contactObj) contact removed : " + this + " from record " + this.capId.getCustomID());
            else
                logDebug("(contactObj) error removing contact : " + this + " : from record " + this.capId.getCustomID() + " : " + removeResult.getErrorMessage());
            }

        this.isSingleAddressPerType = function() {
            if (this.addresses.length > 1) 
                {
                
                var addrTypeCount = new Array();
                for (y in this.addresses) 
                    {
                    thisAddr = this.addresses[y];
                    addrTypeCount[thisAddr.addressType] = 0;
                    }

                for (yy in this.addresses) 
                    {
                    thisAddr = this.addresses[yy];
                    addrTypeCount[thisAddr.addressType] += 1;
                    }

                for (z in addrTypeCount) 
                    {
                    if (addrTypeCount[z] > 1) 
                        return false;
                    }
                }
            else
                {
                return true;    
                }

            return true;

            }

        this.getAddressTypeCounts = function() { //returns an associative array of how many adddresses are attached.
           
            var addrTypeCount = new Array();
            
            for (y in this.addresses) 
                {
                thisAddr = this.addresses[y];
                addrTypeCount[thisAddr.addressType] = 0;
                }

            for (yy in this.addresses) 
                {
                thisAddr = this.addresses[yy];
                addrTypeCount[thisAddr.addressType] += 1;
                }

            return addrTypeCount;

            }

        this.createPublicUser = function() {

            if (!this.capContact.getEmail())
            { logDebug("(contactObj) Couldn't create public user for : " + this +  ", no email address"); return false; }

            if (String(this.people.getContactTypeFlag()).equals("organization"))
            { logDebug("(contactObj) Couldn't create public user for " + this + ", the contact is an organization"); return false; }
            
            // check to see if public user exists already based on email address
            var getUserResult = aa.publicUser.getPublicUserByEmail(this.capContact.getEmail())
            if (getUserResult.getSuccess() && getUserResult.getOutput()) {
                userModel = getUserResult.getOutput();
                logDebug("(contactObj) createPublicUserFromContact: Found an existing public user: " + userModel.getUserID());
            }

            if (!userModel) // create one
                {
                logDebug("(contactObj) CreatePublicUserFromContact: creating new user based on email address: " + this.capContact.getEmail()); 
                var publicUser = aa.publicUser.getPublicUserModel();
                publicUser.setFirstName(this.capContact.getFirstName());
                publicUser.setLastName(this.capContact.getLastName());
                publicUser.setEmail(this.capContact.getEmail());
                publicUser.setUserID(this.capContact.getEmail());
                publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
                publicUser.setAuditID("PublicUser");
                publicUser.setAuditStatus("A");
                publicUser.setCellPhone(this.people.getPhone2());

                var result = aa.publicUser.createPublicUser(publicUser);
                if (result.getSuccess()) {

                logDebug("(contactObj) Created public user " + this.capContact.getEmail() + "  sucessfully.");
                var userSeqNum = result.getOutput();
                var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

                // create for agency
                aa.publicUser.createPublicUserForAgency(userModel);

                // activate for agency
                var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
                userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(),userSeqNum,"ADMIN");

                // reset password
                var resetPasswordResult = aa.publicUser.resetPassword(this.capContact.getEmail());
                if (resetPasswordResult.getSuccess()) {
                    var resetPassword = resetPasswordResult.getOutput();
                    userModel.setPassword(resetPassword);
                    logDebug("(contactObj) Reset password for " + this.capContact.getEmail() + "  sucessfully.");
                } else {
                    logDebug("(contactObj **WARNING: Reset password for  " + this.capContact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
                }

                // send Activate email
                aa.publicUser.sendActivateEmail(userModel, true, true);

                // send another email
                aa.publicUser.sendPasswordEmail(userModel);
                }
                else {
                    logDebug("(contactObj) **WARNIJNG creating public user " + this.capContact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
                }
            }

        //  Now that we have a public user let's connect to the reference contact       
            
        if (this.refSeqNumber)
            {
            logDebug("(contactObj) CreatePublicUserFromContact: Linking this public user with reference contact : " + this.refSeqNumber);
            aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), this.refSeqNumber);
            }
            

        return userModel; // send back the new or existing public user
        }

        this.getCaps = function() { // option record type filter

        
            if (this.refSeqNumber) {
                aa.print("ref seq : " + this.refSeqNumber);
                var capTypes = "*/*/*/*";
                var resultArray = new Array();
                if (arguments.length == 1) capTypes = arguments[0];

                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 

                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (appMatch(capTypes,thisCapId)) {
                        resultArray.push(thisCapId)
                        }
                    }
				} 
            
        return resultArray;
        }

        this.getRelatedContactObjs = function() { // option record type filter
        
            if (this.refSeqNumber) {
                var capTypes = null;
                var resultArray = new Array();
                if (arguments.length == 1) capTypes = arguments[0];

                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 

                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (capTypes && appMatch(capTypes,thisCapId)) {
                        var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
                        var newContactObj = new contactObj(ccsm);
                        resultArray.push(newContactObj)
                        }
                    }
            }
            
        return resultArray;
        }
        
		this.getRelatedRefLicProfObjs = function(){
			
			var refLicProfObjArray = new Array();
			
			// optional 2rd parameter serv_prov_code
				var updating = false;
				var serv_prov_code_4_lp = aa.getServiceProviderCode();
				if (arguments.length == 1) {
					serv_prov_code_4_lp = arguments[0];
					}
		
			if(this.refSeqNumber && serv_prov_code_4_lp)
			{
			  var xRefContactEntity = aa.people.getXRefContactEntityModel().getOutput();
			  xRefContactEntity.setServiceProviderCode(serv_prov_code_4_lp);
			  xRefContactEntity.setContactSeqNumber(parseInt(this.refSeqNumber));
			  xRefContactEntity.setEntityType("PROFESSIONAL");
			  //xRefContactEntity.setEntityID1(parseInt(refLicProfSeq));
			  var auditModel = xRefContactEntity.getAuditModel();
			  auditModel.setAuditDate(new Date());
			  auditModel.setAuditID(currentUserID);
			  auditModel.setAuditStatus("A")
			  xRefContactEntity.setAuditModel(auditModel);
			  var xRefContactEntityBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
			  var xRefContactEntList = xRefContactEntityBusiness.getXRefContactEntityList(xRefContactEntity);
			  var xRefContactEntArray = xRefContactEntList.toArray();
			  if(xRefContactEntArray)
			  {
				 for(iLP in xRefContactEntArray){
					 var xRefContactEnt = xRefContactEntArray[iLP];
					 var lpSeqNbr = xRefContactEnt.getEntityID1();
					 var lpObjResult = aa.licenseScript.getRefLicenseProfBySeqNbr(aa.getServiceProviderCode(),lpSeqNbr);
					 var refLicNum = lpObjResult.getOutput().getStateLicense();
					 
					 refLicProfObjArray.push(new licenseProfObject1(refLicNum));
				 
				 }
				
			  }
			  else
			  {
				  logDebug("(contactObj.getRelatedRefLicProfObjs) - No Related Reference License License Professionals");
			  }
			  
			  return refLicProfObjArray;
			}
			else
			{
			  logDebug("**ERROR:Some Parameters are empty");
			}

		}
		
		this.linkRefContactWithRefLicProf = function(licnumber, lictype){
			
			var lpObj = new licenseProfObject(licnumber,lictype);
			var refLicProfSeq = lpObj.refLicModel.getLicSeqNbr();
			// optional 2rd parameter serv_prov_code
				var updating = false;
				var serv_prov_code_4_lp = aa.getServiceProviderCode();
				if (arguments.length == 3) {
					serv_prov_code_4_lp = arguments[2];
					}
		
			if(this.refSeqNumber && refLicProfSeq && serv_prov_code_4_lp)
			{
			  var xRefContactEntity = aa.people.getXRefContactEntityModel().getOutput();
			  xRefContactEntity.setServiceProviderCode(serv_prov_code_4_lp);
			  xRefContactEntity.setContactSeqNumber(parseInt(this.refSeqNumber));
			  xRefContactEntity.setEntityType("PROFESSIONAL");
			  xRefContactEntity.setEntityID1(parseInt(refLicProfSeq));
			  var auditModel = xRefContactEntity.getAuditModel();
			  auditModel.setAuditDate(new Date());
			  auditModel.setAuditID(currentUserID);
			  auditModel.setAuditStatus("A")
			  xRefContactEntity.setAuditModel(auditModel);
			  var xRefContactEntityBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
			  var existedModel = xRefContactEntityBusiness.getXRefContactEntityByUIX(xRefContactEntity);
			  if(existedModel.getContactSeqNumber())
			  {
				logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
			  }
			  else
			  {
				var XRefContactEntityCreatedResult = xRefContactEntityBusiness.createXRefContactEntity(xRefContactEntity);
				if (XRefContactEntityCreatedResult)
				{
				  logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
				}
				else
				{
				  logDebug("(contactObj) **ERROR:License professional failed to link to reference contact.  Reason: " +  XRefContactEntityCreatedResult.getErrorMessage());
				}
			  }
			}
			else
			{
			  logDebug("**ERROR:Some Parameters are empty");
			}

		}
        
        this.createRefLicProf = function(licNum,rlpType,addressType,licenseState) {
            
            // optional 3rd parameter serv_prov_code
            var updating = false;
            var serv_prov_code_4_lp = aa.getServiceProviderCode();
            if (arguments.length == 5) {
                serv_prov_code_4_lp = arguments[4];
                aa.setDelegateAgencyCode(serv_prov_code_4_lp);
                }
            
            // addressType = one of the contact address types, or null to pull from the standard contact fields.
            var newLic = getRefLicenseProf(licNum,rlpType);

            if (newLic) {
                updating = true;
                logDebug("(contactObj) Updating existing Ref Lic Prof : " + licNum);
                }
            else {
                var newLic = aa.licenseScript.createLicenseScriptModel();
                }

            peop = this.people;
            cont = this.capContact;
            if (cont.getFirstName() != null) newLic.setContactFirstName(cont.getFirstName());
            if (peop.getMiddleName() != null) newLic.setContactMiddleName(peop.getMiddleName()); // use people for this
            if (cont.getLastName() != null) if (peop.getNamesuffix() != null) newLic.setContactLastName(cont.getLastName() + " " + peop.getNamesuffix()); else newLic.setContactLastName(cont.getLastName());
            if (peop.getBusinessName() != null) newLic.setBusinessName(peop.getBusinessName());
            if (peop.getPhone1() != null) newLic.setPhone1(peop.getPhone1());
            if (peop.getPhone2() != null) newLic.setPhone2(peop.getPhone2());
            if (peop.getEmail() != null) newLic.setEMailAddress(peop.getEmail());
            if (peop.getFax() != null) newLic.setFax(peop.getFax());
            newLic.setAgencyCode(serv_prov_code_4_lp);
            newLic.setAuditDate(sysDate);
            newLic.setAuditID(currentUserID);
            newLic.setAuditStatus("A");
            newLic.setLicenseType(rlpType);
            newLic.setStateLicense(licNum);
            newLic.setLicState(licenseState);
            //setting this field for a future enhancement to filter license types by the licensing board field. (this will be populated with agency names)
            var agencyLong = lookup("CONTACT_ACROSS_AGENCIES",servProvCode);
            if (!matches(agencyLong,undefined,null,"")) newLic.setLicenseBoard(agencyLong); else newLic.setLicenseBoard("");
 
            var addr = null;

            if (addressType) {
                for (var i in this.addresses) {
                    var cAddr = this.addresses[i];
                    if (addressType.equals(cAddr.getAddressType())) {
                        addr = cAddr;
                    }
                }
            }
            
            if (!addr) addr = peop.getCompactAddress();   //  only used on non-multiple addresses or if we can't find the right multi-address
            
            if (addr.getAddressLine1() != null) newLic.setAddress1(addr.getAddressLine1());
            if (addr.getAddressLine2() != null) newLic.setAddress2(addr.getAddressLine2());
            if (addr.getAddressLine3() != null) newLic.getLicenseModel().setTitle(addr.getAddressLine3());
            if (addr.getCity() != null) newLic.setCity(addr.getCity());
            if (addr.getState() != null) newLic.setState(addr.getState());
            if (addr.getZip() != null) newLic.setZip(addr.getZip());
            if (addr.getCountryCode() != null) newLic.getLicenseModel().setCountryCode(addr.getCountryCode());
            
            if (updating){
                myResult = aa.licenseScript.editRefLicenseProf(newLic);
				
			}
            else{
                myResult = aa.licenseScript.createRefLicenseProf(newLic);
				if (myResult.getSuccess())
                {
					var newRefLicSeqNbr = parseInt(myResult.getOutput());
					this.linkRefContactWithRefLicProf(licNum,rlpType,serv_prov_code_4_lp);
				}
			}

            if (arguments.length == 5) {
                aa.resetDelegateAgencyCode();
            }
                
            if (myResult.getSuccess())
                {
                logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " From Contact " + this);
                return true;
                }
            else
                {
                logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
                return false;
                }
        }
        
        this.getAKA = function() {
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            if (this.refSeqNumber) {
                return aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber)).toArray();
                }
            else {
                logDebug("contactObj: Cannot get AKA names for a non-reference contact");
                return false;
                }
            }
            
        this.addAKA = function(firstName,middleName,lastName,fullName,startDate,endDate) {
            if (!this.refSeqNumber) {
                logDebug("contactObj: Cannot add AKA name for non-reference contact");
                return false;
                }
                
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            var args = new Array();
            var akaModel = aa.proxyInvoker.newInstance("com.accela.orm.model.contact.PeopleAKAModel",args).getOutput();
            var auditModel = aa.proxyInvoker.newInstance("com.accela.orm.model.common.AuditModel",args).getOutput();

            var a = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber));
            akaModel.setServiceProviderCode(aa.getServiceProviderCode());
            akaModel.setContactNumber(parseInt(this.refSeqNumber));
            akaModel.setFirstName(firstName);
            akaModel.setMiddleName(middleName);
            akaModel.setLastName(lastName);
            akaModel.setFullName(fullName);
            akaModel.setStartDate(startDate);
            akaModel.setEndDate(endDate);
            auditModel.setAuditDate(new Date());
            auditModel.setAuditStatus("A");
            auditModel.setAuditID("ADMIN");
            akaModel.setAuditModel(auditModel);
            a.add(akaModel);

            aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, a);
            }

        this.removeAKA = function(firstName,middleName,lastName) {
            if (!this.refSeqNumber) {
                logDebug("contactObj: Cannot remove AKA name for non-reference contact");
                return false;
                }
            
            var removed = false;
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            var l = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber));
            
            var i = l.iterator();
            while (i.hasNext()) {
                var thisAKA = i.next();
                if ((!thisAKA.getFirstName() || thisAKA.getFirstName().equals(firstName)) && (!thisAKA.getMiddleName() || thisAKA.getMiddleName().equals(middleName)) && (!thisAKA.getLastName() || thisAKA.getLastName().equals(lastName))) {
                    i.remove();
                    logDebug("contactObj: removed AKA Name : " + firstName + " " + middleName + " " + lastName);
                    removed = true;
                    }
                }   
                    
            if (removed)
                aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, l);
            }

        this.hasPublicUser = function() { 
            if (this.refSeqNumber == null) return false;
            var s_publicUserResult = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(this.refSeqNumber));
            
            if (s_publicUserResult.getSuccess()) {
                var fpublicUsers = s_publicUserResult.getOutput();
                if (fpublicUsers == null || fpublicUsers.size() == 0) {
                    logDebug("The contact("+this.refSeqNumber+") is not associated with any public user.");
                    return false;
                } else {
                    logDebug("The contact("+this.refSeqNumber+") is associated with "+fpublicUsers.size()+" public users.");
                    return true;
                }
            } else { logMessage("**ERROR: Failed to get public user by contact number: " + s_publicUserResult.getErrorMessage()); return false; }
        }

        this.linkToPublicUser = function(pUserId) { 
           
            if (pUserId != null) {
                var pSeqNumber = pUserId.replace('PUBLICUSER','');
                
                var s_publicUserResult = aa.publicUser.getPublicUser(aa.util.parseLong(pSeqNumber));

                if (s_publicUserResult.getSuccess()) {
                    var linkResult = aa.licenseScript.associateContactWithPublicUser(pSeqNumber, this.refSeqNumber);

                    if (linkResult.getSuccess()) {
                        logDebug("Successfully linked public user " + pSeqNumber + " to contact " + this.refSeqNumber);
                    } else {
                        logDebug("Failed to link contact to public user");
                        return false;
                    }
                } else {
                    logDebug("Could not find a public user with the seq number: " + pSeqNumber);
                    return false;
                }


            } else {
                logDebug("No public user id provided");
                return false;
            }
        }

        this.sendCreateAndLinkNotification = function() {
            //for the scenario in AA where a paper application has been submitted
            var toEmail = this.people.getEmail();

            if (toEmail) {
                var params = aa.util.newHashtable();
                getACARecordParam4Notification(params,acaUrl);
                addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
                addParameter(params,"$$altID$$",capIDString);
                var notificationName;

                if (this.people.getContactTypeFlag() == "individual") {
                    notificationName = this.people.getFirstName() + " " + this.people.getLastName();
                } else {
                    notificationName = this.people.getBusinessName();
                }

                if (notificationName)
                    addParameter(params,"$$notificationName$$",notificationName);
                if (this.refSeqNumber) {
                    var v = new verhoeff();
                    var pinCode = v.compute(String(this.refSeqNumber));
                    addParameter(params,"$$pinCode$$",pinCode);

                    sendNotification(sysFromEmail,toEmail,"","PUBLICUSER CREATE AND LINK",params,null);                    
                }

                               
            }

        }

        this.getRelatedRefContacts = function() { //Optional relationship types array 
            
            var relTypes;
            if (arguments.length > 0) relTypes = arguments[0];
            
            var relConsArray = new Array();

            if (matches(this.refSeqNumber,null,undefined,"")) return relConsArray;

            //check as the source
            var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
            xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
            xRefContactEntityModel.setContactSeqNumber(parseInt(this.refSeqNumber));
            x = xrb.getXRefContactEntityList(xRefContactEntityModel);


            if (x.size() > 0) {
                var relConList = x.toArray();

                for (var zz in relConList) {
                    var thisRelCon = relConList[zz];
                    var addThisCon = true;
                    if (relTypes) {
                        addThisCon = exists(thisRelCon.getEntityID4(),relTypes);
                    }

                    if (addThisCon) {
                        var peopResult = aa.people.getPeople(thisRelCon.getEntityID1());
                        if (peopResult.getSuccess()) {
                            var peop = peopResult.getOutput();
                            relConsArray.push(peop);
                        }
                    }

                }
            }

            //check as the target
            var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
            xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
            xRefContactEntityModel.setEntityID1(parseInt(this.refSeqNumber));
            x = xrb.getXRefContactEntityList(xRefContactEntityModel);

            if (x.size() > 0) {
                var relConList = x.toArray();

                for (var zz in relConList) {
                    var thisRelCon = relConList[zz];
                    var addThisCon = true;
                    if (relTypes) {
                        addThisCon = exists(thisRelCon.getEntityID4(),relTypes);
                    }

                    if (addThisCon) {
                        var peopResult = aa.people.getPeople(thisRelCon.getContactSeqNumber());
                        if (peopResult.getSuccess()) {
                            var peop = peopResult.getOutput();
                            relConsArray.push(peop);
                        }
                    }

                }
            }           

            return relConsArray;
        }
    }