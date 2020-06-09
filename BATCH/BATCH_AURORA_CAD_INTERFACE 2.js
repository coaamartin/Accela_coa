/*------------------------------------------------------------------------------------------------------/
| Program		: BATCH_AURORA_CAD_INTERFACE_2.js
| Event			: BATCH_AURORA_CAD_INTERFACE
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MDEEB
| Created at	: 12/03/2018 12:17:36
| Updated by    : Ray Province
| Updated at    : 6/9/2020
/------------------------------------------------------------------------------------------------------*/
var Script_Name = "BATCH_AURORA_CAD_INTERFACE 2";
var myThread = aa.proxyInvoker.newInstance("java.lang.Thread").getOutput();
var cType = "APD Caution";
var cStatus = "Enabled";
var dbName = "jetspeed";
var sysDate = aa.date.getCurrentDate();
var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
var systemUserObj = null; // Current User Object

//var cadDatabase = "[dbo.sp_st]";
var accelaDatabase = "[ACP_Accela]";



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
try {
	LogBatchDebug("DEBUG", "Start BATCH_AURORA_CAD_INTERFACE", false);

	var arrParameters = new Array();
	arrParameters[0] = 'caution';

	aa.print("here");
	// Retrieve matching addresses between CAD and AURORA.
	var getMatchingAddresses = buildGetMatchingAddressesQuery();
	//SKIP var matchingAddressesSet = aa.util.select(dbName, getMatchingAddresses, arrParameters);

//----------------------------------------------------------------

	aa.print('---------------------------------------------------------------');
	aa.print(getMatchingAddresses);
	aa.print('---------------------------------------------------------------');

	
//----------------------------------------------------------------

	
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

			//aa.print(lineout);
            //acctsToProcess.push(acctId);
            //break; //TESTING
			
			
			 //LogBatchDebug("DEBUG", "CAD Address " + houseNumber + " " + streetDirection + " " + streetName + " " + streetType+ " " + houseUnit, false)
			 //LogBatchDebug("DEBUG","AUR Address "+ aurHouseNumber + " " + aurStreetDirection + " " + aurStreetName + " " + aurStreetType + " " + aurHouseUnit,false)

			 aa.print("CAD Address: " + houseNumber + " " + streetDirection + " " + streetName + " " + streetType+ " " + houseUnit);
			 aa.print("AUR Address: "+ aurHouseNumber + " " + aurStreetDirection + " " + aurStreetName + " " + aurStreetType + " " + aurHouseUnit);
			 
			 // Accela matching address cannot be located from a CAD address
			 if (aurHouseNumber == null && aurStreetDirection == null && aurStreetName == null && aurStreetType == null) {
				 //LogBatchDebug("DEBUG","Accela matching address cannot be located from a CAD address : "+ houseUnit + " " + houseNumber + " "+ streetName + " " + streetDirection+ " " + streetType);
			 } else {
				 aa.print("***** FOUND A MATCH. Creating Condition *****");
				 addSTDCondition(refAddressNumber);
			 }
			 //LogBatchDebug("DEBUG","--------------------------------------------------------------------------------------------------------",false)			
			
        }
        sStmt.close();
        conn.close();
	
//----------------------------------------------------------------	
	 //if (matchingAddressesSet.getSuccess()) {
		// matchingAddressesSet = matchingAddressesSet.getOutput();
		// if (matchingAddressesSet != null && matchingAddressesSet.size() > 0) {
			// for (var i = 0; i < matchingAddressesSet.size(); i++) {
				
				// //CAD Fields.
				// var houseNumber = matchingAddressesSet.get(i).get("st_num");
				// var streetDirection = matchingAddressesSet.get(i).get("dirpre");
				// var streetName = matchingAddressesSet.get(i).get("feanme");
				// var streetType = matchingAddressesSet.get(i).get("featyp");
				// var houseUnit = matchingAddressesSet.get(i).get("lv_apt");
				
				// //AURORAFields
				// var refAddressNumber = matchingAddressesSet.get(i).get("l1_address_nbr");
                // var aurHouseNumber = matchingAddressesSet.get(i).get("l1_hse_nbr_start");
                // var aurStreetDirection  = matchingAddressesSet.get(i).get("l1_str_dir");
                // var aurStreetName  = matchingAddressesSet.get(i).get("l1_str_name");
                // var aurStreetType  = matchingAddressesSet.get(i).get("l1_str_suffix");
                // var aurHouseUnit = matchingAddressesSet.get(i).get("l1_unit_start");
                
				// LogBatchDebug("DEBUG", "CAD Address " + houseNumber + " "
						// + streetDirection + " " + streetName + " " + streetType+ " " + houseUnit, false)
                // LogBatchDebug("DEBUG","AUR Address "+ aurHouseNumber + " "
                		// + aurStreetDirection + " " + aurStreetName + " " + aurStreetType + " " + aurHouseUnit,false)
                		
                // // Accela matching address cannot be located from a CAD address
				// if (aurHouseNumber == null && aurStreetDirection == null && aurStreetName == null && aurStreetType == null) {
					// LogBatchDebug("DEBUG","Accela matching address cannot be located from a CAD address : "+ houseUnit + " " + houseNumber + " "+ streetName + " " + streetDirection+ " " + streetType);
				// } else {
					// //addSTDCondition(refAddressNumber);
				// }
				// LogBatchDebug("DEBUG","--------------------------------------------------------------------------------------------------------",false)
			// }
		// }
	// } else {
		// LogBatchDebug("ERROR", matchingAddressesSet.getErrorMessage(), false);
	// }
