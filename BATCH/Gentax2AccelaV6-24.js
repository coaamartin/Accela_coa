/*------------------------------------------------------------------------------------------------------/
| Program: Licenses Update or create.0.js  Trigger: Batch
| Client : AURORA County
|
| Version 1.0 - Base Version. 6/29/2011 - Joseph Cipriano - TruePoint Solutions
|
| Script is run daily to import Gentex file.
|Alex comment to add.
Added to GitHub 6.24.21
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;					                                  // Set to true to see debug messages in event log and email confirmation
var maxSeconds = 240 * 60;				                                  // Number of seconds allowed for batch run, usually < 5*60
//Variables needed to log parameters below in eventLog
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
var gentaxfile = aa.env.getValue("GentaxFileName");
//Global variables

eval(getCustomScriptText("INCLUDES_CUSTOM"));

function getCustomScriptText(vScriptName, useProductScripts) {             
	
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		
		var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		
		return emseScript.getScriptText() + "";
		
	} catch (err) {
		return "";
	}
}

var batchStartDate = new Date();                                                         // System Date
var batchStartTime = batchStartDate.getTime();                                           // Start timer
var timeExpired = false;                                                                 // Variable to identify if batch script has timed out. Defaulted to "false".
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var useAppSpecificGroupName = true;                                                     // Use Group name when populating App Specific Info Values
var capId;                                                                               // Variable used to hold the Cap Id value.
var customId;                                                                            // Variable used to hold alternate Cap Id string value;
var senderEmailAddr = "noreply@accela.com";                                           // Email address of the sender
var emailAddress = "graf@truepointsolutions.com;";                                      // Email address of the person who will receive the batch script log information
var emailAddress2 = "ngraf@truepointsolutions.com;acharlton@truepointsolutions.com";                                    // CC email address of the person who will receive the batch script log information
var emailText = "";                                                                      // Email body
//Parameter variables
var paramsOK = true;
var today = jsDateToMMDDYYYY(convertDate(sysDate));

/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
"rprovinc@auroragov.org;lproch@auroragov.org;jwarthan@auroragov.org"

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/------------------------------------------------------------------------------------------------------*/

if (paramsOK)
        {
        logMessage("START","Start of Licenses Update or create Batch Job.");

        var licAboutToExpCnt = aboutExpLics();

        logMessage("INFO","Import ran successfully.");
	logMessage("END","End of Licenses Update or create Batch Job: Elapsed Time : " + elapsed() + " Seconds.");
	}

if (emailAddress.length)
	aa.sendMail(senderEmailAddr, emailAddress, emailAddress2, batchJobName + " Results from test for Licenses Update or create", emailText);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
function aboutExpLics()
	{
	path = gentaxfile;	
  //path = "GenTaxToAccelaDaily_1.xml"

var file = new java.io.File(path);
parseXML(file);
	}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - batchStartTime) / 1000)
}

// exists:  return true if Value is in Array
function exists(eVal, eArray) {
	  for (ii in eArray)
	  	if (eArray[ii] == eVal) return true;
	  return false;
}
function addParameter(parameters, key, value)
{
	if(key != null)
	{
		if(value == null)
		{
			value = "";
		}
		parameters.put(key, value);
	}
}

function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)
   	if (arguments[i] == eVal)
   		return true;

}

function isNull(pTestValue,pNewValue)
	{
	if (pTestValue==null || pTestValue=="")
		return pNewValue;
	else
		return pTestValue;
	}

function logMessage(etype,edesc) {
		aa.eventLog.createEventLog(etype, "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
	aa.print(etype + " : " + edesc);
	emailText+=etype + " : " + edesc + "<br />";
	}

function logDebug(edesc) {
	if (showDebug) {
		aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
		aa.print("DEBUG : " + edesc);
		emailText+="DEBUG : " + edesc + " <br />"; }
	}

function dateAdd(td,amt)
	// perform date arithmetic on a string
	// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
	// amt can be positive or negative (5, -3) days
	// if optional parameter #3 is present, use working days only
	{

	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td)
		dDate = new Date();
	else
		dDate = new Date(td);
	var i = 0;
	if (useWorking)
		if (!aa.calendar.getNextWorkDay)
			{
			logDebug("**ERROR","getNextWorkDay function is only available in Accela Automation 6.3.2 or higher.");
			while (i < Math.abs(amt))
				{
				dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * (amt > 0 ? 1 : -1)));
				if (dDate.getDay() > 0 && dDate.getDay() < 6)
					i++
				}
			}
		else
			{
			while (i < Math.abs(amt))
				{
				dDate = new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(dDate.getMonth()+1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
				i++;
				}
			}
	else
		dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * amt));

	return (dDate.getMonth()+1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
	}

