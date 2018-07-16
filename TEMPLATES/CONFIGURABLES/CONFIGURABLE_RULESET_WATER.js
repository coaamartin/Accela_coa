{
    "WorkflowTaskUpdateAfter": {
      "StandardScripts": [
        "STDBASE_SEND_CONTACT_EMAILS",
        "STDBASE_INSPECTION_SCHEDULING"
      ]
    },
    "ApplicationSubmitAfter": {
      "StandardScripts": [
        "STDBASE_COPY_RECORD_DATA"
      ]
    },
    "InspectionResultSubmitAfter":{
        "StandardScripts":[
          "STDBASE_INSPECTION_AUTOMATION",
          "STDBASE_SEND_CONTACT_EMAILS",
          "STDBASE_RECORD_AUTOMATION"
        ]
    },
    "WorkflowTaskUpdateBefore": {
      "StandardScripts": [
        "STDBASE_REQUIRED_DOCUMENTS"
      ]
    },
      "PaymentReceiveAfter": {
      "StandardScripts": [
        "STDBASE_RECORD_AUTOMATION"
      ]
    },
    "DocumentUploadAfter": {
      "StandardScripts": [
        "STDBASE_RECORD_AUTOMATION"
      ]
    }
  }