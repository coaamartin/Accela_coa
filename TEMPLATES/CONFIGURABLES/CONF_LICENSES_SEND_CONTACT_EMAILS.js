{
    "Licenses/Contractor/General/Application": {
        "WorkflowTaskUpdateAfter": [
          {
            "preScript": "",
            "postScript": "",
            "metadata": {
              "description": "To run automated script based on JSON rules - Script 106",
              "operators": {}
            },
            "criteria": {
              "task": [
                "License Issuance"
              ],
              "status": [
                "Ready to Pay"
              ]
            },
            "action": {
              "notificationTemplate":  "BLD QPL LICENSE READY TO PAY # 106",
              "notificationReport": "",
              "notifyContactTypes": [
                  "Contractor Applicant"
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
    "Licenses/Marijuana/*/*": {
        "WorkflowTaskUpdateAfter": [
          {
            "preScript": "",
            "postScript": "",
            "metadata": {
              "description": "To run automated script based on JSON rules - Script 248",
              "operators": {}
            },
            "criteria": {
              "task": [
                "License Issuance",
                "Application Review",
                "Renewal Review"
              ],
              "status": [
                "Denied"
              ]
            },
            "action": {
              "notificationTemplate":   "DENIAL OF LICENSE APPLICATION #248",
              "notificationReport": "",
              "notifyContactTypes": [
                "Applicant",
                "Responsible Party"
              ],
              "url4ACA":  "https://awebdev.aurora.city/CitizenAccess",
              "fromEmail": "noreply@auroraco.gov",
              "additionalEmailsTo": [],
              "createFromParent": "",
              "reportingInfoStandards": ""
            }
          }
          ]
          }
}
