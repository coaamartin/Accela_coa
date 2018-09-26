/*------------------------------------------------------------------------------------------------------/
| Program		: BATCH_AURORA_CAD_INTERFACE.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MDEEB
| Created at	: 12/03/2018 12:17:36
| Modified at	: 12/05/2018 12:26 - Louis. Changed fixed query sql. Refactored to remove aa.util.select 
| Modified      : 2018.09.25 19:56 - Louis. Modified query in getRemovedCADAddresses()
/------------------------------------------------------------------------------------------------------*/
var Script_Name = "BATCH_AURORA_CAD_INTERFACE";
var myThread = aa.proxyInvoker.newInstance("java.lang.Thread").getOutput();
var cType = "APD Caution";
var cStatus = "Enabled";
var dbName = "jetspeed";
var sysDate = aa.date.getCurrentDate();
var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
var systemUserObj = null; // Current User Object

//cadDatabase = aa.env.getValue("CAD_database");
//accelaDatabase = aa.env.getValue("Accela_database");	
var cadDatabase =  "";  // "[CADTRAININGCAD.E911.COA].[cadtrain]";
var accelaDatabase = "";  // "[ACPTest_Accela]";

var scriptTime = "Script updated: 2018.05.21 12:26 PST";

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness")
			.getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

function LogBatchDebug(etype, edesc, createEventLog) {

	var msg = etype + " : " + edesc;

	if (etype == "ERROR") {
		msg = "<font color='red' size=2>" + msg + "</font><BR>"
	} else {
		msg = "<font color='green' size=2>" + msg + "</font><BR>"
	}
	if (etype == "DEBUG") {

		aa.print(msg);

	} else {
		aa.print(msg);
	}
	debug += msg;
}

/*----------------------------------------------------------------------------------------------------/
| MAIN
/------------------------------------------------------------------------------------------------------*/
try {
	LogBatchDebug("DEBUG", "Start BATCH_AURORA_CAD_INTERFACE", false);
	LogBatchDebug("DEBUG", scriptTime, false);

	//----------------------------------------------------------------
	//	Batch parameters:
	//----------------------------------------------------------------

	cadDatabase = aa.env.getValue("CAD_database");
	accelaDatabase = aa.env.getValue("Accela_database");	

	aa.print('CAD_database: ' + cadDatabase);
	aa.print('Accela_database: ' + accelaDatabase);
	
	var arrParameters = new Array();
	arrParameters[0] = 'caution';

	aa.print("here");
	// Retrieve matching addresses between CAD and AURORA.
	var getMatchingAddresses = buildGetMatchingAddressesQuery();

	aa.print('---------------------------------------------------------------');
	aa.print(getMatchingAddresses);
	aa.print('---------------------------------------------------------------');

        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(getMatchingAddresses);
		sStmt.setString(1, 'caution');
        var rSet = sStmt.executeQuery();
        
        while (rSet.next()) {
			
			var housenumber = rSet.getString("st_num");
			var streetdirection = rSet.getString("dirpre");
			var streetname = rSet.getString("feanme");

			//CAD Fields.
			var houseNumber = rSet.getString("st_num");
			var streetDirection = rSet.getString("dirpre");
			var streetName = rSet.getString("feanme");
			var streetType = rSet.getString("featyp");
			var houseUnit = rSet.getString("lv_apt");
			
			//AURORAFields
			var refAddressNumber = rSet.getString("l1_address_nbr");
			var aurHouseNumber = rSet.getString("l1_hse_nbr_start");
			var aurStreetDirection  = rSet.getString("l1_str_dir");
			var aurStreetName  = rSet.getString("l1_str_name");
			var aurStreetType  = rSet.getString("l1_str_suffix");
			var aurHouseUnit = rSet.getString("l1_unit_start");
                

			CADfields = "CAD: " + housenumber + " " + streetdirection + " " + streetname;
			AAfields = "AA:" + refAddressNumber + " " + aurHouseNumber + " " + aurStreetDirection + " " + aurStreetName;
			lineout = CADfields + " | " + AAfields;

			 // Accela matching address cannot be located from a CAD address
			 if (aurHouseNumber == null && aurStreetDirection == null && aurStreetName == null && aurStreetType == null) {
				 //LogBatchDebug("DEBUG","Accela matching address cannot be located from a CAD address : "+ houseUnit + " " + houseNumber + " "+ streetName + " " + streetDirection+ " " + streetType);
			 } else {

			 aa.print("***** FOUND A MATCH. Creating Condition *****");
			 aa.print("CAD Address: " + houseNumber + " " + streetDirection + " " + streetName + " " + streetType+ " " + houseUnit);
			 aa.print("AUR Address: "+ aurHouseNumber + " " + aurStreetDirection + " " + aurStreetName + " " + aurStreetType + " " + aurHouseUnit);

			 addSTDCondition(refAddressNumber);
			 }
			
        }
        sStmt.close();
        conn.close();
	
	// Remove Conditions with APD Caution type.that did not have a match on the input daily CAD address.
	deleteCadRows();


} catch (err) {
	LogBatchDebug("ERROR",
			"Stopped batch processing BATCH_AURORA_CAD_INTERFACE" + err, false);
}

