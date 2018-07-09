function buildFullName(firstName,middleName,lastName) 
{   var fullName = "";  
 if(firstName && firstName != null)   {   fullName +=firstName;   } 
  if(middleName && middleName != null)   {   fullName += " "+ middleName   }  
   if(lastName && lastName != null)   {   fullName += " "+ lastName   }  
    return fullName; 
   }