function editAppSpecific(itemName,itemValue,capid)  // optional: itemCap
{
	var updated = false;
	var i=0;

	itemCap = capid;
	
  	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)

			{
                          logMessage("**WARNING","CAP # " + customId +", editAppSpecific requires group name prefix when useAppSpecificGroupName is true");
                          //logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ;
                          return false;
                        }

		var itemGroup = itemName.substr(0,itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".")+1);
	}
   	
   	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
 	{
		var appspecObj = appSpecInfoResult.getOutput();
		if (itemName != "")
		{
			while (i < appspecObj.length && !updated)
			{
				if (appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup))
				{
					appspecObj[i].setChecklistComment(itemValue);
						
					var actionResult = aa.appSpecificInfo.editAppSpecInfos(appspecObj);
					if (actionResult.getSuccess()) 
					{	
                                                //logMessage("INFO","CAP # " + customId +", App spec info item " + itemName + " has been given a value of " + itemValue);
						//logDebug("app spec info item " + itemName + " has been given a value of " + itemValue);
					}
					else 
					{
                                                logMessage("**ERROR","CAP # " + customId +", Setting the app spec info item " + itemName + " to " + itemValue + " .\nReason is: " +   actionResult.getErrorType() + ":" + actionResult.getErrorMessage());
						//logDebug("**ERROR: Setting the app spec info item " + itemName + " to " + itemValue + " .\nReason is: " +   actionResult.getErrorType() + ":" + actionResult.getErrorMessage());
					}
						
					updated = true;
					//AInfo[itemName] = itemValue;  // Update array used by this script
				}

				i++;
				
			} // while loop
		} // item name blank
	} // got app specific object	
	else
	{ 
		logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage());
	}
}
	
function createCap(pCapType, pAppName) 
	{
	// creates a new application and returns the capID object
	// 07SSP-00037/SP5017
	//
	var aCapType = pCapType.split("/");
	if (aCapType.length != 4)
		{
		logDebug("**ERROR in createCap.  The following Application Type String is incorrectly formatted: " + pCapType);
		return ("INVALID PARAMETER");
		}
	
	var appCreateResult = aa.cap.createApp(aCapType[0],aCapType[1],aCapType[2],aCapType[3],pAppName);
	//logDebug("Creating cap " + pCapType);
	
	if (!appCreateResult.getSuccess())
		{
		logDebug( "**ERROR: creating CAP " + appCreateResult.getErrorMessage());
		return false;
		}

	var newId = appCreateResult.getOutput();
	//logDebug("CAP of type " + pCapType + " created successfully ");
	var newObj = aa.cap.getCap(newId).getOutput();	//Cap object
	logDebug("capId " + newObj.getCapModel().getAltID() + " created successfully ");
	return newId;
	}
function updateExpirationDateandstatus(expDate,capid,expStatus)
{
var b1ExpResult = aa.expiration.getLicensesByCapID(capid)
   		if (b1ExpResult.getSuccess())
   			{
   			this.b1Exp = b1ExpResult.getOutput();
			var expAADate = aa.date.parseDate(expDate);
			this.b1Exp.setExpDate(expAADate);
			this.b1Exp.setExpStatus(expStatus);
			aa.expiration.editB1Expiration(this.b1Exp.getB1Expiration())
			}
			
}	

function convertDate(thisDate)
	{

	if (typeof(thisDate) == "string")
		{
		var retVal = new Date(String(thisDate));
		if (!retVal.toString().equals("Invalid Date"))
			return retVal;
		}

	if (typeof(thisDate)== "object")
		{

		if (!thisDate.getClass) // object without getClass, assume that this is a javascript date already
			{
			return thisDate;
			}

		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime"))
			{
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
			}
			
		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime"))
			{
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
			}			

		if (thisDate.getClass().toString().equals("class java.util.Date"))
			{
			return new Date(thisDate.getTime());
			}

		if (thisDate.getClass().toString().equals("class java.lang.String"))
			{
			return new Date(String(thisDate));
			}
		if (thisDate.getClass().toString().equals("class java.sql.Timestamp"))
			{
			return new Date(thisDate.getMonth() + "/" + thisDate.getDate() + "/" + thisDate.getYear());
			}
		}

	if (typeof(thisDate) == "number")
		{
		return new Date(thisDate);  // assume milliseconds
		}

	logDebug("**WARNING** convertDate cannot parse date : " + thisDate);
	return null;

	}
