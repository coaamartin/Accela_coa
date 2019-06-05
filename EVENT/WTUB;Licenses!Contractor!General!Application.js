//SWAKIL - Email

if ("License Issuance".equals(wfTask) && wfStatus !== "Note") && ("License Issuance".equals(wfTask) && wfStatus !== "Denied") && ("License Issuance".equals(wfTask) && wfStatus !== "Additional Info Required") 
{
  logDebug("Ready to check to stop due to payment - Calling 5050");
  include("5050_ReadyToPayWF");
}