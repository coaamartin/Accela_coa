/**
 * Batchjob Name: BATCH_CLOSE_WUT_AFTER_1YEAR_IF_NOT_ISSUE
 
 */

 var emailText = "";
 var debugText = "";
 var showDebug = 1;
 var showMessage = true;
 var message = "";
 var br = "<br>";
 var debug = false;
 /*------------------------------------------------------------------------------------------------------/
 |
 | END: USER CONFIGURABLE PARAMETERS
 |
 /------------------------------------------------------------------------------------------------------*/
 var sysDate = aa.date.getCurrentDate();
 var wfObjArray = null;
 var AInfo = [];
 var maxSeconds = 3600;
 
 eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
 eval("function logDebug(dstr) { aa.print(dstr); }");
 // eval(getMasterScriptText("INCLUDES_CUSTOM"));
 
 var startDate = new Date();
 var startJSDate = new Date();
 startJSDate.setHours(0, 0, 0, 0);
 var timeExpired = false;
 var useAppSpecificGroupName = false;
 var currentUserID = "ADMIN";
 
 var sysDate = aa.date.getCurrentDate();
 var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
 
 var startTime = startDate.getTime(); 		// Start timer
 var systemUserObj = aa.person.getUser("ADMIN").getOutput();
 
 /*------------------------------------------------------------------------------------------------------/
 |
 | END: USER CONFIGURABLE PARAMETERS
 |
 /------------------------------------------------------------------------------------------------------*/
 //Needed HERE to log parameters below in eventLog
 var sysDate = aa.date.getCurrentDate();
 var batchJobID = aa.batchJob.getJobID().getOutput();
 var batchJobName = "" + aa.env.getValue("batchJobName");
 
 /*----------------------------------------------------------------------------------------------------/
 |
 | Start: BATCH PARAMETERS
 |
 /------------------------------------------------------------------------------------------------------*/
 // PRODUCTION
 var expDays = getParam("Days to expire if not issued");
 
 //testing
 //expDays = 5;
 
 /*------------------------------------------------------------------------------------------------------/
 | <===========Main=Loop================>
 |
 /-----------------------------------------------------------------------------------------------------*/
 
 logDebug(br + "**** START OF JOB ****" + br);
 
 mainProcess();
 /*------------------------------------------------------------------------------------------------------/
 | <===========END=Main=Loop================>
 /-----------------------------------------------------------------------------------------------------*/
 
 function mainProcess() {
     var capCount = 0;
     var appList;
 
     appList = getRecordsArray();
 
     if (appList !== false || appList.length > 0) {
         for (var app in appList ) {
             if (elapsed() > maxSeconds) {
                 // only continue if time hasn't expired
                 logDebug("A script time-out has caused partial completion of this process.  Please re-run.  (Info: appList)  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
                 break;
             }
 
             capIDString = ""+appList[app];
             
             var capIdObj = aa.cap.getCapID(capIDString);
 
             if (capIdObj.getSuccess()) {
                 capId = capIdObj.getOutput();
                 cap = aa.cap.getCap(capId).getOutput();
 
                 logDebug("Processing " + capIDString + " ###");
                 //get task history	
                 var taskHistoryArray = getTaskHistory("Permit Issuance");
                 var IssuedFlagFound = false;
                 for (var x in taskHistoryArray)
                 {
                     var thisTask = taskHistoryArray[x];
                     var thisStatus = thisTask.getDisposition();
                     
                     if ("Issued".equals(thisStatus))
                     {
                         IssuedFlagFound = true;
                     }
                 }
                 
                 if(!IssuedFlagFound){
                     capCount++;
                     logDebug("Closing..............................." + capIDString);
                     updateAppStatus("Closed", "Closed via batch script. Expired, not issued after 1 year of opening permit.",capId);
					 //closeAllTasks(capId, "");
                     //break;
                 }
               
                                                             
                 
               
             }
             else {
                 continue;
             }
         } // end for
     } else {
         logDebug("The record(s) did not meet the criteria to be processed or no records were returned.");
     }
 
     logDebug(br + "\n**** Updated " + capCount + " Record(s) in " + elapsed() + " seconds. ****" + br);
     logDebug(br + "\n**** END OF JOB ****" + br);
 } // end of mainProcess()
 
 function getRecordsArray() {
     var appRecordsList = [];
     var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
     var ds = initialContext.lookup("java:/AA");
     var conn = ds.getConnection();
     var dbStmt;
     
     //Water/Utility/Permit/NA
     var sqlStatement = "select b1.B1_ALT_ID " + 
                         ",DATEDIFF(DAY, CONVERT(DATETIME,b1.REC_DATE), CONVERT(DATE,getdate())) as Diff " +
                         "FROM B1PERMIT B1 " + 
                         "WHERE b1.B1_PER_GROUP = 'Water' " +   
                         "AND b1.B1_PER_TYPE = 'Utility' " + 
                         "AND b1.B1_PER_SUB_TYPE = 'Permit' " + 
                         "AND b1.B1_PER_CATEGORY = 'NA'" +
                         "AND b1.SERV_PROV_CODE ='" + aa.getServiceProviderCode() + "' " +
                         "AND (DATEDIFF(DAY, CONVERT(DATETIME,b1.REC_DATE), CONVERT(DATE,getdate()))) > '" + expDays + "' " +
                         "AND b1.b1_appl_status not in ('Closed','Withdrawn') " +
                         "AND b1.B1_ALT_ID like '%WUP%' ";
                         
                         
 
     try{
             SQL =  sqlStatement;
             dbStmt = conn.prepareStatement(SQL);
             try {
                 //dbStmt.setString(1,expDays)
                 dbStmt.executeQuery();
             }
             catch(errr) {
                 aa.print("inner:" + errr.message);
                 return false;
             }
             results = dbStmt.getResultSet();
             while (results.next()) {
                 appRecordsList.push( ""+results.getString("B1_ALT_ID"));
 
             }
             dbStmt.close();
             return appRecordsList;
         }
         catch(err) {
             aa.print(err.message);
             if (typeof dbStmt != "undefined") dbStmt.close();
             return false;
         }
         finally {
             conn.close();
         }
     
 }
 
 function elapsed() {
     var thisDate = new Date();
     var thisTime = thisDate.getTime();
     return ((thisTime - startTime) / 1000);
 }
 
 function getMasterScriptText(vScriptName){
     vScriptName = vScriptName.toUpperCase();
     var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
     var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
     return emseScript.getScriptText() + "";
 }
 
 function getParam(pParamName) //gets parameter value and logs message showing param value
 {
     var ret = "" + aa.env.getValue(pParamName);
     logDebug("PARAMETER", pParamName + " = " + ret);
     return ret;
 }
 
 
 function getTaskHistory(tName)
 {
     try
     {
         var itemCap = capId;
         var result = new Array();
         if (arguments.length > 1)
             itemCap = arguments[1];
                 
         var wfHist = aa.workflow.getWorkflowHistory(itemCap, tName, null);
         if (wfHist.getSuccess())
         {
             wfHist = wfHist.getOutput();            
             return wfHist;
         }
         else
         {
             logDebug("Problem in " + arguments.callee.name + ": " + wfHist.getErrorMessage());
         }
         return result;
     }
     catch(e)
     {
         logDebug("Problem in function " + arguments.callee.name + " on line " + e.lineNumber + ": " + e.message);
     }
 
 }