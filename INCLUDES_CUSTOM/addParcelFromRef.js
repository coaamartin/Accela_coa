function addParcelFromRef(parParcel) // optional capID
{
	//modified function addParcelAndOwnerFromRefAddress()
	try {
		var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

		var prclObj = aa.parcel.getParceListForAdmin(parParcel, null, null, null, null, null, null, null, null, null);
		if (prclObj.getSuccess()) {
			//comment("Got past prclObj...");

			var prclArr = prclObj.getOutput();
			if (prclArr.length == 1) {
				logDebug("Got past prclArr in addParcelFromRef()");

				var prcl = prclArr[0].getParcelModel();
				var refParcelNumber = prcl.getParcelNumber();

				//set to not primary
				prcl.setPrimaryParcelFlag("N");

				// first add the parcel
				var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, prcl);

				var createPMResult = aa.parcel.createCapParcel(capParModel.getOutput());
				if (createPMResult.getSuccess()) {
					logDebug("created CAP Parcel");
					//aa.print("created CAP Parcel");
				} else {
					logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage());
					//aa.print("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage()); 
				}
			}
		}
		return true;
	} catch (err) {
		comment("A JavaScript Error occurred:  Custom Function: addParcelFromRef: " + err.message);
	}
}