function jsDateToMMDDYYYY(pJavaScriptDate)
	{
	//converts javascript date to string in MM/DD/YYYY format
	//
	if (pJavaScriptDate != null)
		{
		if (Date.prototype.isPrototypeOf(pJavaScriptDate))
	return (pJavaScriptDate.getMonth()+1).toString()+"/"+pJavaScriptDate.getDate()+"/"+pJavaScriptDate.getFullYear();
		else
			{
			logDebug("Parameter is not a javascript date");
			return ("INVALID JAVASCRIPT DATE");
			}
		}
	else
		{
		logDebug("Parameter is null");
		return ("NULL PARAMETER VALUE");
		}
	}

	
function parseXML(file) {
            var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
            var document = saxBuilder.build(file);
            var xmlWCRDataset = document.getRootElement(); //Root element i.e. <WCR_DATASET>...</WCR_DATASET>
            var xmlWCRList = xmlWCRDataset.getChildren(); //Array where each element is a WCR i.e. array of <WCR>...</WCR>
            var parsedWCR = {}; // Associative array of parsed WCR fields and interval arrays
            for (var ii = 0; ii < xmlWCRList.size() ; ii++) {
				
				var xmlWCR = xmlWCRList.get(ii);  //Single WCR element i.e. <WCR>...</WCR>				

				if (xmlWCR.getChild("Demographics").getValue() != null && xmlWCR.getChild("Demographics").getValue() != "" && xmlWCR.getChild("Demographics").getValue() != "undefined")
				{
					var demo = xmlWCR.getChild("Demographics").getChildren();
					
					for (var a = 0; a < demo.size() ; a++) 
					{
					var demo1 = demo.get(a);
	                var parsedWCRElementWithChildrend = {};
                                         var c = demo1.getChildren();
                                         for (var b = 0; b < c.size() ; b++) {
                            var parsedElementWithChildrend = c.get(b);
							parsedWCRElementWithChildrend["Demo"+ parsedElementWithChildrend.getName()] = parsedElementWithChildrend.getValue();
							parsedWCRElementWithChildrend["DemoGen"] = xmlWCR.getChild("Demographics").getChild("GenTaxID").getValue();
							parsedWCRElementWithChildrend["DemoName"] = xmlWCR.getChild("Demographics").getChild("Name").getValue();
				
	
                       
					}

				}
	
				}
				if (xmlWCR.getChild("Licenses").getValue() != null && xmlWCR.getChild("Licenses").getValue() != "" && xmlWCR.getChild("Licenses").getValue() != "undefined")
				{
					


					
					var licenses = xmlWCR.getChild("Licenses").getChildren();
                    

					for (var j = 0; j < licenses.size() ; j++) 
					{
					var licenses1 = licenses.get(j);
	                var parsedWCRElementWithChildren = {};
                                         var l = licenses1.getChildren();
                                         for (var k = 0; k < l.size() ; k++) {

                            var parsedElementWithChildren = l.get(k);
							
							parsedWCRElementWithChildren[parsedElementWithChildren.getName()] = parsedElementWithChildren.getValue();

							
					}
					for (x in parsedWCRElementWithChildren)
				{
					refad = getrefaddressID(parsedWCRElementWithChildren["GISAddressID"]);
					if (x == "SiteID")
					{
						test = aa.cap.getCapID(parsedWCRElementWithChildren["SiteID"]);
						if(test.getSuccess())
						{
							newcapId = test.getOutput();
							
							var contest = aa.people.getCapContactByCapID(newcapId);
							if(contest.getSuccess())
							{
								var Contacts = contest.getOutput();
								for (yy in Contacts)
								{
							removeResult = aa.people.removeCapContact(newcapId, Contacts[yy].getPeople().getContactSeqNumber());
								}
					
							}
							if(refad != "" && refad != null && parsedWCRElementWithChildren["GISAddressID"] != null && parsedWCRElementWithChildren["GISAddressID"] != "")
							{
								var ad = aa.address.getRefAddressByPK(refad).getOutput();
								var refadmodel = ad.getRefAddressModel();
								if(parsedWCRElementWithChildren["UnitType"] && parsedWCRElementWithChildren["UnitType"].length() > 0)
										{
                                            refadmodel.setUnitType(parsedWCRElementWithChildren["UnitType"]);
										}
										if(parsedWCRElementWithChildren["Unit"] && parsedWCRElementWithChildren["Unit"].length() > 0)
										{
                                            refadmodel.setUnitStart(parsedWCRElementWithChildren["Unit"]);
										}

								aa.address.editAddressWithRefAddressModelWithLogic(newcapId,refadmodel);
								aa.print("Successfully updated " + parsedWCRElementWithChildren["SiteID"] + " from reference address");
							}
							else
							{	
							var addr = aa.address.getAddressWithAttributeByCapId(newcapId);
							if(addr.getSuccess())
							{
								var ad = addr.getOutput();
								if(parsedWCRElementWithChildren["StreetNumber"] && parsedWCRElementWithChildren["StreetNumber"].length() > 0)
										{
                                        ad[0].setHouseNumberStart(parseFloat(parsedWCRElementWithChildren["StreetNumber"]));
										}
										if(parsedWCRElementWithChildren["StreetName"] && parsedWCRElementWithChildren["StreetName"].length() > 0)
										{
                                        ad[0].setStreetName(parsedWCRElementWithChildren["StreetName"] );
										}
										if(parsedWCRElementWithChildren["StreetType"] && parsedWCRElementWithChildren["StreetType"].length() > 0)
										{
                                        ad[0].setStreetSuffix(parsedWCRElementWithChildren["StreetType"]);
										}
										if(parsedWCRElementWithChildren["City"] && parsedWCRElementWithChildren["City"].length() > 0)
										{
										ad[0].setCity(parsedWCRElementWithChildren["City"]);
    									}
										if(parsedWCRElementWithChildren["State"] && parsedWCRElementWithChildren["State"].length() > 0)
										{
                                        ad[0].setState(parsedWCRElementWithChildren["State"]);
										}
										if(parsedWCRElementWithChildren["Zip"] && parsedWCRElementWithChildren["Zip"].length() > 0)
										{
                                        ad[0].setZip(parsedWCRElementWithChildren["Zip"]);
										}
										if(parsedWCRElementWithChildren["StreetDirectionPrefix"] && parsedWCRElementWithChildren["StreetDirectionPrefix"].length() > 0)
										{
                                            ad[0].setStreetDirection(parsedWCRElementWithChildren["StreetDirectionPrefix"]);
										}
										if(parsedWCRElementWithChildren["UnitType"] && parsedWCRElementWithChildren["UnitType"].length() > 0)
										{
                                            ad[0].setUnitType(parsedWCRElementWithChildren["UnitType"]);
										}
										if(parsedWCRElementWithChildren["Unit"] && parsedWCRElementWithChildren["Unit"].length() > 0)
										{
                                            ad[0].setUnitStart(parsedWCRElementWithChildren["Unit"]);
										}																						   
                                        ad[0].setCountry("US");
                                        //Add address
                                        aa.address.editAddress(ad[0]);
								
							}
						}
						}
						else
						{

							newcapId = createCap("Licenses/Business/General/License",parsedWCRElementWithChildren["SiteName"]);
							aa.cap.updateCapAltID(newcapId,parsedWCRElementWithChildren["SiteID"]);
							if(refad != "" && refad != null && parsedWCRElementWithChildren["GISAddressID"] != null && parsedWCRElementWithChildren["GISAddressID"] != "")
							{
								var ad = aa.address.getRefAddressByPK(refad).getOutput();
								var refadmodel = ad.getRefAddressModel();
								if(parsedWCRElementWithChildren["UnitType"] && parsedWCRElementWithChildren["UnitType"].length() > 0)
										{
                                            refadmodel.setUnitType(parsedWCRElementWithChildren["UnitType"]);
										}
										if(parsedWCRElementWithChildren["Unit"] && parsedWCRElementWithChildren["Unit"].length() > 0)
										{
                                            refadmodel.setUnitStart(parsedWCRElementWithChildren["Unit"]);
										}
								aa.address.createAddressWithRefAddressModel(newcapId,refadmodel);
								aa.print("Successfully created cap address from reference address for " + parsedWCRElementWithChildren["SiteID"]);
							}
							else
							{					 
							var address1 = com.accela.aa.aamain.address.AddressModel();
                                        address1.setServiceProviderCode("AURORACO");
                                        address1.setAuditID("ADMIN");
                                        address1.setSourceFlag("Adr");
                                        address1.setAuditStatus("A");
                                        address1.setPrimaryFlag("Y");
                                        address1.setAddressStatus("A");
										if(parsedWCRElementWithChildren["StreetNumber"] && parsedWCRElementWithChildren["StreetNumber"].length() > 0)
										{
                                        address1.setHouseNumberStart(parseFloat(parsedWCRElementWithChildren["StreetNumber"]));
										}
										if(parsedWCRElementWithChildren["StreetName"] && parsedWCRElementWithChildren["StreetName"].length() > 0)
										{
                                        address1.setStreetName(parsedWCRElementWithChildren["StreetName"] );
										}
										if(parsedWCRElementWithChildren["StreetType"] && parsedWCRElementWithChildren["StreetType"].length() > 0)
										{
                                        address1.setStreetSuffix(parsedWCRElementWithChildren["StreetType"]);
										}
										if(parsedWCRElementWithChildren["City"] && parsedWCRElementWithChildren["City"].length() > 0)
										{
										address1.setCity(parsedWCRElementWithChildren["City"]);
    									}
										if(parsedWCRElementWithChildren["State"] && parsedWCRElementWithChildren["State"].length() > 0)
										{
                                        address1.setState(parsedWCRElementWithChildren["State"]);
										}
										if(parsedWCRElementWithChildren["Zip"] && parsedWCRElementWithChildren["Zip"].length() > 0)
										{
                                        address1.setZip(parsedWCRElementWithChildren["Zip"]);
										}
										if(parsedWCRElementWithChildren["StreetDirectionPrefix"] && parsedWCRElementWithChildren["StreetDirectionPrefix"].length() > 0)
										{
                                            address1.setStreetDirection(parsedWCRElementWithChildren["StreetDirectionPrefix"]);
										}
										if(parsedWCRElementWithChildren["UnitType"] && parsedWCRElementWithChildren["UnitType"].length() > 0)
										{
                                            address1.setUnitType(parsedWCRElementWithChildren["UnitType"]);
										}
										if(parsedWCRElementWithChildren["Unit"] && parsedWCRElementWithChildren["Unit"].length() > 0)
										{
                                            address1.setUnitStart(parsedWCRElementWithChildren["Unit"]);
										}																						   
                                        address1.setCountry("US");
                                        //Add address
                                        aa.address.createAddressWithAPOAttribute(newcapId, address1);			
							}
						}
							if(parsedWCRElementWithChildren["CaseOwner"] != null && parsedWCRElementWithChildren["CaseOwner"] != "")
							{
								username = parsedWCRElementWithChildren["CaseOwner"].split("@");
								user = username[0].toUpperCase();
								assignCap(user,newcapId);
							}

							if(parsedWCRElementWithChildren["ExpirationDate"] != null && parsedWCRElementWithChildren["ExpirationDate"] != "")//expiration date
							{
							var ExpirationDate	= parsedWCRElementWithChildren["ExpirationDate"].split("-");
								expDate = ExpirationDate[1] + "/" + ExpirationDate[2] + "/" + ExpirationDate[0]

							if(expDate != "12/31/9999")
							{
								aa.print("expDate = " + expDate);
							//updateExpirationDateandstatus(expDate,newcapId,"Active")
							//updateAppStatus("Active","Updated by Gentax Batch Script",newcapId)
							

							}
							else
							{
								updateExpirationDateandstatus(today,newcapId,"Pending")
								updateAppStatus("Pending","Updated by Gentax Batch Script",newcapId)
							}
							}
							if(parsedWCRElementWithChildren["IssueDate"] != null && parsedWCRElementWithChildren["IssueDate"] != "") // File date
							{
								var IssueDate = parsedWCRElementWithChildren["IssueDate"].split("-");
								filedate = IssueDate[1] + "/" + IssueDate[2] + "/" + IssueDate[0];
								updateFileDate(filedate,newcapId)
							if(!isTaskActive("License Status",newcapId))
							{
							taskCloseAllExceptTPS("Issue License","Updated by Gentax Batch Script",newcapId,"License Status")
							updateTaskTPS("License Status","Active","Updated by Gentax Batch Script","",newcapId)
							}
							}
							editAppSpecific("LICENSE INFORMATION.Correspondence Email",parsedWCRElementWithChildren["SiteEmail"],newcapId);
							editAppName(parsedWCRElementWithChildren["SiteName"],newcapId);
							//editAppSpecific("LICENSE INFORMATION.City Sales Tax Number",parsedWCRElementWithChildren["SiteName"],newcapId);
							editAppSpecific("LICENSE INFORMATION.NAICS Code",parsedWCRElementWithChildren["NAICSTitle"],newcapId);
							if(parsedWCRElementWithChildren["NAICSDescription"].length() > 4000)
							{
							editAppSpecific("LICENSE INFORMATION.NAICS Code Description",parsedWCRElementWithChildren["NAICSDescription"].substring(0,4000),newcapId);
							}
							else
							{
							editAppSpecific("LICENSE INFORMATION.NAICS Code Description",parsedWCRElementWithChildren["NAICSDescription"],newcapId);
							}
							editAppSpecific("LICENSE INFORMATION.Nature of Business",parsedWCRElementWithChildren["NatureOfBusiness"],newcapId);
							
							if(parsedWCRElementWithChildren["CeaseDate"] != null && parsedWCRElementWithChildren["CeaseDate"] != "")
							{
								var CeaseDate = parsedWCRElementWithChildren["CeaseDate"].split("-");
								ceaseDate = CeaseDate[1] + "/" + CeaseDate[2] + "/" + CeaseDate[0]
								editAppSpecific("LICENSE INFORMATION.Ceased Date",ceaseDate,newcapId);
								updateAppStatus("Ceased","Updated by Gentax Batch Script",newcapId);
								//taskCloseAllExcept("Ceased","Updated by Gentax Batch Script",newcapId);
							}
							if((parsedWCRElementWithChildren["CeaseDate"] == null || parsedWCRElementWithChildren["CeaseDate"] == "") && getAppSpecific("LICENSE INFORMATION.Ceased Date",newcapId) != null && getAppSpecific("LICENSE INFORMATION.Ceased Date",newcapId) != "")
							{
								editAppSpecific("LICENSE INFORMATION.Ceased Date","",newcapId);
								updateAppStatus("Opened","Updated by Gentax Batch Script",newcapId);
								//taskCloseAllExcept("Ceased","Updated by Gentax Batch Script",newcapId);
							}
							
					for (x in parsedWCRElementWithChildrend)
					{
						if(x == "DemoName")
						{
						/*var contact1 = aa.people.createPeopleModel().getOutput().getPeopleModel();
							contact1.setContactType("Licensee");
							addr = contact1.getCompactAddress();
							contact1.setFullName(parsedWCRElementWithChildrend["DemoName"]);
							addr.setAddressLine1(parsedWCRElementWithChildrend["DemoStreet"]);
							addr.setCity(parsedWCRElementWithChildrend["DemoCity"]);
							addr.setState(parsedWCRElementWithChildrend["DemoState"]);
							addr.setZip(parsedWCRElementWithChildrend["DemoZip"]);
							contact1.setAuditID("ADMIN");
							contact1.setAuditStatus("A");
							contact1.setCompactAddress(addr);
							aa.people.createCapContactWithRefPeopleModel(newcapId,contact1);*/
							
							updateWorkDesc(parsedWCRElementWithChildrend["DemoName"],newcapId) 
						}
						
						
					}
					if (xmlWCR.getChild("Contacts").getValue() != null && xmlWCR.getChild("Contacts").getValue() != "" && xmlWCR.getChild("Contacts").getValue() != "undefined")
				{
					var con = xmlWCR.getChild("Contacts").getChildren();
					
					for (var f = 0; f < con.size() ; f++) 
					{
					var con1 = con.get(f);
	                var parsedWCRElementWithChildrenc = {};
                                         var h = con1.getChildren();
                                         for (var g = 0; g < h.size() ; g++) {
                            var parsedElementWithChildrenc = h.get(g);
							parsedWCRElementWithChildrenc["Con"+ parsedElementWithChildrenc.getName()] = parsedElementWithChildrenc.getValue();

                       
					}
					for (x in parsedWCRElementWithChildrenc)
					{
					if(x == "ConContactName")
						{
							var p1 = "";
							if(parsedWCRElementWithChildrenc["ConPhone"])
							{
								
							var phone = parsedWCRElementWithChildrenc["ConPhone"].replace("Business","");
						    //p1 =  phone[0].replace("Business","") + " " + phone[1];
							}
							var contact = aa.people.createPeopleModel().getOutput().getPeopleModel();
							if(parsedWCRElementWithChildrenc["ConContactType"] == "BUS")
							{
								contact.setContactType("Licensee");
							}
							else
							{
							contact.setContactType(parsedWCRElementWithChildrenc["ConContactType"]);
							}
							addr = contact.getCompactAddress();
							contact.setPhone1(phone);
							contact.setEmail(parsedWCRElementWithChildrenc["ConContactEmail"]);
							contact.setFullName(parsedWCRElementWithChildrenc["ConContactName"]);
							contact.setAuditID("ADMIN");
							contact.setAuditStatus("A");
							contact.setCompactAddress(addr);
							aa.people.createCapContactWithRefPeopleModel(newcapId,contact);
						}

				}
					}
						
					}
					
					}

				 

				}
					}
				 
				 }

				
				


            }
        }

