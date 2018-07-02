//script 432
logDebug("Script 423 Starting");
if (ifTracer(wfTask == "Invoicing" && wfStatus == "Invoiced", "wfTask == Invoicing && wfStatus == Invoiced")) {
    include("423_AccessInvoiceSnowAndAbatementFees");
}