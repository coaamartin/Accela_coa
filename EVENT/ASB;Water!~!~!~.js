/* Title :  Require Parcel or Address on Record (ApplicationSubmitBefore)

Purpose : If No Address or Parcel has been provided on the record (Water///) then block submission and raise error Address or Parcel is
required.

Author :   Israa Ismail

Functional Area : Records 

Sample Call : checkIfAddressOrParcelExists();

*/

// appTypeResult = cap.getCapType(); //create CapTypeModel object
// appTypeString = appTypeResult.toString();
// appTypeArray = appTypeString.split("/");
// logDebug("appType: " + appTypeString);
//skip Water/Water/SWMP/Transfer
if(appTypeArray[3]!="Renewal" && appTypeArray[3]!="Transfer"){
    checkIfAddressOrParcelExists();
}