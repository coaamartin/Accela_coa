cancel = true;
showMessage = true;  
message =  "HELLOOO";


if (debug.indexOf("**ERROR") > 0)
{
  aa.env.setValue("ErrorCode", "1");
  aa.env.setValue("ErrorMessage", debug);
}
else
{
  if (cancel)
  {
    aa.env.setValue("ErrorCode", "-2");
    if (showMessage) aa.env.setValue("ErrorMessage", message);
    if (showDebug)  aa.env.setValue("ErrorMessage", debug);
  }
  else
  {
    aa.env.setValue("ErrorCode", "0");
    if (showMessage) aa.env.setValue("ErrorMessage", message);
    if (showDebug)  aa.env.setValue("ErrorMessage", debug);
  }
}