//----------------------------------------------------------------	

	deleteCadRows();
		
//----------------------------------------------------------------	

	// Remove Conditions with APD Caution type.that did not have a match on the input daily CAD address.
//SKIP FOR NOW	
	// var cadQuery = getRemovedCADAddresses();
	// var cadArr = new Array()
	// cadArr[0] = "APD Caution";
	// var cadDeletedSet = aa.util.select(dbName, cadQuery, cadArr);
	// if (cadDeletedSet.getSuccess()) {
		// cadDeletedSet = cadDeletedSet.getOutput();
		// if (cadDeletedSet != null && cadDeletedSet.size() > 0) {
			// for (var i = 0; i < cadDeletedSet.size(); i++) {
				// var refAddrID = cadDeletedSet.get(i).get("l1_address_nbr");
				// var conId = cadDeletedSet.get(i).get("l1_con_nbr");
				// LogBatchDebug("DEBUG", "Aurora Address ID to be remove: " + refAddrID);
				// aa.addressCondition.removeAddressCondition(refAddrID, conId);
			// }
		// }
	// }
	

//----------------------------------------------------------------		

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
        
        while (rSet.next()) {
			
			
			 var refAddrID = rSet.getString("l1_address_nbr");
			 var conId = rSet.getString("l1_con_nbr");
			

			aa.print("refAddrID: " + refAddrID);
			
        }
        sStmt.close();
        conn.close();
	
}



//Get matching addresses between CAD and AURORA.
function buildGetMatchingAddressesQuery()
{

	//var textSql = "select name from sys.tables where name <> ?";
	//var textSql = "select name from sys.tables";
	//return textSql;

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
	
	//matchingAddresses +=" FROM [CADTest].[dbo].[sp_st] ST";
	matchingAddresses +=" FROM [dbo].[sp_st] ST";
	//matchingAddresses +=" FROM " + accelaDatabase + "[dbo].[L3ADDRES] L3A";

	//matchingAddresses +=" left join [Accela].[dbo].[L3ADDRES] L3A";
	matchingAddresses +=" left join " + accelaDatabase + ".[dbo].[L3ADDRES] L3A";
	//matchingAddresses +=" left join " + cadDatabase + ".[dbo].[sp_st] ST";
	
	matchingAddresses +=" ON ST.st_num = L3A.l1_hse_nbr_start";
	matchingAddresses +=" AND ST.dirpre = L3A.l1_str_dir";
	matchingAddresses +=" AND ST.feanme = L3A.l1_str_name";
	matchingAddresses +=" AND ST.featyp = L3A.l1_str_suffix";
	matchingAddresses +=" AND (ST.lv_apt = isnull(L3A.l1_unit_start,'') or ST.lv_apt = '' AND ISNULL(L3A.l1_unit_start,'') <> '')";
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

	//cadQuery += " FROM [Accela].[dbo].[L3ADDRES] L3A";
	cadQuery += " FROM " + accelaDatabase + ".[dbo].[L3ADDRES] L3A";
	
	//cadQuery += " INNER JOIN [Accela].[dbo].[L3ADDRES_CONDIT] L3AC";
	cadQuery += " INNER JOIN " + accelaDatabase + ".[dbo].[L3ADDRES_CONDIT] L3AC";
	
	cadQuery += " ON L3A.L1_ADDRESS_NBR = L3AC.L1_ADDRESS_NBR";
	cadQuery += " AND L3AC.L1_CON_TYP = ?";
	cadQuery += " AND L3AC.REC_STATUS ='A'";
	
	//cadQuery += " LEFT JOIN [CADTest].[dbo].[sp_st] ST";
	//cadQuery += " LEFT JOIN " + cadDatabase + ".[dbo].[sp_st] ST";
	
	//cadQuery += " ON L3A.l1_hse_nbr_start = ST.st_num";
	  cadQuery += " ON L3A.l1_hse_nbr_start = "
		+"	case when ST.st_num is null or isnumeric(ST.st_num) = 0 then 0 "
		+"	else convert(int,ST.st_num) end"; 	
	
	cadQuery += " AND L3A.l1_str_dir = ST.dirpre"
	cadQuery += " AND L3A.l1_str_name = ST.feanme";
	cadQuery += " AND L3A.l1_str_suffix = ST.featyp";
	cadQuery += " AND (L3A.l1_unit_start = ST.lv_apt or L3A.l1_unit_start IS NULL or L3A.l1_unit_start IS NOT NULL)";
	cadQuery += " WHERE ST.CDTS IS NULL";
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
				LogBatchDebug("DEBUG","Already Exist condition to reference address Id  "
								+ refAddressNumber);
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
				LogBatchDebug("DEBUG","Successfully added condition to reference address Id "
								+ refAddressNumber + " " + "");
			}
		}
	}
}
LogBatchDebug("DEBUG", "End BATCH_AURORA_CAD_INTERFACE");