function deleteCadRows()
{
	 var cadQuery = getRemovedCADAddresses();

	aa.print('---------------------------------------------------------------');
	aa.print(cadQuery);
	aa.print('---------------------------------------------------------------');

        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(cadQuery);
		sStmt.setString(1, 'APD Caution');
        var rSet = sStmt.executeQuery();
        var counter = 0;
        while (rSet.next()) {
			counter = counter + 1;
			var refAddrid = rSet.getString("l1_address_nbr");
			var conId = rSet.getString("l1_con_nbr");
			
			aa.print("Deleting refAddrid: " + refAddrid);
			LogBatchDebug("DEBUG", "Caution record on Aurora Address ID will be removed: " + refAddrid);			
			LogBatchDebug("DEBUG", "Condition is: " + conId);
			aa.addressCondition.removeAddressCondition(refAddrid, conId);
        }
        sStmt.close();
        conn.close();
	    LogBatchDebug("DEBUG", "Caution records deleted on cleanup:" + counter);
}



//Get matching addresses between CAD and AURORA.
function buildGetMatchingAddressesQuery()
{
	var matchingAddresses = "WITH CT AS (";
	matchingAddresses +=" SELECT ROW_NUMBER() OVER(PARTITION BY ST.st_num,ST.dirpre,ST.feanme,ST.featyp,ST.lv_apt ORDER BY L3A.l1_unit_start) AS RID,";
	matchingAddresses +=" ST.st_num,";
	matchingAddresses +=" ST.dirpre,";
	matchingAddresses +=" ST.feanme,";
	matchingAddresses +=" ST.featyp,";
	matchingAddresses +=" ST.lv_apt,";
	matchingAddresses +=" L3A.l1_hse_nbr_start,";
	matchingAddresses +=" L3A.l1_str_dir,";
	matchingAddresses +=" L3A.l1_str_name,";
	matchingAddresses +=" L3A.l1_str_suffix,";
	matchingAddresses +=" L3A.l1_unit_start,";
	matchingAddresses +=" L3A.l1_address_nbr";
	
	matchingAddresses +=" FROM " + cadDatabase + ".[dbo].[sp_st] ST";
	matchingAddresses +=" left join " + accelaDatabase + ".[dbo].[L3ADDRES] L3A";
	
	matchingAddresses +=" ON ST.st_num = L3A.l1_hse_nbr_start";
	matchingAddresses +=" AND ST.dirpre = L3A.l1_str_dir";
	matchingAddresses +=" AND ST.feanme = L3A.l1_str_name";
	matchingAddresses +=" AND ST.featyp = L3A.l1_str_suffix";
	
	matchingAddresses +=" AND (";
	matchingAddresses +=" 		ISNULL(ST.lv_apt,'') = ISNULL(L3A.l1_unit_start,'') ";
	matchingAddresses +=" 		OR (ISNULL(ST.lv_apt,'') = '' AND ISNULL(L3A.l1_unit_start,'') <> '')";
	//matchingAddresses +=" 		OR (ISNULL(L3A.l1_unit_start,'') = '' AND ISNULL(ST.lv_apt,'') <> '')";
	matchingAddresses +="     )";
	
	matchingAddresses +=" where ST.ss_typ = ?";
	//matchingAddresses +=" where ST.ss_typ = 'caution'" ;
	matchingAddresses +=" AND (edts is null OR REPLACE(REPLACE(REPLACE(CAST(CONVERT(VARCHAR(19), GETDATE(), 120) AS VARCHAR(20)),'-',''),':',''),' ','') < edts)";
	matchingAddresses +=" )";
	matchingAddresses +=" SELECT * ";
	matchingAddresses +=" FROM CT";
	matchingAddresses +=" WHERE RID = 1";
	
    return matchingAddresses;
}

