/*
Script 120
JHS 6/10/2018
*/


var v0=expression.getValue("ASI::GENERAL INFORMATION::Qualifying Professional Type");
var v1=expression.getValue("ASI::GENERAL INFORMATION::Aboveground Fuel Storage Tanks (AST)");
var v2=expression.getValue("ASI::GENERAL INFORMATION::Decommissioning of Tanks");
var v3=expression.getValue("ASI::GENERAL INFORMATION::Underground Storage Tanks (UST)");


v1.readOnly = false;
v2.readOnly = false;
v3.readOnly = false;

if(v0.value!=null && !v0.value.equals(String("Fuel Tank"))){
	v1.setValue("UNCHECKED");
	v1.hidden=true;
	v2.setValue("UNCHECKED");
	v2.hidden=true;
	v3.setValue("UNCHECKED");
	v3.hidden=true;
	}
else {
	v1.hidden=false;
	v2.hidden=false;
	v3.hidden=false;
	if ("CHECKED".equals(v1.value)) {
			v2.readOnly = true;
			v3.readOnly = true;
	}
	if ("CHECKED".equals(v2.value)) {
			v1.readOnly = true;
			v3.readOnly = true;
	}
	if ("CHECKED".equals(v3.value)) {
			v1.readOnly = true;
			v2.readOnly = true;
	}
}	
expression.setReturn(v1);
expression.setReturn(v2);
expression.setReturn(v3);
