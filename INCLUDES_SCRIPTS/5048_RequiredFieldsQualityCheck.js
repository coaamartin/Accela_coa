//SWAKIL
if ("Quality Check".equals(wfTask) && "Approved".equals(wfStatus))
{	
	var isMissing = false;
	var missingFields = "";

//7-24-19 Keith - Removed Construction Type and Occupancy Group per request from Darcy
//	var reqFieldsArray = ["Total Finished Area Sq Ft", "Project Category", "Construction Type", "Occupancy Group", "Maximum Occupancy", 
//6/1/2021 Raymond Province - Added Code Reference per Darcy SS #995
	var reqFieldsArray = ["Total Finished Area Sq Ft", "Project Category", "Maximum Occupancy", 
	"# of Residential Units", "Single Family Detached Home", "Special Inspections", "Materials Cost", "Valuation", "Homeowner acting as Contractor", "Code Reference"];

	for (var x in reqFieldsArray)
	{
		if (!AInfo[reqFieldsArray[x]] || AInfo[reqFieldsArray[x]] == "")
		{
			isMissing = true;
			missingFields += reqFieldsArray[x] + ", ";
		}
	}

		if(isMissing){
			missingFields = missingFields.substring(0, missingFields.length - 2);
			cancel=true;
			showMessage=true;
			missingFields.required = true; //I tired this but think its for the expression builder.
	        comment("Not all Required Custom fields are populated for the Quailty Check Approval. The following fields are missing: " + missingFields);
			
		}
}



var toPrecision=function(value){
	var multiplier=10000;
	return Math.round(value*multiplier)/multiplier;
  }
  function addDate(iDate, nDays){ 
	  if(isNaN(nDays)){
		  throw("Day is a invalid number!");
	  }
	  return expression.addDate(iDate,parseInt(nDays));
  }
  
  function diffDate(iDate1,iDate2){
	  return expression.diffDate(iDate1,iDate2);
  }
  
  function parseDate(dateString){
	  return expression.parseDate(dateString);
  }
  
  function formatDate(dateString,pattern){ 
	  if(dateString==null||dateString==''){
		  return '';
	  }
	  return expression.formatDate(dateString,pattern);
  }
  
  var servProvCode=expression.getValue("$$servProvCode$$").value;
  var variable0=expression.getValue("ASI::PROJECT INFORMATION::Total Finished Area Sq Ft");
  var variable1=expression.getValue("ASI::PROJECT INFORMATION::Project Category");
  var variable2=expression.getValue("ASI::PROJECT INFORMATION::Maximum Occupancy");
  var variable3=expression.getValue("ASI::PROJECT INFORMATION::# of Residential Units");
  var variable4=expression.getValue("ASI::PROJECT INFORMATION::Single Family Detached Home");
  var variable5=expression.getValue("ASI::PROJECT INFORMATION::Special Inspections");
  var variable6=expression.getValue("ASI::PROJECT FEE INFORMATION::Materials Cost");
  var variable7=expression.getValue("ASI::PROJECT FEE INFORMATION::Valuation");
  var variable8=expression.getValue("ASI::PROJECT FEE INFORMATION::Homeowner acting as Contractor");
  var variable9=expression.getValue("ASI::PROJECT INFORMATION::Code Reference");
  
  
  var totalRowCount = expression.getTotalRowCount();
  
			  variable0.required=true;
		  expression.setReturn(variable0);
  
			  variable1.required=true;
		  expression.setReturn(variable1);
  
			  variable2.required=true;
		  expression.setReturn(variable2);
  
			  variable3.required=true;
		  expression.setReturn(variable3);
  
			  variable4.required=true;
		  expression.setReturn(variable4);
  
			  variable5.required=true;
		  expression.setReturn(variable5);
  
			  variable6.required=true;
		  expression.setReturn(variable6);
  
			  variable7.required=true;
		  expression.setReturn(variable7);
  
			  variable8.required=true;
		  expression.setReturn(variable8);
  
			  variable9.required=true;
		  expression.setReturn(variable9);