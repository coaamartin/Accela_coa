function getCapFullAddress() {
    var rtnAddress="",
        capAddresses = aa.address.getAddressByCapId(capId);

    if (capAddresses.getSuccess()) {
        capAddresses = capAddresses.getOutput();
        if (capAddresses != null && capAddresses.length > 0) {
            capAddresses = capAddresses[0];
            var rtnAddress = "";
            rtnAddress = capAddresses.getHouseNumberStart() + " ";
            rtnAddress = rtnAddress + capAddresses.getStreetName() + " ";
            rtnAddress = rtnAddress + capAddresses.getCity() + " ";
            rtnAddress = rtnAddress + capAddresses.getState() + " ";
            rtnAddress = rtnAddress + capAddresses.getZip();
            
        }
    }
    return rtnAddress;
}