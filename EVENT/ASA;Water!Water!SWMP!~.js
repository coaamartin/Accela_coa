/*
* Script 424
*/
if (matchARecordType([
    "Water/Water/SWMP/Permit",
    "Water/Water/SWMP/Renewal"
], appTypeString)) {
    (function() {
        var nmbrOfDisturbedAcreas = parseFloat(AInfo['Area of Project to Undergo Land Disturbance (acres)']),
            feeItem = "WAT_SWMP_24",
            feeSched = "WAT_SWMP_APP",
            feePeriod = "FINAL" ;

        if (ifTracer(nmbrOfDisturbedAcreas  > 5, "nmbrOfDisturbedAcreas > 5")) {
            addFee(feeItem, feeSched, feePeriod, 2250, "Y");
        } else if(ifTracer(nmbrOfDisturbedAcreas  > 1, "nmbrOfDisturbedAcreas > 1")) {
            addFee(feeItem, feeSched, feePeriod, 1200, "Y");
        } else if(ifTracer(nmbrOfDisturbedAcreas  > 0, "nmbrOfDisturbedAcreas > 0")) {
            addFee(feeItem, feeSched, feePeriod, 450, "Y");
        }
    })(); 
}