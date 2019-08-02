logDebug("492_Issue_SWMP");
if (balanceDue <= 0 && isTaskActive("Permit Issued") && "Payment Pending".equals(capStatus))
{
	updateAppStatus("Issued", "Updated via script");
}