/*------------------------------------------------------------------------------------------------------/
| Program : COMMON_ACA_PAGEFLOW_FUNCTIONS.js
| Event   : -
|
| Usage   : Adds Standard Condition Function.
|
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;        // Set to true to see results in popup window
var showDebug = false;          // Set to true to see debug messages in popup window
var disableTokens = false;      // turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false;    // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;   // Use Group name when populating Task Specific Info Values
var enableVariableBranching = true; // Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;            // Maximum number of std choice entries.  Entries must be Left Zero Padded

var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
var systemUserObj = null;  							// Current User Object
var currentUserGroup = null;						// Current User Group
var publicUserID = null;
var publicUser = false;

if (currentUserID.indexOf("PUBLICUSER") == 0){
	publicUserID = currentUserID; 
	currentUserID = "ADMIN"; 
	publicUser = true;
}
if(currentUserID != null) {
	systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
}

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var GLOBAL_VERSION = 3.0;
var cancel = false;
var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var sysDate = aa.date.getCurrentDate();
var currentUserID = aa.env.getValue("CurrentUserID");
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var capModel = aa.env.getValue("CapModel");
var message =   "";     
var br = "<BR>";    

var componentNames = new Array("Contact 1","ASI Table","Parcel","Licensed Professional","Detail Information", 
"Owner", "Address", "Contact List", "Contact 2", "Contact 3","Valuation Calculator", 
"Licensed Professional List","Continuing Education","ASI","Assets","Additional Information",
"Education","Applicant","Examination","Attachment");

var componentAliasNames = new Array("Contact1","AppSpecTable","Parcel","License","DetailInfo", 
"Owner", "WorkLocation", "MultiContacts", "Contact2", "Contact3","ValuationCalculator", 
"MultiLicenses","ContinuingEducation","AppSpec","Assets","Description",
"Education","Applicant","Examination","Attachment");

 
function getCapId(id1, id2, id3) {
    var s_capResult = aa.cap.getCapID(id1, id2, id3);
    if (s_capResult.getSuccess())
        return s_capResult.getOutput();
    else {
        logDebug("**ERROR: Failed to get capId: " +
        s_capResult.getErrorMessage());
        return null;
    }
}

function logDebug(debug)
{
    aa.debug("ACA_SDAR_CAPCONDITION",debug);
}
 
 
 
function calcRowCount4ASIT(tableName)
{
    var rowCount = 0;
    var appSpecificTableGroupModel = capModel.getAppSpecificTableGroupModel();
    if(appSpecificTableGroupModel != null )
    {
        var tablesMap = appSpecificTableGroupModel.getTablesMap();
        if(tablesMap == null && tablesMap.values() == null) return 0;
        var appSpecificTableModelArray = tablesMap.values().toArray();
        for( i in appSpecificTableModelArray)
        {
            var appSpecificTableModel = appSpecificTableModelArray[i];
            if(!appSpecificTableModel.getTableName().equals(tableName) ) continue;
            if(appSpecificTableModel == null || appSpecificTableModel.getColumns() == null || appSpecificTableModel.getTableField() == null) continue;
            var columnCount =  appSpecificTableModel.getColumns().toArray().length;  // Columm Count
            var fieldCount = appSpecificTableModel.getTableField().toArray().length; // Field Count
            rowCount = fieldCount/columnCount;
            break;
        }
    }
    return rowCount
}


function getScriptText(vScriptName){
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();	
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
		return emseScript.getScriptText() + "";	
		} catch(err) {
		return "";
	}
}

function getAppSpecific(itemName)  
{
    var thisCapModel = aa.env.getValue("CapModel");     
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var conditionValue = getFieldValue(itemName,asiGroups); 
    return conditionValue;
}

function editAppSpecific(fieldName, value){
    var thisCapModel = aa.env.getValue("CapModel");     
    var asiGroups = thisCapModel.getAppSpecificInfoGroups();
    var asiGroupsRet = setFieldValue(fieldName, asiGroups, value);
    thisCapModel.setAppSpecificInfoGroups(asiGroupsRet);
    aa.env.setValue("CapModel", thisCapModel);      
}

function getFieldValue(fieldName, asiGroups)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();              
                if (fieldName == field.getCheckboxDesc())
                {
                    return field.getChecklistComment();
                }
            }
        }
    }   
    return null;    
}

function addStdCondition(cType,cDesc){ // optional cap ID
    if (arguments.length >= 3)
    {
        var itemCap = arguments[2]; // use cap ID specified in args
    }else{
        var itemCap = capId;
    }
    if (!aa.capCondition.getStandardConditions) {
        aa.debug("FAILED", "addStdCondition function is NOT available in this version of Accela Automation.");
    }
    else
    {
        standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
        for(i = 0; i<standardConditions.length;i++){
            if(standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
            {
                aa.debug("Found Conditions","Entered Loop..");
                standardCondition = standardConditions[i];
                aa.debug("New Cap Condition", cDesc);           
                getFromCondResult = aa.capCondition.getCapConditions(capId);
                if (getFromCondResult.getSuccess()) {
                    var condA = getFromCondResult.getOutput();
                    var exists = false;
                    for (cc in condA) {
                        var thisC = condA[cc];
                        var tempDesc = thisC.getConditionDescription();
                        aa.debug("Existing Cap Condition", tempDesc);           
                        if (tempDesc == cDesc){
                            exists = true;
                        }
                    }
                    if (!exists){
                        var addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(),standardCondition.getPriority(),standardCondition.getConditionOfApproval());
                   
                        if (addCapCondResult.getSuccess())
                        {
                            aa.debug("Successfully added condition ", standardCondition.getConditionDesc());
                        }
                        else
                        {
                            aa.debug("**ERROR: adding condition", standardCondition.getConditionDesc() + " : " + addCapCondResult.getErrorMessage());
                        }
                    }
                }
            }
        }
    }
}
 
 
function isContactTypeAttached(pCapModel, contactType){
    var contactList = pCapModel.getContactsGroup();
    if(contactList != null && contactList.size() > 0)
    {
        for(var i=contactList.size(); i > 0; i--)
        {
            var contactModel = contactList.get(i-1);
            if(contactModel)
            {
                var type = contactModel.getContactType();
                if (type == contactType){
                    return true;
                }               
            }
        }
    }
    return false;
}


function removeCapCondition(cType,cDesc)
    {
    var itemCap = capId;
    if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

    var capCondResult = aa.capCondition.getCapConditions(itemCap,cType);

    if (!capCondResult.getSuccess())
        {logDebug("**WARNING: error getting cap conditions : " + capCondResult.getErrorMessage()) ; return false }
    
    var ccs = capCondResult.getOutput();
        for (pc1 in ccs)
            {
            if (ccs[pc1].getConditionDescription().equals(cDesc))
                {
                var rmCapCondResult = aa.capCondition.deleteCapCondition(itemCap,ccs[pc1].getConditionNumber()); 
                if (rmCapCondResult.getSuccess())
                    logDebug("Successfully removed condition to CAP : " + itemCap + "  (" + cType + ") " + cDesc);
                else
                    logDebug( "**ERROR: removing condition to Parcel " + parcelNum + "  (" + cType + "): " + addParcelCondResult.getErrorMessage());
                }
            }
    }

 
function clearPageSectionData(stepIndex, pageIndex)
{
    var capID = capModel.getCapID();
    
    var pageComponents = getPageComponents(capID, stepIndex, pageIndex);
    
    if(pageComponents != null && pageComponents.length > 0)
    {
        for(var i= 0; i< pageComponents.length; i++)
        {           
            clearDataByComponentName(pageComponents[i].getComponentSeqNbr(), pageComponents[i].getComponentName());
        }
        
        aa.acaPageFlow.hideCapPage4ACA(capID, stepIndex, pageIndex);
    }
}

function clearDataByComponentName(componentSeqNbr, componentName)
{
    var componentAliasName = getComponentAliasName(componentName);
    if(componentAliasName != null)
    {
        var dailyComponentName = componentAliasName+"_"+componentSeqNbr;
        if(componentAliasName.indexOf("MultiLicenses")==0 || componentAliasName.indexOf("License") == 0)
        {
            clearLPData(dailyComponentName);
        }
        else if(componentAliasName.indexOf("MultiContacts")==0 || componentAliasName.indexOf("Contact1") == 0
                || componentAliasName.indexOf("Contact2") == 0 || componentAliasName.indexOf("Contact3") == 0
                || componentAliasName.indexOf("Applicant") == 0)
        {
            clearContactData(dailyComponentName);
        }
    }   
}

function clearParcelData(dailyComponentName)
{
        var parcel = capModel.getParcelModel();
        if(parcel.getComponentName() != null && parcel.getComponentName().indexOf(dailyComponentName)==0)
        {
            capModel.setParcelModel(null);
        }
}

function clearContactData(dailyComponentName)
{
        var contactList = capModel.getContactsGroup();
        if(contactList != null && contactList.size() > 0)
        {
            for(var i=contactList.size(); i > 0; i--)
            {
                var contactModel = contactList.get(i-1);
                if(contactModel.getComponentName() != null && contactModel.getComponentName().indexOf(dailyComponentName)==0)
                {
                    contactList.remove(contactModel);
                }
            }
        }
}

function clearLPData(dailyComponentName)
{
        var lpList = capModel.getLicenseProfessionalList();
        if(lpList != null && lpList.size() > 0)
        {
            for(var i=lpList.size(); i > 0; i--)
            {
                var lpModel = lpList.get(i-1);
                if(lpModel.getComponentName() != null && lpModel.getComponentName().indexOf(dailyComponentName)==0)
                {
                    lpList.remove(lpModel);
                }
            }
        }
        
        var licenseProfessionalModel = capModel.getLicenseProfessionalModel();
        if(licenseProfessionalModel != null)
        {
            if(licenseProfessionalModel.getComponentName() != null 
                    && licenseProfessionalModel.getComponentName().indexOf(dailyComponentName)==0)
            {
                    capModel.setLicenseProfessionalModel(null);
            }
        }  
}

function getComponentAliasName(componentName)
{
    if(componentNames==null)
    {
        return null;
    }
    else
    {
        for(var i=0;i<componentNames.length;i++){
            if(componentNames[i]==componentName)
            {
                return componentAliasNames[i];
            }
        }
        return null;
    }
}

function getPageComponents(capID, stepIndex, pageIndex)
{
    var componentResult = aa.acaPageFlow.getPageComponents(capID, stepIndex, pageIndex);
    
    if(componentResult.getSuccess())
    {
        return componentResult.getOutput();
    }
    
    return null;    
}


function setFieldValue(fieldName, asiGroups, value)
{     
        if(asiGroups == null)
        {
            return null;
        }
        
    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext())
    {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null)
        {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                var field = iteFields.next();              
                if (fieldName == field.getCheckboxDesc())
                {
                     field.setChecklistComment(value);
                     group.setFields(fields);
                }
            }
        }
    }   
    return asiGroups;   
}

function comment(cstr) {
    if (showDebug) logDebug(cstr);
    if (showMessage) logMessage(cstr);
}

function logMessage(dstr) {
    message+=dstr + br;
}

function clearConditions(capIdMod) {
    //aa.debug("Inside Function, Cap Id Model", capIdMod);
    var getFromCondResult = aa.capCondition.getCapConditions(capIdMod);
    //aa.debug("Inside Function, getFromCondResult", getFromCondResult);

    if (getFromCondResult.getSuccess()) {
        var condA = getFromCondResult.getOutput();
        //aa.debug("getFromCond Results returned", condA.length);

        for (cc in condA) {

            var thisC = condA[cc];

            aa.capCondition.deleteCapCondition(capIdMod, thisC.getConditionNumber());
        }
    }
}

function removeAllRequiredDocumentCapCondition()
{
    //delete documents
   var entityModel = aa.proxyInvoker.newInstance("com.accela.v360.document.EntityModel").getOutput();
   entityModel.setServiceProviderCode('AURORACO');
   entityModel.setEntityType("TMP_CAP");
   entityModel.setEntityID(capId);

   var documentlist = aa.document.getDocumentListByEntity(capId, 'TMP_CAP').getOutput();
   var documentBiz = aa.proxyInvoker.newInstance("com.accela.aa.ads.ads.DocumentBusiness").getOutput();

   for (var d = 0; d < documentlist.size(); d ++ )
   {
      var documentItem = documentlist.get(d);
      documentBiz.removeDocument4Partial(entityModel, 'AURORACO', documentItem.getDocumentNo());
   }
   
   //delete conditions
   var result = aa.capCondition.getCapConditions(capId);
   var condMap = {};
   var conditions = {};
   var capConds = result.getOutput();
   for(var i = 0; i < capConds.length; i ++ )
   {
      aa.capCondition.deleteCapCondition(capId, capConds[i].getConditionNumber());
   }
}

function addRequiredDocument(DocumentName)
{
    var capConditionScriptModel = aa.capCondition.getNewConditionScriptModel().getOutput();
    capConditionScriptModel.setCapID(capId)
    capConditionScriptModel.setConditionGroup("Required Document")
    capConditionScriptModel.setConditionType("Required Document")
    capConditionScriptModel.setConditionDescription(DocumentName)
    capConditionScriptModel.setImpactCode("Notice")
    capConditionScriptModel.setConditionStatus("Applied")
    capConditionScriptModel.setInheritable("N")
    capConditionScriptModel.setConditionComment(DocumentName)
    var result = aa.capCondition.createCapCondition(capConditionScriptModel);
    if (result.getSuccess())
        logDebug("Successfully add Cap Condition to: " + capId + " (Required Document) " + DocumentName );
    else
        logDebug( "**ERROR: Add Cap Condition to:" + capId + " (Required Document): " + result.getErrorMessage());
}