//Get addresses to be remove(It was removed from CAD).
function getRemovedCADAddresses()
{
	var cadQuery = "SELECT L3A.l1_address_nbr,L3AC.l1_con_nbr";
	cadQuery += " FROM " + accelaDatabase + ".[dbo].[L3ADDRES] L3A";
	cadQuery += " INNER JOIN " + accelaDatabase + ".[dbo].[L3ADDRES_CONDIT] L3AC";
	cadQuery += " ON L3A.L1_ADDRESS_NBR = L3AC.L1_ADDRESS_NBR";
	cadQuery += " AND L3AC.L1_CON_TYP = ?";
	cadQuery += " AND L3AC.REC_STATUS ='A'";
	cadQuery += " LEFT JOIN " + cadDatabase + ".[dbo].[sp_st] ST";
    cadQuery += " ON L3A.l1_hse_nbr_start = "
		+"	case when ST.st_num is null or isnumeric(ST.st_num) = 0 then 0 "
		+"	else convert(int,ST.st_num) end"; 	
	
	cadQuery += " AND L3A.l1_str_dir = ST.dirpre";
	cadQuery += " AND L3A.l1_str_name = ST.feanme";
	cadQuery += " AND L3A.l1_str_suffix = ST.featyp";
	cadQuery += " AND (L3A.l1_unit_start = ST.lv_apt or L3A.l1_unit_start IS NULL or L3A.l1_unit_start IS NOT NULL)";
	//cadQuery += " WHERE ST.CDTS IS NULL";
	cadQuery += " WHERE (ST.EDTS IS NOT NULL and REPLACE(REPLACE(REPLACE(CAST(CONVERT(VARCHAR(19), GETDATE(), 120) AS VARCHAR(20)),'-',''),':',''),' ','') > ST.EDTS)";
	return cadQuery;
}

//Add reference address.
function addSTDCondition(refAddressNbr)
{
	var addCondResult = aa.addressCondition.getAddressConditions(refAddressNbr)
	
	if (!addCondResult.getSuccess()) {
		var addrCondArray = new Array();
	} else {
		var addrCondArray = addCondResult.getOutput();
	}
    
	var condExist = false;
	if (addrCondArray != null && addrCondArray.length > 0) {
			for (y = 0; y < addrCondArray.length; y++) {
			var addrCond = addrCondArray[y];
			if (addrCond.getConditionType() == cType) {
				LogBatchDebug("DEBUG","Already existing condition for reference address Id: " + refAddressNumber);
				condExist = true;
			}
		}
	} 
		
	    if (!condExist) {
		var stdCond = aa.capCondition.getStandardConditions(cType, "").getOutput();
		for (x = 0; x < stdCond.length; x++) {
			var standardCond = stdCond[x];
			// Add a new Standard Condition Notice for the address
			var addAddCondResult = aa.addressCondition.addAddressCondition(refAddressNumber, standardCond.getConditionType(),
					standardCond.getConditionDesc(), standardCond.getConditionComment(), null, null, standardCond
							.getImpactCode(), cStatus, sysDate, null, sysDate,null, systemUserObj, systemUserObj);

			if (addAddCondResult.getSuccess()) {
				LogBatchDebug("DEBUG","Successfully added condition to reference address Id " + refAddressNumber + " " + "");
			}
		}
	}
}
LogBatchDebug("DEBUG", "End BATCH_AURORA_CAD_INTERFACE");