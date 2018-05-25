function updateApplicationNameWithAddressInfo() {
    var capAddrResult = aa.address.getAddressByCapId(capId);
    if (capAddrResult.getSuccess()) {
        var listAddress = capAddrResult.getOutput();
        if (listAddress != null && listAddress.length > 0) {
            var checkForPrimary = true;
            if (listAddress.length == 1)
                checkForPrimary = false;

            for (var a in listAddress) {
                var objAddress = listAddress[a];
                if (typeof (objAddress) != "undefined" && objAddress != null) {
                    if (checkForPrimary) {
                        var primaryFlag = objAddress.getPrimaryFlag();
                        if (typeof (primaryFlag) != "undefined" && primaryFlag != null && primaryFlag != "") {
                            if (primaryFlag.toLowerCase() == "y") {
                                var displayAddress = objAddress.getDisplayAddress();
                                if (typeof (displayAddress) != "undefined" && displayAddress != null && displayAddress != "")
                                    editAppName(displayAddress);
                                break;
                            }
                        }
                    } else {
                        var displayAddress = objAddress.getDisplayAddress();
                        if (typeof (displayAddress) != "undefined" && displayAddress != null && displayAddress != "")
                        logDebug("App Name " + displayAddress);
                            editAppName(displayAddress);
                        break;
                    }
                }
            }
        }
    }
}