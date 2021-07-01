//PRA:Water/Water/SWMP/Permit
if (balanceDue <= 0 && isTaskActive("Active Permit"))
{
	//updateAppStatus("Issued", "Updated via script");
    var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
    rB1ExpResult.setExpDate(aa.date.parseDate(dateAdd(null, 365)));
    rB1ExpResult.setExpStatus("Active");
    aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());

}