function updateFileDate(pfileDateStr,itemCapId)
{

if (itemCapId) 
{
                var capResult = aa.cap.getCap(itemCapId);
    var capScriptModel = capResult.getOutput();
                
    if (capScriptModel)
    {
                                //set values for CAP record
        var capModel = capScriptModel.getCapModel();
        capModel.setFileDate(new java.util.Date(pfileDateStr));
            
        var editResult = aa.cap.editCapByPK(capModel);
        if(!editResult.getSuccess())
        {
                logDebug("Failed to update filedate");
        }
                }//end capSciptModelCheck
} //end capId check
} //end function updateFileDate		
function getCapWorkDesModel(capid)
{
	capWorkDesModel = null;
	var s_result = aa.cap.getCapWorkDesByPK(capid);
	if(s_result.getSuccess())
	{
		capWorkDesModel = s_result.getOutput();
	}
	else
	{
		aa.print("ERROR: Failed to get CapWorkDesModel: " + s_result.getErrorMessage());
		capWorkDesModel = null;	
	}
	return capWorkDesModel;
}

function updateWorkDesc(newWorkDes,itemCap) 
{
		var workDescResult = aa.cap.getCapWorkDesByPK(itemCap);
	var workDesObj;

	if (!workDescResult.getSuccess()) {
		aa.print("**ERROR: Failed to get work description: " + workDescResult.getErrorMessage());
		return false;
	}

	var workDesScriptObj = workDescResult.getOutput();
	if (workDesScriptObj) {
		workDesObj = workDesScriptObj.getCapWorkDesModel();
	} else {
		aa.print("**ERROR: Failed to get workdes Obj: " + workDescResult.getErrorMessage());
		return false;
	}

	workDesObj.setDescription(newWorkDes);
	aa.cap.editCapWorkDes(workDesObj);

	aa.print("Updated Work Description to : " + newWorkDes);

}
function editAppName(newname,itemCap)
	{


	capResult = aa.cap.getCap(itemCap)

	if (!capResult.getSuccess())
		{logDebug("**WARNING: error getting cap : " + capResult.getErrorMessage()) ; return false }

	capModel = capResult.getOutput().getCapModel()

	capModel.setSpecialText(newname)

	setNameResult = aa.cap.editCapByPK(capModel)

	if (!setNameResult.getSuccess())
		{ logDebug("**WARNING: error setting cap name : " + setNameResult.getErrorMessage()) ; return false }


	return true;
	}
