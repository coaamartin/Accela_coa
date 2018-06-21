{
  "PublicWorks/Pavement Design/NA/NA": {
    "ConvertToRealCAPAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {}
        },
        "criteria": {
          "isCreatedByACA": true,
          "balanceAllowed": "",
          "recordStatus": []
        },
        "action": {
          "prescript": "",
          "activateTask": [],
          "daysOut": "",
          "deactivateTask": [],
          "deleteTask": [],
          "updateTask": [
            {}
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": " ",
              "feeQuantity": 1,
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ],
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "workFlow": {},
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": []
        },
        "action": {
          "prescript": "",
          "activateTask": [],
          "daysOut": "",
          "deactivateTask": [
            ""
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
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_PAVE",
              "feeCode": "PW_CIVIL_06",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "Final"
            }
          ]
        }
      }
    ]
  },
  "PublicWorks/Traffic/Traffic Engineering Request/NA": {
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
            "Manager Review"
          ],
          "status": [
            "Approved"
          ],
          "workFlow": {
            "Traffic Investigation": "No Change Warranted"
          },
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": []
        },
        "action": {
          "prescript": "",
          "activateTask": [],
          "daysOut": "",
          "deactivateTask": [
            "Generate Work Order"
          ],
          "deleteTask": [],
          "updateTask": [
            {
              "task": "Application Submittal",
              "status": "Complete"
            }
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "No Change Warranted",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": " ",
              "feeQuantity": 0,
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ]
  },
  "PublicWorks/Real Property/License Agreement/NA": {
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
            "Completeness Check"
          ],
          "status": [
            "Complete"
          ],
          "customFields": {
            "Review Fee?": "Yes"
          },
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": []
        },
        "action": {
          "prescript": "",
          "activateTask": [],
          "daysOut": "",
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
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_LIC_AGR",
              "feeCode": "PW_AGR_01",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "FINAL"
            }
          ]
        }
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "333",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Completeness Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {},
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": []
        },
        "action": {
          "prescript": "",
          "activateTask": [],
          "daysOut": "",
          "deactivateTask": [],
          "deleteTask": [],
          "updateTask": [
            {
              "task": "",
              "status": ""
            }
          ],
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_LIC_AGR",
              "feeCode": "PW_AGR_01",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "FINAL"
            }
          ]
        }
      }
    ]
  }
}