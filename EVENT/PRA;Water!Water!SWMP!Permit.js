//PRA:Water/Water/SWMP/Permit
if (balanceDue <= 0 && isTaskActive("Permit Issued"))
{
	//updateAppStatus("Issued", "Updated via script");
    rB1ExpResult.setExpDate(aa.date.parseDate(dateAdd(null, 365)));
    rB1ExpResult.setExpStatus("Active");
    aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());

}