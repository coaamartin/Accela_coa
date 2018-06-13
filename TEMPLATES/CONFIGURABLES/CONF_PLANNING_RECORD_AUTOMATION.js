{
    "Planning/*/*/*": {
      "DocumentUploadAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "documentCategory": [],
            "documentGroup": [],
            "workFlow": {
              "Review Consolidation": "Resubmittal Requested"
            },
            "recordStatus": [
              "Waiting on Documents"
            ]
          },
          "action": {
            "activateTask": [
              "Submission Quality Check"
            ],
            "daysOut": "2",
            "useCalendarDays": true,
            "deactivateTask": [],
            "deleteTask": [],
            "updateTask": [
              {
                "task": "",
                "status": ""
              }
            ],
            "invoiceFees": "",
            "createChild": "",
            "createParentOfType": "",
            "addCondition": "",
            "addConditionSeverity": "",
            "conditionType": "",
            "removeCondition": "",
            "addComment": "",
            "newStatus": "",
            "assignToUserID": ""
          }
        }
      ]
    },
    "Planning/Application/Rezoning/NA": {
      "DocumentUploadAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "documentCategory": [],
            "documentGroup": [],
            "workFlow": {},
            "isCreatedByACA": false,
            "isACAEvent": false,
            "balanceAllowed": true,
            "recordStatus": [
              "Submit Application"
            ]
          },
          "action": {
            "activateTask": [
              "Real Property Pre Acceptance",
              "Planning pre Acceptance"
            ],
            "daysOut": "2",
            "useCalendarDays": true,
            "deactivateTask": [],
            "deleteTask": [],
            "updateTask": [
              {
                "task": "",
                "status": ""
              }
            ],
            "invoiceFees": "",
            "createChild": "",
            "createParentOfType": "",
            "addCondition": "",
            "addConditionSeverity": "",
            "conditionType": "",
            "removeCondition": "",
            "addComment": "",
            "newStatus": "Submitted",
            "assignToUserID": ""
          }
        }
      ],
      "Pageflow": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "documentCategory": [],
            "documentGroup": [],
            "workFlow": {},
            "isCreatedByACA": false,
            "isACAEvent": false,
            "balanceAllowed": true,
            "recordStatus": [
              "Submit Application"
            ]
          },
          "action": {
            "activateTask": [
              "Real Property Pre Acceptance",
              "Planning pre Acceptance"
            ],
            "daysOut": "2",
            "useCalendarDays": true,
            "deactivateTask": [],
            "deleteTask": [],
            "updateTask": [
              {
                "task": "",
                "status": ""
              }
            ],
            "invoiceFees": "",
            "createChild": "",
            "createParentOfType": "",
            "addCondition": "",
            "addConditionSeverity": "",
            "conditionType": "",
            "removeCondition": "",
            "addComment": "",
            "newStatus": "Submitted",
            "assignToUserID": ""
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
            "description": "To run automated script based on JSON rules - Script 44 ",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Application Submittal",
              "Application Acceptance"
            ],
            "status": [
              "Ready to Pay"
            ],
            "isCreatedByACA": false,
            "isACAEvent": false,
            "balanceAllowed": true
          },
          "action": {
            "activateTask": [],
            "daysOut": "",
            "useCalendarDays": false,
            "deactivateTask": [
              "Application Submittal",
              "Application Acceptance"
            ],
            "deleteTask": [],
            "updateTask": [
              {
                "task": "",
                "status": ""
              }
            ],
            "invoiceFees": "",
            "createChild": "",
            "createParentOfType": "",
            "addCondition": "",
            "addConditionSeverity": "",
            "conditionType": "",
            "removeCondition": "",
            "addComment": "",
            "newStatus": "",
            "assignToUserID": "",
            "assessFees": []
          }
        }
      ],
      "PaymentReceiveAfter": [
        {
          "preScript": "",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules - Script 44 - part 2 ",
            "operators": {}
          },
          "criteria": {
            "task": [],
            "status": [],
            "isCreatedByACA": false,
            "isACAEvent": false,
            "balanceAllowed": false,
            "recordStatus": [
              "Payment Pending"
            ]
          },
          "action": {
            "activateTask": [
              "Application Submittal",
              "Application Acceptance"
            ],
            "daysOut": "",
            "useCalendarDays": false,
            "deactivateTask": [],
            "deleteTask": [],
            "updateTask": [
              {
                "task": "",
                "status": ""
              }
            ],
            "invoiceFees": "",
            "createChild": "",
            "createParentOfType": "",
            "addCondition": "",
            "addConditionSeverity": "",
            "conditionType": "",
            "removeCondition": "",
            "addComment": "",
            "newStatus": "Submitted",
            "assignToUserID": "",
            "assessFees": []
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
            "description": "To run automated script based on JSON rules",
            "operators": {}
          },
          "criteria": {
            "task": [
              "Application Submittal"
            ],
            "status": [
              "Ready to Pay"
            ],
            "isCreatedByACA": false,
            "isACAEvent": false,
            "balanceAllowed": true
          },
          "action": {
            "activateTask": [],
            "daysOut": "",
            "useCalendarDays": false,
            "deactivateTask": [],
            "deleteTask": [],
            "updateTask": [
              {
                "task": "",
                "status": ""
              }
            ],
            "invoiceFees": "",
            "createChild": "",
            "createParentOfType": "",
            "addCondition": "",
            "addConditionSeverity": "",
            "conditionType": "",
            "removeCondition": "",
            "addComment": "",
            "newStatus": "",
            "assignToUserID": "",
            "assessFees": [
              {
                "feeSchedule": "PLN_ADDRESS",
                "feeCode": "PLN_M_ADD_02",
                "feeQuantity": "1",
                "feeInvoice": "Y",
                "feePeriod": "FINAL"
              }
            ]
          }
        }
      ]
    }
  }