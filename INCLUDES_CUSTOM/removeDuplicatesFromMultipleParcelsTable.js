function removeDuplicatesFromMultipleParcelsTable() {
	try {
		var asiTableName = "MULTIPLE PARCELS";
		parcelTable = loadASITable(asiTableName, capId);

		//remove primary parcel if in table
		removeParcelFromTable(parcelTable, getPrimaryParcel());

		//remove duplicates in table
		removeDuplicateParcelsFromTable(parcelTable);

		removeASITable(asiTableName);

		addASITable(asiTableName, parcelTable);
	} catch (err) {
		logDebug("A JavaScript Error occurred in custom function removeDuplicatesFromMultipleParcelsTable(): " + err.message);
	}
}