function branchTask(wfstr,wfstat,wfcomment,wfnote,capid) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 6) 
		{
		processName = arguments[5]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTaskItems(capid, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capid,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"B");
			else
				aa.workflow.handleDisposition(capid,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"B");
			
			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching...");
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching...");
			}			
		}
	}
function updateAppStatus(stat,cmt,itemCap)
	{

	var capid = aa.cap.getCap(itemCap).getOutput();
	var capIDString = capid.getCapModel().getAltID() 

	var updateStatusResult = aa.cap.updateAppStatus(itemCap,"APPLICATION",stat, sysDate, cmt ,systemUserObj);
	if (updateStatusResult.getSuccess())
		logMessage("INFO"," Updated Application Status to " + stat + " successfully for " + capIDString);
	else
		logMessage("**ERROR","CAP # "+ customId +" Application Status update to " + stat + " was unsuccessful. Application Status will need to be updated manually.  The reason is "  + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
	}

function updateTaskTPS(wfstr, wfstat, wfcomment, wfnote,itemCap)
{
	var useProcess = false;
	var processName = "";
	if (arguments.length > 5) {
		if (arguments[5] != "") {
			processName = arguments[5]; // subprocess
			useProcess = true;
		}
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess)
				aa.workflow.handleDisposition(itemCap, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			else
				aa.workflow.handleDisposition(itemCap, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			logMessage("Updating Workflow Task " + wfstr + " with status " + wfstat);
			logDebug("Updating Workflow Task " + wfstr + " with status " + wfstat);
		}
	}
}

function taskCloseAllExceptTPS(pStatus,pComment,itemCap) 
	{
	// Closes all tasks in CAP with specified status and comment
	// Optional task names to exclude
	// 06SSP-00152
	//
	var test = itemCap.toString().split("-");
	var capId = aa.cap.getCap(test[0],test[1],test[2]).getOutput();
	var ncapID = capId.getCapID()
	var taskArray = new Array();
	var closeAll = false;
	if (arguments.length > 3) //Check for task names to exclude
		{
		for (var i=3; i<arguments.length; i++)
			taskArray.push(arguments[i]);
		}
	else
		closeAll = true;

	var workflowResult = aa.workflow.getTasks(itemCap);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  else
  	{ 
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); 
		return false; 
		}
	
	var fTask;
	var stepnumber;
	var processID;
	var dispositionDate = aa.date.getCurrentDate();
	var wfnote = " ";
	var wftask;
	
	for (i in wfObj)
		{
   	fTask = wfObj[i];
		wftask = fTask.getTaskDescription();
		stepnumber = fTask.getStepNumber();
		//processID = fTask.getProcessID();
		if (closeAll)
			{
			aa.print("Closing Workflow Task " + wftask + " with status " + pStatus);
			aa.print("Closing Workflow Task " + wftask + " with status " + pStatus);
			}
		else
			{
			if (!exists(wftask,taskArray))
				{
				aa.workflow.handleDisposition(itemCap,stepnumber,pStatus,dispositionDate,wfnote,pComment,systemUserObj,"Y");
				aa.print("Closing Workflow Task " + wftask + " with status " + pStatus);
				aa.print("Closing Workflow Task " + wftask + " with status " + pStatus);
				}
			}
		}
	}
