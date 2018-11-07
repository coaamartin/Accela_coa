// Begin script to update the Multiple Parcels table with actual parcels
 if(!publicUser){
  if (typeof(MULTIPLEPARCELS) == "object")
  {
   createMPTableFromParcels();
  }
 }
// End script to update the Multiple Parcels table with actual parcels


if (matches(currentUserID, "ADMIN")) {
showDebug = false;
showMessage = false;
}
include("EMSE:SetContactRelationshipToContactType");
