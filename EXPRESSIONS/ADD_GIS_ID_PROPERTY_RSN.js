var aa = expression.getScriptRoot();
var servProvCode = expression.getValue("$$servProvCode$$").value;
var vPropertyRSN = expression.getValue("REFADDR::neighborhood");
var vGISID = expression.getValue("REFADDR::neighberhoodPrefix");
var vNextSequence = 0;

var totalRowCount = expression.getTotalRowCount();

// Make PropertyRSN and GISID read only

vPropertyRSN.readOnly = true;
expression.setReturn(vPropertyRSN);

vGISID.readOnly = true;
expression.setReturn(vGISID);

// Set GIS ID and PropertyRSN to sequence
if ((vPropertyRSN.value == "" || vPropertyRSN.value == null) && (vGISID.value == "" || vGISID.value == null)) {
	vNextSequence = getNextSequence("Agency","Aurora_GIS_ID","Aurora_GIS_ID");
	
	vPropertyRSN.value = vNextSequence;
	expression.setReturn(vPropertyRSN);

	vGISID.value = vNextSequence;
	expression.setReturn(vGISID);
}




/**
returns next value of mask/sequence provided
* @param seqType from system Sequence generator (type of seq/mask)
*/
function getNextSequence(seqType, seqName, maskName) {
	try {
		var agencySeqBiz = aa.proxyInvoker.newInstance("com.accela.sg.AgencySeqNextBusiness").getOutput();
		var params = aa.proxyInvoker.newInstance("com.accela.domain.AgencyMaskDefCriteria").getOutput();

		params.setAgencyID(aa.getServiceProviderCode());
		params.setMaskName(maskName);
		params.setRecStatus("A");
		params.setSeqType(seqType);
		params.setSeqName(seqName);

		var seq = agencySeqBiz.getNextMaskedSeq("ADMIN", params, null, null);

		return seq;
	} catch (err) {
		aa.print("error " + err);
		return null;
	}
}