function getrefaddressID(uid1)
{
 var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext").getOutput();
 var ds = initialContext.lookup("java:/AA"); 
 var conn = ds.getConnection(); 
 var result = new Array();
 var B1_ALT_ID = "";
 var getSQL = "SELECT L1_ADDRESS_NBR FROM L3ADDRES WHERE L1_UDF1 = ?";
 var sSelect = conn.prepareStatement(getSQL);
		sSelect.setString(1, uid1)
        var rs= sSelect.executeQuery(); 
 while(rs.next())
 {
  B1_ALT_ID = rs.getString("L1_ADDRESS_NBR");
  
 result.push(B1_ALT_ID); 
 }
 rs.close();
 conn.close();
 return result ;
}	
function isTaskActive(wfstr,capId) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, "Y");
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getActiveFlag().equals("Y"))
				return true;
			else
				return false;
	}
}
function getAppSpecific(itemName,itemCap)  // optional: itemCap
{
	var updated = false;
	var i=0;
   	
	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
		
		
		var itemGroup = itemName.substr(0,itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".")+1);
	}
	
    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
 	{
		var appspecObj = appSpecInfoResult.getOutput();
		
		if (itemName != "")
		{
			for (i in appspecObj)
				if( appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup) )
				{
					return appspecObj[i].getChecklistComment();
					break;
				}
		} // item name blank
	} 
	else
		{ logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
}
function assignCap(assignId,itemCap)
	{

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	iNameResult  = aa.person.getUser(assignId);

	if (!iNameResult.getSuccess())
		{ logDebug("**ERROR retrieving  user model " + assignId + " : " + iNameResult.getErrorMessage()) ; return false ; }

	iName = iNameResult.getOutput();

	cd.setAsgnDept(iName.getDeptOfUser());
	cd.setAsgnStaff(assignId);

	cdWrite = aa.cap.editCapDetail(cd)

	if (cdWrite.getSuccess())
		{ logDebug("Assigned CAP to " + assignId) }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
	}
