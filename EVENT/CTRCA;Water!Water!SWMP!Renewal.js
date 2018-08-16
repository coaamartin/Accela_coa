/*
 * Script 376
 */

var nmbrOfDisturbedAcreas = parseFloat(AInfo['Area of Project to Undergo Land Disturbance (acres)']),
feeItem = "WAT_SWMP_25",
feeSched = "WAT_SWMP_APP",
feePeriod = "FINAL";

if (nmbrOfDisturbedAcreas > 5) {
	updateFee(feeItem, feeSched, feePeriod, 750, "Y");
} else if (nmbrOfDisturbedAcreas > 1) {
	updateFee(feeItem, feeSched, feePeriod, 400, "Y");
} else if (nmbrOfDisturbedAcreas > 0) {
	updateFee(feeItem, feeSched, feePeriod, 150, "Y");
}
