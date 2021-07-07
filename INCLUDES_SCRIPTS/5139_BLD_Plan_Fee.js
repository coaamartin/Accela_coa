logDebug("Start of 5139_BLD_Plan_Fee.js");
//need to add fees below and ensure they do not auto invoice
//Building Fee (Flat Fee)
//Building Use Tax
//Depends on address it would insert the Use Tax fees

//Building Fee (Flat Fee)
addFee("BLD_PWP_01", "BLD_PWP", "FINAL", 1, "Y");
//Building Fee Use Tax below
addFee("BLD_PWP_02", "BLD_PWP", "FINAL", 1, "Y");

var fullAddress = "";
var capAddresses = aa.address.getAddressByCapId(capId);
if (capAddresses.getSuccess()) {
    capAddresses = capAddresses.getOutput();
    if (capAddresses != null && capAddresses.length > 0) {
        capAddresses = capAddresses[0];

        fullAddress = capAddresses.getHouseNumberStart() + " ";
        fullAddress = fullAddress + capAddresses.getStreetName() + " ";
        fullAddress = fullAddress + capAddresses.getCity() + " ";
        fullAddress = fullAddress + capAddresses.getState() + " ";
        fullAddress = fullAddress + capAddresses.getZip() + " ";
        fullAddress = fullAddress + capAddresses.getCounty();
        logDebug(fullAddress);
    }
    getCounty = capAddresses.getCounty();
    if (getCounty == "Arapahoe") {
        addFee("BLD_PWP_03", "BLD_PWP", "FINAL", 1, "Y");
    }
}