/*
* Script 376
*/
if (matchARecordType([
  //  "Water/Water/SWMP/Permit",
    "Water/Water/SWMP/Renewal"
], appTypeString)) {
    (function() {
        var nmbrOfDisturbedAcreas = parseFloat(AInfo['Area of Project to Undergo Land Disturbance (acres)']),
            feeItem = "WAT_SWMP_25",
            feeSched = "WAT_SWMP_APP",
            feePeriod = "FINAL" ;

        if (ifTracer(nmbrOfDisturbedAcreas  > 5, "nmbrOfDisturbedAcreas > 5")) {
            addFee(feeItem, feeSched, feePeriod, 750, "Y");
        } else if(ifTracer(nmbrOfDisturbedAcreas  > 1, "nmbrOfDisturbedAcreas > 1")) {
            addFee(feeItem, feeSched, feePeriod, 400, "Y");
        } else if(ifTracer(nmbrOfDisturbedAcreas  > 0, "nmbrOfDisturbedAcreas > 0")) {
            addFee(feeItem, feeSched, feePeriod, 150, "Y");
        }
    })(); 
}