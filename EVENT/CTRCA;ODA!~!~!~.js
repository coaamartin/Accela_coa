/*
Title : Populate additional parcel information for multiple parcel scenarios based on custom list data

Purpose : If there is a value in Custom List Multiple Parcels then insert the additional parcels on the parcel tab and pull the Address
and Owner information from GIS based on the parcel information provided in the custom list and add that information to the
record. An attached document outlining all the functionality needed has been attached to assist with development

Author: ghess
 
Functional Area : Records

Events: ApplicationSubmitAfter, ConvertToRealCapAfter

Notes:
	This is the part for the events, ACA Pageflow scripts are in 2 more separated files

8/13/18 - ETW Updated to also add parcel GIS objects
*/

try {
	removeDuplicatesFromMultipleParcelsTable();
	createAPOfromMultipleParcelsTable();
	copyParcelGisObjects();
} catch (ex) {
	logDebug("**WARN add additional parcels from ASIT 'MULTIPLEPARCELS' failed, " + ex);
}


//Send ODA Pre App Email script 220
script220_ApplicationReceivedEmailForPreApp();