{
    "Water/Water/Lawn Irrigation/Permit": {
      "PaymentReceiveAfter": [
        {
          "preScript": " ",
          "postScript": "",
          "metadata": {
            "description": "Script 411",
            "operators": {
              
            }
          },
          "criteria": {
            "recordStatus": [
              
            ],
            "isCreatedByACA": false,
            "balanceAllowed": false,
          },
          "action": {
            "daysOut": "",
            "deactivateTask": [
              
            ],
            "deleteTask": [
              
            ],
            "updateTask": [
              {
                "task": "Fee Processing",
                "status": "Fees Paid"
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
            "newStatus": "",
            "assignToUserID": "",
            "assessFees": [
              {
                "feeSchedule": "",
                "feeCode": "",
                "feeQuantity": 0,
                "feeInvoice": "",
                "feePeriod": ""
              }
            ]
          }
        }
      ]
    },
    "Water/Water/Irrigation Plan Review/NA": {
      "DocumentUploadAfter": [
        {
          "preScript": " ",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {
              
            }
          },
          "criteria": {
            "documentCategory": [
              "WAT_IPLAN"
            ],
            "documentGroup": [
              "Irrigation Plan"
            ],
            "recordStatus": [
              
            ]
          },
          "action": {
            "activateTask": [
              "Fee Processing"
            ],
            "daysOut": "",
            "deactivateTask": [
              
            ],
            "deleteTask": [
              
            ],
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
                "feeQuantity": 0,
                "feeInvoice": "",
                "feePeriod": ""
              }
            ]
          }
        }
      ],
      "PaymentReceiveAfter": [
        {
          "preScript": " ",
          "postScript": "",
          "metadata": {
            "description": "Script 411",
            "operators": {
              
            }
          },
          "criteria": {
            "recordStatus": [
              
            ],
            "isCreatedByACA": false,
            "balanceAllowed": false,
          },
          "action": {
            "daysOut": "",
            "deactivateTask": [
              
            ],
            "deleteTask": [
              
            ],
            "updateTask": [
              {
                "task": "Fee Processing",
                "status": "Fees Paid"
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
            "newStatus": "",
            "assignToUserID": "",
            "assessFees": [
              {
                "feeSchedule": "",
                "feeCode": "",
                "feeQuantity": 0,
                "feeInvoice": "",
                "feePeriod": ""
              }
            ]
          }
        }
      ],
      "WorkflowTaskUpdateAfter": [
        {
          "preScript": " ",
          "postScript": "",
          "metadata": {
            "description": "To run automated script based on JSON rules",
            "operators": {
              
            }
          },
          "criteria": {
            "task": [
              "Application Submittal"
            ],
            "status": [
              "Plans Required"
            ],
            "recordStatus": [
              
            ]
          },
          "action": {
            "activateTask": [
              
            ],
            "daysOut": "",
            "deactivateTask": [
              "Fee Processing"
            ],
            "deleteTask": [
              
            ],
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
                "feeQuantity": 0,
                "feeInvoice": "",
                "feePeriod": ""
              }
            ]
          }
        }
      ]
    },
    "Water/Water/SWMP/Permit": {
        "InspectionResultSubmitAfter": [
        {
          "preScript": "script395_prescript_pondRowsMustExist",
          "postScript": "",
          "metadata": {
            "description": "Script 395",
            "operators": {
              
            }
            },
            "criteria": {
                "inspectionTypePerformed": [
                  "Routine Inspections"
                ],
                "inspectionResult": [
                  "Ready for Final"
                ]
              },
            "action": {
              "activateTask": [
                {
                    "task": "Active Permit",
                    "status": "Ready for Final Certification"
                  },
                  {
                      "task": "Final Certification",
                      "status": "Upload Pending"
                  }                
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
                  "feeQuantity": 0,
                  "feeInvoice": "",
                  "feePeriod": ""
                }
              ]
            }
          }
        ]
      }
  }