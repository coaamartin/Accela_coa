/* Script131_hideDispFields */
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

function ShowHideFields(condition, ctlFields, reqWhenShowed) {
    var i;
    if (condition) {
        for (i in ctlFields) {
            ctlFields[i].hidden = false;
            if (reqWhenShowed) {
                ctlFields[i].required = true;
            }
        }
    } else {
        for (i in ctlFields) {
            ctlFields[i].hidden = true;
            if (reqWhenShowed) {
                ctlFields[i].required = false;
            }
        }
    }
    for (i in ctlFields) {
        expression.setReturn(ctlFields[i]);
    }
}

var servProvCode=expression.getValue("$$servProvCode$$").value;
var permitType  = expression.getValue("ASI::GENERAL INFORMATION::Utility Permit Type");
var numOfHydran = expression.getValue("ASI::GENERAL INFORMATION::Number of Hydrants");
var numOfValves = expression.getValue("ASI::GENERAL INFORMATION::Number of Valves");
var numOfManHol = expression.getValue("ASI::GENERAL INFORMATION::Number of Manholes");
var numOfStruct = expression.getValue("ASI::GENERAL INFORMATION::Number of Structures");
var underdrains = expression.getValue("ASI::GENERAL INFORMATION::Underdrains installed?");
var licAgreemnt = expression.getValue("ASI::GENERAL INFORMATION::Do you have a license agreement?");

var totalRowCount = expression.getTotalRowCount();
var displayFields = [];
var hideFields = [];

if(permitType.value.equals(String("Water Main Utility Permit"))){
    displayFields.push(numOfHydran, numOfValves);
    hideFields.push(numOfManHol, numOfStruct, underdrains, licAgreemnt);
    
    ShowHideFields(true, displayFields, true);
    ShowHideFields(false, hideFields, false);
}

if(permitType.value.equals(String("Sanitary Sewer Permit"))){
    displayFields.push(numOfManHol, underdrains, licAgreemnt);
    hideFields.push(numOfHydran, numOfValves, numOfStruct);
    
    ShowHideFields(true, displayFields, true);
    ShowHideFields(false, hideFields, false);
}

if(permitType.value.equals(String("Public Storm Sewer Permit"))){
    displayFields.push(numOfManHol, numOfStruct, underdrains);
    hideFields.push(licAgreemnt, numOfHydran, numOfValves);
    
    ShowHideFields(true, displayFields, true);
    ShowHideFields(false, hideFields, false);
}

if(permitType.value.equals(String("Private Storm Sewer Permit"))){
    displayFields.push(numOfManHol, numOfStruct, licAgreemnt);
    hideFields.push(underdrains, numOfHydran, numOfValves);
    
    ShowHideFields(true, displayFields, true);
    ShowHideFields(false, hideFields, false);
}

if(!permitType.value.equals(String("Water Main Utility Permit")) &&
   !permitType.value.equals(String("Sanitary Sewer Permit")) &&
   !permitType.value.equals(String("Public Storm Sewer Permit")) &&
   !permitType.value.equals(String("Private Storm Sewer Permit"))){
    
    displayFields.push(numOfManHol, numOfStruct, licAgreemnt, underdrains, numOfHydran, numOfValves);
    ShowHideFields(true, displayFields, false);
}