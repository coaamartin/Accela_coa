{
    "Planning/Special Request/Zoning Inquiry/NA": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Zoning Inquiry Meeting"
            ],
            "status": [
              "Letter Negative Generate Letter"
            ]
          },
          "action": {
            "notificationTemplate": "TEST_FOR_SCRIPTS",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        },
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules - Script 339",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Generate Letter"
            ],
            "status": [
              "Complete"
            ]
          },
          "action": {
            "notificationTemplate": "ZONING LETTER RESPONSE",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    },
    "Planning/Application/Address/NA": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "Script 261",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Application Submittal"
            ],
            "status": [
              "Ready to Pay"
            ]
          },
          "action": {
            "notificationTemplate": "PLN MINOR ADDRESS FEES # 261",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    },
    "Planning/Application/Conditional Use/NA": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Planning Pre Acceptance"
            ],
            "status": [
              "Resubmittal Requested"
            ]
          },
          "action": {
            "notificationTemplate": "PLN PRE SUBMITTAL MEETING #253",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    },
    "Planning/Application/Master Plan/*": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Landscape Pre Acceptance"
            ],
            "task": [
              "Addressing Pre Acceptance"
            ],
            "task": [
              "Planning Pre Acceptance"
            ],
            "task": [
              "Civil Pre Acceptance"
            ],		  
            "status": [
              "Resubmittal Requested"
            ]
          },
          "action": {
            "notificationTemplate": "PLN PRE SUBMITTAL MEETING #253",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    },
    "Planning/Application/Site Plan/*": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Landscape Pre Acceptance"
            ],
            "task": [
              "Addressing Pre Acceptance"
            ],
            "task": [
              "Planning Pre Acceptance"
            ],
            "task": [
              "Civil Pre Acceptance"
            ],		  
            "status": [
              "Resubmittal Requested"
            ]
          },
          "action": {
            "notificationTemplate": "PLN PRE SUBMITTAL MEETING #253",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    },
    "Planning/Application/Rezoning/*": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Real Property Pre Acceptance"
            ],
            "task": [
              "Planning Pre Acceptance"
            ],		  
            "status": [
              "Resubmittal Requested"
            ]
          },
          "action": {
            "notificationTemplate": "PLN PRE SUBMITTAL MEETING #253",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    },
    "Planning/Application/*/*": {
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules. Script 280",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Review Consolidation"
            ],
            "status": [
              "Resubmittal Requested"
            ]
          },
          "action": {
            "notificationTemplate": "PLN RESUBMITAL REQUESTED #280",
            "notificationReport": "",
            "notifyContactTypes": [
              "Applicant"
            ],
            "url4ACA": "",
            "fromEmail": "noreply@auroraco.gov",
            "additionalEmailsTo": [],
            "createFromParent": "",
            "reportingInfoStandards": ""
          }
        }
      ]
    }
  }