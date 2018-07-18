logDebug("Script 78 Starting");
if (ifTracer(wfTask == "Application Submittal" && wfStatus == "Accepted", 'wfTask == Application Submittal && wfStatus == Accepted')) {
    include("78_WatWaterTapInvoiceEmail");
}

