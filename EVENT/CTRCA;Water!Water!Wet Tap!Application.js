//Part of Script 401 - Re Link to Parent after record is converted from a TMP to a real record
var vParentId;
vParentId = "" + aa.env.getValue("ParentCapID");
if (vParentId == false || vParentId == null || vParentId == "") {
    var permitNumber = getAppSpecific("Utility Permit Number");
    if (permitNumber != null) {
    	var parentCapId = aa.cap.getCapID(permitNumber).getOutput();
    	addParent(parentCapId);
    }
}