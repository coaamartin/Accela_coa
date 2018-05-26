function closeWfTaskCertificateOfOccupancy(){
    logDebug("closeWfTaskCertificateOfOccupancy() started");
    try{
        var $iTrc = ifTracer;
        if ($iTrc(wfTask =="Inspection Phase"  && (wfStatus == "Temporary CO Issued" || wfStatus=="Ready for CO"), 'wfTask =="Inspection Phase"  && (wfStatus == "Temporary CO Issued" || wfStatus=="Ready for CO")')){
            var caps= capIdsGetByAddr();

            if($iTrc(caps, 'caps')){
                for(each in caps){
                    var vCapID = caps[each]
                    var vCap = aa.cap.getCap(vCapID).getOutput();
                    var vAppTypeString = vCap.getCapType().toString();
                    
                    if($iTrc(vAppTypeString.startsWith("Licenses/Marijuana/") && vAppTypeString.endsWith("/Application"), 'Licenses/Marijuana/*/Application')){
                        closeTaskByCapId("Certificate of Occupancy","Complete", "Closed by script closeWfTaskCertificateOfOccupancy()", "Closed by script closeWfTaskCertificateOfOccupancy()", vCapID);
                    }
                }
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function closeWfTaskCertificateOfOccupancy(). Err: " + err);
    }
    logDebug("closeWfTaskCertificateOfOccupancy() ended");
}
