// WTUA:Building/*/*/*

// following block of code was in Accela but not Github... it was added by "ADMIN" 12-22-2016
if (wfTask == "Permit Issuance" &amp;&amp; wfStatus == "Issued")
editAppSpecific("Permit Issued Date", sysDateMMDDYYYY);
if (wfTask == "Permit Issuance" &amp;&amp; wfStatus == "Issued")
editAppSpecific("Permit Expiration Date", dateAdd(null, 180));
if (wfTask == "Permit Status" &amp;&amp; wfStatus == "Permit Issued")
editAppSpecific("Permit Issued Date", sysDateMMDDYYYY);
if (wfTask == "Permit Status" &amp;&amp; wfStatus == "Permit Issued")
editAppSpecific("Permit Expiration Date", dateAdd(null, 180));
if (wfTask == "Permit Issuance" &amp;&amp; wfStatus == "Issued")
licEditExpInfo(null, AInfo["Permit Expiration Date"]);
if (wfTask == "Permit Status" &amp;&amp; wfStatus == "Permit Issued")
licEditExpInfo(null, AInfo["Permit Expiration Date"]);
// end ADMIN code

script205_DeactivateSpecInsp();
