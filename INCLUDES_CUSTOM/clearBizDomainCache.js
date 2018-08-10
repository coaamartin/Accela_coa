function clearBizDomainCache(){
    var bizdb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.systemConfig.BizDomainBusiness").getOutput();
    bizdb.clearBizdomainCache();
}
