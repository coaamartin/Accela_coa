{
  "Building/Permit/*/Amendment": {
    "PaymentReceiveAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "isCreatedByACA": "",
          "balanceAllowed": false,
          "recordStatus": [
            "Payment Pending"
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            {
              "task": "Fee Processing",
              "status": "Complete"
            }
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "Approved",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ]
  },
  "Building/Permit/Master/NA": {
    "PaymentReceiveAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "isCreatedByACA": "",
          "balanceAllowed": false,
          "recordStatus": [
            "Payment Pending"
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            {
              "task": "Fee Processing",
              "status": "Complete"
            }
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "Approved",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ]
  },
  "Building/Permit/Plans/Amendment": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Fee Processing"
          ],
          "status": [
            "Complete"
          ],
          "isCreatedByACA": "",
          "balanceAllowed": false,
          "recordStatus": [
            
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "Approved",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ]
  },
  "Building/Permit/New Building/NA": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 51",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Inspection Phase"
          ],
          "status": [
            "Final"
          ],
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": [
            
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            "Certificate of Occupancy",
			"Blackflow Preventor", 
			"Water Meter"
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "Closed",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 51",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Inspection Phase"
          ],
          "status": [
            "Expired"
          ],
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": [
            
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            "Certificate of Occupancy",
			"Backflow Preventor",
			"Water Meter"
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "Expired",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Water Meter"
          ],
          "status": [
            "Final"
          ],
          "customFields": {
            "Single Family Detached Home": "Yes"
          },
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": [
            
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            "Backflow Preventor"
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Inspection Phase"
          ],
          "status": [
            "Final",
            "Expired"
          ],
          "customFields": {
            "": ""
          },
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": [
            
          ]
        },
        "action": {
          "activateTask": [
            
          ],
          "daysOut": "",
          "deactivateTask": [
            "Certificate of Occupancy",
			"Blackflow Preventor", 
			"Water Meter"
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "Closed",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ]
  },
  "Building/*/*/*": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
          ],
          "status": [
          ],
          "isCreatedByACA": "",
          "balanceAllowed": "",
          "recordStatus": [
            
          ]
        },
        "action": {
          "activateTask": [
          ],
          "daysOut": "",
          "deactivateTask": [
            
          ],
          "deleteTask": [
            
          ],
          "updateTask": [
            
          ],
          "invoiceFees": "",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "addConditionSeverity": "",
          "conditionType": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assignToUserID": "",
          "assessFees": [
            {
              "feeSchedule": "",
              "feeCode": "",
              "feeQuantity": "",
              "feeInvoice": "",
              "feePeriod": ""
            }
          ]
        }
      }
    ]
  }
}