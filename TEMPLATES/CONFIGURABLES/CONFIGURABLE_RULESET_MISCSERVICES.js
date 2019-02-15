//this must be manually load via accela interface into scripts area.  It acts more like a standard choice than a true script.
{
  "DocumentUploadAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION"
    ]
  },
  "WorkflowTaskUpdateAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_SEND_CONTACT_EMAILS"
    ]
  },
  "WorkflowTaskUpdateBefore": {
    "StandardScripts": [
      "STDBASE_REQUIRED_DOCUMENTS",
       "STDBASE_RECORD_VALIDATION"
    ]
  },
  "ApplicationSubmitAfter": {
    "StandardScripts": [
      "STDBASE_COPY_RECORD_DATA"
    ]
  },
  "PaymentReceiveAfter":{
	  "StandardScripts":[
		"STDBASE_RECORD_AUTOMATION"
	  ]
  }
}