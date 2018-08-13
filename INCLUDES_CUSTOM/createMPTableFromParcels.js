function createMPTableFromParcels() {
	try {
		myDebug = false;
		if (myDebug)
			aa.print("Starting createTableFromParcels()...");
		var tableName = "MULTIPLE PARCELS";
		var col1 = "Parcel";
		var readOnlyFlag = "Y"

			// build table arrays
			var parcelTable = new Array();

		// add row for each parcel
		var parcels = aa.parcel.getParcelDailyByCapID(capId, null);
		if (parcels.getSuccess()) {
			parcels = parcels.getOutput();
			if (parcels == null || parcels.length == 0) {
				logDebug("No parcels available for this record");
				if (myDebug)
					aa.print("No parcels available for this record");
			} else {
				for (cnt in parcels) {
					if (parcels[cnt].getPrimaryParcelFlag() == "N") //do not include the primary parcel fro ACA display
					{
						if (myDebug)
							aa.print("Adding parcel: " + parcels[cnt].getParcelNumber());
						var columnRow = new Array();
						columnRow[col1] = new asiTableValObj(col1, parcels[cnt].getParcelNumber(), readOnlyFlag);
						parcelTable.push(columnRow);
					}
				}
			}
		}

		//  verify out table arrays

		if (myDebug) {
			for (x in parcelTable) {
				for (y in parcelTable[x])
					aa.print("test Output: Table[" + x + "]: " + y + " = " + parcelTable[x][y]);
			}
		}

		// replace table with new table arrays
		if (myDebug)
			aa.print("** Updating ASI Table");
		removeASITable(tableName);
		addASITable(tableName, parcelTable);
	} catch (err) {
		if (myDebug)
			aa.print("A JavaScript Error occurred: function createMPTableFromParcels: " + err.message);
		logDebug("A JavaScript Error occurred: function createMPTableFromParcels: " + err.message);
	}
}
