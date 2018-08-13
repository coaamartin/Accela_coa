function clearBizDomainCache(){
    logDebug("clearBizDomainCache() started");
    var bizdbResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.systemConfig.BizDomainBusiness");
    if(bizdbResult.getSuccess()){
        var bizdb = bizdbResult.getOutput();
        bizdb.clearBizdomainCache();
    }
    else logDebug("ERROR Clearing Cache: " + bizdbResult.getErrorMessage());
    logDebug("clearBizDomainCache() ended");
}
