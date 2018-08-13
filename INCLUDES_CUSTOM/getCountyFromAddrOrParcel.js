/* Check Address "County" field first, then if that is null check Parcel "County" field,
   then if that is null check GIS Layer "Parcels" and attribute "PARCEL_COUNTY" looking for field called Arapahoe county
 */
function getCountyFromAddrOrParcel(){
    //check County in address:
    var county = null;
    var addResult = aa.address.getAddressByCapId(capId);
    if (addResult.getSuccess()) {
        var addResult = addResult.getOutput();
        if (addResult != null && addResult.length > 0) {
            addResult = addResult[0];
            county = addResult.getCounty();
        }//has address(es)
    }//get address success

    //still null? try parcel:
    if (county == null || county == "") {
        var parcels = aa.parcel.getParcelByCapId(capId, null);
        if (parcels.getSuccess()) {
            parcels = parcels.getOutput();

            if (parcels != null && parcels.size() > 0) {
                var attributes = parcels.get(0).getParcelAttribute().toArray();
                for (p in attributes) {
                    if (attributes[p].getB1AttributeName().toUpperCase().indexOf("COUNTY") != -1) {
                        county = attributes[p].getB1AttributeValue();
                        break;
                    }
                }//for parcel attributes
            }//cap has parcel
        }//get parcel success
    }//county is null

    //still null? try GIS:
    if (county == null || county == "") {
        var PARCEL_COUNTY = getGISInfo(gisSvcName, gisLayerName, gisAttrName);
        if (PARCEL_COUNTY) {
            county = PARCEL_COUNTY;
        }
    }
	
	return county;
}