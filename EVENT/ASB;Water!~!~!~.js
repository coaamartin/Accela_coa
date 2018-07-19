/* Title :  Require Parcel or Address on Record (ApplicationSubmitBefore)

Purpose :  If No Address or Parcel has been provided on the record (Water/*/
/*) then block submission and raise error ”Address or Parcel is
required”.

Author :   Israa Ismail

Functional Area : Records

Sample Call : checkIfAddressOrParcelExists();

 */

if (!appMatch("*/*/*/Renewal") {
	checkIfAddressOrParcelExists();
}
