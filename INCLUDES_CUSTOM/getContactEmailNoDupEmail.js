function getContactEmailNoDupEmail(vcapId, vconType){
    var thisItem = arguments[0];
    var searchConType = arguments[1];
    var conEmailArray = [];
    var vConObjArry;
    if(searchConType.toUpperCase()=="ALL"){
        vConObjArry = getContactObjsByCap(thisItem);
    }else{
        vConObjArry = getContactObjsByCap(thisItem,searchConType);
    }
    //return valid email addressses and only one address for multiple contacts with same email
    for(eachCont in vConObjArry){
        var vConObj = vConObjArry[eachCont];
        //Get contact email
        if (vConObj) {
            var conEmail = vConObj.people.getEmail();
            var conType = vConObj.people.getContactType();
            if (conEmail && conEmail != null && conEmail != "" && conEmail.indexOf("@") > 0) {
                if(!exists(conEmail,conEmailArray) ){
                    conEmailArray.push(conEmail);
                    logDebug("Returning email for :" + conType )
                    logDebug('Email: ' + conEmail)

                }

            }
        }
    }
    return conEmailArray;

}