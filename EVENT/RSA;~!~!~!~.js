//Written by rprovinc   
//
//

//*****************************************************************************
//Script RSA;~!~!~!~.js
//Record Types:	All ACA users
//Event: 		RSA
//Desc:			Going to associate ACA users to record types. Once a public user has created an account, this code below
//  will try to link it with an existing record. It must match the First and Last Name. After that, it must match one of 
// the following: Address or Email or Phone.
//
//Created By: Truepoint deployed by rprovinc

//******************************************************************************


logDebug("==================================");
logDebug("RegistrationSubmitAfter");
logDebug("==================================");

// ACCOUNT AUTO-LINKING - Begin

// Grab the Contact from the PublicUserModel class, there may be more than one.
var ContactInfo = PublicUserModel.getPeoples().toArray(); // the Contact Object is a Java ListArray  
var ContactCount = 0;

for (var ContCnt in ContactInfo){
    // Grab a single contact from the array
    var ContactItem = ContactInfo[ContCnt]; 
    
    ContactCount++;

    logDebug("");
   
    logDebug("Contact email: " + ContactItem.email);                
    logDebug("");

    // Get the CompactAddress from the contact
    var AddressObject = ContactItem.getCompactAddress(); // grab the Contact Address
    
    var FnameMatch = ContactItem.firstName; 
    var LnameMatch = ContactItem.lastName;
    var EmailMatch = ContactItem.email;
    var Phone1Match = ContactItem.phone1;
    var Phone2Match = ContactItem.phone2;
    var AddressMatch = AddressObject.addressLine1;
    var SeqNumber = ContactItem.contactSeqNumber;
 
    if(FnameMatch == null) FnameMatch = "";
    if(LnameMatch == null) LnameMatch = "";
    if(EmailMatch == null) EmailMatch = "";
    if(Phone1Match == null) Phone1Match = "";
    if(Phone2Match == null) Phone2Match = "";
    if(AddressMatch == null) AddressMatch = "";
    if(SeqNumber == null) SeqNumber = "";
    
    // Using JDBC, get all of the Permit Records that match our criteria:
    //      Must match First and Last Name, then Address or Phone or Email
    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext").getOutput();
    var ds = initialContext.lookup("java:/AA"); 
    var conn = ds.getConnection();
    var dbresult = [];
    
    var getSQL = "SELECT   DISTINCT	" + 
                "          CONTACTINFO.B1_ALT_ID AS CapID, " +
                "          CONTACTINFO.B1_PER_ID1 AS RecordKey1, " +
                "          CONTACTINFO.B1_PER_ID2 AS RecordKey2, " +
                "          CONTACTINFO.B1_PER_ID3 AS RecordKey3 " +
                " FROM ( " +
                "          SELECT  permit.SERV_PROV_CODE, " +
                "                  permit.B1_PER_ID1, " +
                "                  permit.B1_PER_ID2, " +
                "                  permit.B1_PER_ID3, " +        
                "                  permit.B1_ALT_ID,  " +       
                "                  LTRIM(RTRIM(UPPER(contact.B1_FNAME))) AS FNAME, " +
                "                  LTRIM(RTRIM(UPPER(contact.B1_LNAME))) AS LNAME, " +
                "                  LTRIM(RTRIM(UPPER(contact.B1_EMAIL))) AS EMAIL, " +
                "                  REPLACE(REPLACE(LTRIM(RTRIM(UPPER(contact.B1_ADDRESS1))),'.',''),'''','') AS ADDRESS, " +
                "                  REPLACE(REPLACE(REPLACE(REPLACE(contact.B1_PHONE1,'(',''),')',''),' ',''),'-','') AS PHONE, " +
                "                  contact.B1_CONTACT_NBR " +
                "          FROM    dbo.B1PERMIT permit " +
                "          JOIN    dbo.B3CONTACT contact " +
                "          ON	   contact.SERV_PROV_CODE = permit.SERV_PROV_CODE  " +
                "          AND     contact.B1_PER_ID1 = permit.B1_PER_ID1  " +
                "          AND     contact.B1_PER_ID2 = permit.B1_PER_ID2  " +
                "          AND     contact.B1_PER_ID3 = permit.B1_PER_ID3 " +
                " ) CONTACTINFO " +
                " WHERE    CONTACTINFO.FNAME = ? " +
                " AND      CONTACTINFO.LNAME = ? " +
                " AND      (       CONTACTINFO.EMAIL = ? " +
                "          OR      CONTACTINFO.PHONE = ? " +
                "          OR      CONTACTINFO.PHONE = ? " +
                "          OR      CONTACTINFO.ADDRESS = ?) ";
                
    var sSelect = conn.prepareStatement(getSQL);
    sSelect.setString(1, FnameMatch.trim().toUpperCase());
    sSelect.setString(2, LnameMatch.trim().toUpperCase());
    sSelect.setString(3, EmailMatch.trim().toUpperCase());
    sSelect.setString(4, Phone1Match.replace("-","").replace("(","").replace(")","").replace(".","").replace(" ","").trim());
    sSelect.setString(5, Phone2Match.replace("-","").replace("(","").replace(")","").replace(".","").replace(" ","").trim());
    sSelect.setString(6, AddressMatch.replace(".","").replace("'","").trim().toUpperCase());
    var rs= sSelect.executeQuery();

    // More than one record could have been found.
    while(rs.next()){          

        var _CapID = rs.getString("CapID");
        var _RecordKey1 = rs.getString("RecordKey1");
        var _RecordKey2 = rs.getString("RecordKey2");
        var _RecordKey3 = rs.getString("RecordKey3");
        
        logDebug("...Processing CAP - " + _CapID + " (" + _RecordKey1 + "-" + _RecordKey2 + "-" + _RecordKey3 + ") with Public User Contact " + SeqNumber);
        
        // This converts the string ID of the record into its CapId object
        relCapId = aa.cap.getCapID(_CapID).getOutput();
 
        // This function will take the Contact the Public User created (which resides in the G3CONTACTS table),
        // and create a new record in the "Normal" contact table (B3CONTACTS) and link it with the Permit Record. If there is
        // more than one Permit Record to link to, only the first one will get the reference back to the original Public
        // User Contact. Therefore, all of the others need to have the reference manually set to the original Public User Contact record,
        // or the Public User account won't see the Permit Records. The SQL below is what manually corrects the reference.
        var contactAddResult = aa.people.createCapContactWithRefPeopleModel(relCapId, ContactItem);
        
        if (contactAddResult.getSuccess()){
            
            var capContactResult = aa.people.getCapContactByCapID(relCapId);
            if (capContactResult.getSuccess())
            {
                var Contacts = capContactResult.getOutput();
                var idx = Contacts.length;
                var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
                logDebug("...Contact " + contactNbr + " successfully added to CAP " + _CapID);                            

                var getSQL = "  UPDATE  B3CONTACT " +
                "   SET     G1_CONTACT_NBR = ? " +
                "   WHERE   B1_PER_ID1 = ? " +
                "   AND     B1_PER_ID2 = ? " +
                "   AND     B1_PER_ID3 = ? " +
                "   AND     B1_CONTACT_NBR = ? ";
                
                var sSelect = conn.prepareStatement(getSQL);
                sSelect.setInt(1, SeqNumber);
                sSelect.setString(2, _RecordKey1 );
                sSelect.setString(3, _RecordKey2);
                sSelect.setString(4, _RecordKey3);
                sSelect.setInt(5, contactNbr);                
                sSelect.executeUpdate();
                logDebug("...Updating contact " + contactNbr + " with reference to " + SeqNumber + " for " + _CapID);
                logDebug ("");
            }
            else
            {
                logDebug("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());                
            }        
        }
        else{
            logDebug("Didn't add contact:" + contactAddResult.getErrorMessage());
        }
        
    }
    
    rs.close();                    
    conn.close();
}

logDebug("");
// ACCOUNT AUTO-LINKING - End


/*
logDebug("");
logDebug("=== Breakpoint Error Below ===");
logDebug("");
// Keep! Let me error out.
logDebug("Contact email: " + ContactInfo.email);
*/
