//cvm - found script - moved to source code

var feesArray = loadFees();
if(!matchARecordType(["Planning/Application/Address/NA"], appTypeString)) {
    for ( var i in feesArray) {
        var fees = areFeesInvoiced(feesArray[i].code, feesArray[i].period);
    }
    if (fees) {
        showMessage = true;
        cancel = true;
        comment("Fees Not Invoiced");
    }
}
