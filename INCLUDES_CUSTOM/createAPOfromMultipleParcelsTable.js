function createAPOfromMultipleParcelsTable() {
	//Get parcels from ASIT and add to record APO
	//Adds associated addresses and owner(s), sets all to Primary="No"
	//Call from CTRCA for ACA
	try {
		//aa.print("Inside createAPOfromMultipleParcelsTable1");
		var boolFound = false;
		var currentAddresses = new Array();
		var newLength = 0;
		var addrFound = false;

		loadASITables();
		if (typeof (MULTIPLEPARCELS) == "object") {
			var primeParcel = getPrimaryParcel();

			for (xxx in MULTIPLEPARCELS) {
				var myParcelId = MULTIPLEPARCELS[xxx]["Parcel"];
				myParcelId = String(myParcelId).trim();
				logDebug("1) Adding from MULTIPLE PARCELS #" + myParcelId);
				//aa.print("Adding from MULTIPLE PARCELS #" + myParcelId);

				if (String(myParcelId) != String(primeParcel)) {
logDebug("2) Adding from MULTIPLE PARCELS #" + myParcelId);
					// Add Parcel from reference
					addParcelFromRef(myParcelId);
					boolFound = true;
					addrFound = false;

					//Get Address based on Parcel
					var addrObj = aa.address.getAddressListForAdmin(myParcelId, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
							null, null);
					if (addrObj.getSuccess()) {
						var addrArr = addrObj.getOutput();

						//grab first address (changing from addrArr.length==1)
						if (addrArr != null && addrArr.length > 0) {
							var addr = addrArr[0].getRefAddressModel();

							// check for duplicates
							var refAddressId = addr.getRefAddressId();
							//aa.print( "getRefAddressId = " + refAddressId);

							if (newLength > 0) // not first time around
							{
								// check if ref address already added
								for (i = 0; i < newLength; i++) {
									if (currentAddresses[i] == refAddressId) {
										addrFound = true;
										//aa.print("Found previous address: " + refAddressId);
									}
								}
							}
							if (!addrFound) //if not duplicate, add to record
							{
								newLength = currentAddresses.push(refAddressId);

								//Set to not primary
								addr.setPrimaryFlag("N");

								//Add reference Address to record
								//aa.print("Adding Address to record");
								aa.address.createAddressWithRefAddressModel(capId, addr);
							}
						} else {
							logDebug("Not found address for parcel Id: " + myParcelId);
							//aa.print("Not found address for parcel Id: " + myParcelId);
						}
					}
				}
			} //end for

			// Now the Owners
			//copyUniqueOwnersByParcel();
			updateCapOwnersByParcel();
		}
		return boolFound;
	} catch (err) {
		comment("A JavaScript Error occurred:  Custom Function: createAPOfromMultipleParcelsTable: " + err.message);
	}
}