/*
Script 108
JHS 6/19/2018
*/


var v0=expression.getValue("ASI::GENERAL INFORMATION::Contractor Type");
var v1=expression.getValue("ASI::GENERAL INFORMATION::Aboveground Fuel Storage Tanks (AST)");
var v2=expression.getValue("ASI::GENERAL INFORMATION::Decommissioning of Tanks");
var v3=expression.getValue("ASI::GENERAL INFORMATION::Underground Storage Tanks (UST)");
var f = expression.getValue("ASI::FORM");

v1.readOnly = false;
v2.readOnly = false;
v3.readOnly = false;
f.blockSubmit = false;
f.message = "";

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
	if ("UNCHECKED".equals(v1.value) && "UNCHECKED".equals(v1.value) && "UNCHECKED".equals(v1.value)) {
		f.blockSubmit = true;
		f.message = "Please select at least one tank activity";
	}
}	
expression.setReturn(v1);
expression.setReturn(v2);
expression.setReturn(v3);
expression.setReturn(f);
