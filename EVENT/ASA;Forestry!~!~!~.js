/*
Script ID-71:
Emmett T. Wylam
Update the custom field “Area Number” with the following format from the parcel marked as primary:
Township + Range + 0 + Section
GIS Definitions are as follows:
Township = “Parcel Layer; City Limits; Attribute: JURISDICTION”
Range =  “Parcel Layer; City Limits; Attribute: Shape.STArea() & Shape.StLength();
Section = “Parcel Layer; City Limits; Attribute: Shape_Area;
 */

try {
	if (!publicUser) {
		// Get GIS Information
		var vTownship = getGISInfoArray("AURORACO", "Parcels", "PARCEL_JURISDICTION");
		var vRange = getGISInfoArray("AURORACO", "Parcels", "SHAPE.area");
		var vSection = getGISInfoArray("AURORACO", "Parcels", "SHAPE.len");
		var vArea;
		//  Assume only one return
		if (vTownship.length > 0 && vRange.length > 0 && vSection.length > 0) {
			// Format Data
			vArea = vTownship[0] + vRange[0] + "0" + vSection[0];
			logDebug("Area: " + vArea);
			//Save to ASI field
			editAppSpecific("Area Number", vArea);
		}
	}

} catch (err) {
	logDebug("A JavaScript Error occurred: ASA:Forestry/*/*/*: Script 71: " + err.message);
	logDebug(err.stack)
};

