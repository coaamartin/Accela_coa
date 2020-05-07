var SCRIPT_VERSION = "3.0";
var BATCH_NAME = "";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
var currentUserID = "ADMIN";
function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode)
        servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}
logMessage = function (etype, edesc) {
    aa.print(etype + " : " + edesc);
}
logDebug = function (edesc) {
    if (showDebug) {
        aa.print("DEBUG : " + edesc);
    }
}
/*------------------------------------ USER PARAMETERS ---------------------------------------*/
var group = aa.env.getValue("Group");
var type = aa.env.getValue("Type");
var subtype = aa.env.getValue("SubType");
var cat = aa.env.getValue("Category");
/*Testing
group = "Fire";
type = "Complaint";
subtype = "NA";
cat = "NA";
/*------------------------------------ END OF USER PARAMETERS --------------------------------*/

var showDebug = true; // Set to true to see debug messages
var maxSeconds = 5 * 60; // number of seconds allowed for batch processing,
// usually < 5*60
var startDate = new Date();
var timeExpired = false;
var startTime = startDate.getTime(); // Start timer
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var servProvCode = aa.getServiceProviderCode();
var capId = null;
var altId = "";
var s = 0;
var records = getRecords(group, type, subtype, cat) || new Array();
logDebug("Retrieved this many records: " + records.length);
logMessage("START", "Start of Job");
if (!timeExpired) mainProcess();
logMessage("END", "End of Job: Elapsed Time : " + elapsed() + " Seconds");


function mainProcess() {  

    for (var r in records)
    {
        capId = records[r];
        altId = capId.getCustomID();
        var addressArray = new Array();
        loadAddressAttributes(addressArray);

        var fireStation = _getRefAddressAttributeValue("FIRESTATION");
        var inspector = lookup("FIRE STATION", fireStation);
        if (inspector)
        {
            var inspResults = aa.inspection.getInspections(capId);
            if (inspResults.getSuccess())
            {
                var inspAll = inspResults.getOutput();
                var inspectionId;
                for (ii in inspAll)
                {
                    if (inspAll[ii].getDocumentDescription().equals("Insp Scheduled") && inspAll[ii].getAuditStatus().equals("A"))                        
                    {
                        inspectionId = inspAll[ii].getIdNumber();
                        _assignInspection(inspectionId, inspector);
                    }
                }
            }
        }
        
        

    }
}
function _getRefAddressAttributeValue(attrName){
    var capAddResult = aa.address.getAddressByCapId(capId);
    if (capAddResult.getSuccess())
    {
        var Adds = capAddResult.getOutput();
        for (zz in Adds)
        {
            var fcapAddressObj = Adds[zz];
            var addRefId = fcapAddressObj.getRefAddressId();
            var searchResult = aa.address.getRefAddressByPK(addRefId).getOutput();
            if (!searchResult)
                continue;
            var addressAttr = searchResult.getRefAddressModel().getAttributes();
            addressAttrObj = addressAttr.toArray();
            for (z in addressAttrObj){
                if(addressAttrObj[z].getName().equals(attrName)){
                    return addressAttrObj[z].getValue()
                }
            }
        }
    }
    return false;
}
function _assignInspection(iNumber, iName) {
	// optional capId
	// updates the inspection and assigns to a new user
	// requires the inspection id and the user name
	// V2 8/3/2011.  If user name not found, looks for the department instead
	//

	var itemCap = capId
		if (arguments.length > 2)
			itemCap = arguments[2]; // use cap ID specified in args

		iObjResult = aa.inspection.getInspection(itemCap, iNumber);
	if (!iObjResult.getSuccess()) {
		logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
		return false;
	}

	iObj = iObjResult.getOutput();

	iInspector = aa.person.getUser(iName).getOutput();

	if (!iInspector) // must be a department name?
	{
		var dpt = aa.people.getDepartmentList(null).getOutput();
		for (var thisdpt in dpt) {
			var m = dpt[thisdpt]
				if (iName.equals(m.getDeptName())) {
					iNameResult = aa.person.getUser(null, null, null, null, m.getAgencyCode(), m.getBureauCode(), m.getDivisionCode(), m.getSectionCode(), m.getGroupCode(), m.getOfficeCode());

					if (!iNameResult.getSuccess()) {
						logDebug("**WARNING retrieving department user model " + iName + " : " + iNameResult.getErrorMessage());
						return false;
					}

					iInspector = iNameResult.getOutput();
				}
		}
	}

	if (!iInspector) {
		logDebug("**WARNING could not find inspector or department: " + iName + ", no assignment was made");
		return false;
	}
	else
	{
		if(iInspector.getFirstName() == null)
		{
			iInspector.setFirstName("");
		}
		if(iInspector.getMiddleName() == null)
		{
			iInspector.setMiddleName("");
		}
		if(iInspector.getLastName() == null)
		{
			iInspector.setLastName("");
		}	
		if(iInspector.getGaUserID() == null)
		{
			iInspector.setGaUserID("");
		}
		if(iInspector.getUserID() == null)
		{
			iInspector.setUserID("");
		}
	}

	logDebug(altId + ": assigning inspection " + iNumber + " to " + iName);

	iObj.setInspector(iInspector);

	if (iObj.getScheduledDate() == null) {
		iObj.setScheduledDate(sysDate);
	}

	aa.inspection.editInspection(iObj)
}

function lookup_silent(stdChoice,stdValue) 
{
    var strControl;
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);

    if (bizDomScriptResult.getSuccess())
        {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
        }
    return strControl;
}
function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}
 function getRecords(group, type, subtype, cat)
 {
    var sql = "SELECT DISTINCT B1_ALT_ID FROM B1PERMIT B WHERE B.SERV_PROV_CODE = 'AURORACO'";
    if (!isBlank(group))
        sql += " AND UPPER(B1_PER_GROUP) = '$$group$$'".replace("$$group$$", group.toUpperCase());
    if (!isBlank(type))
        sql += " AND UPPER(B1_PER_TYPE) = '$$type$$'".replace("$$type$$", type.toUpperCase());
    if (!isBlank(subtype))
        sql += " AND UPPER(B1_PER_SUB_TYPE) = '$$subtype$$'".replace("$$subtype$$", subtype.toUpperCase());
    if (!isBlank(cat))
        sql += " AND UPPER(B1_PER_CATEGORY) = '$$cat$$'".replace("$$cat$$", cat.toUpperCase());
    aa.print("SQL is " + sql);
    var array = new Array();
    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();
       while (rSet.next()) {
            var obj = {};
            var md = rSet.getMetaData();
            var columns = md.getColumnCount();
            for (i = 1; i <= columns; i++) {
                var thiscapId = aa.cap.getCapID(String(rSet.getString(md.getColumnName(i)))).getOutput();
                array.push(thiscapId);
            }
        }

        return array;

    } catch (err) {
        aa.print(err.message);
    }    
    finally
    {   
        if (rSet)
            rSet.close();
        if (sStmt)
            sStmt.close();
        if (conn)
            conn.close();        
    }
 }