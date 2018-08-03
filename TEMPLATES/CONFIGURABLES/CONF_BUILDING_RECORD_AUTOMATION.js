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
      ],
      "WorkflowTaskUpdateAfter": [
          {
              "preScript": "",
              "postScript": "",
              "metadata": {
                "description": "To run automated script based on JSON rules - Script 418 c",
                "operators": {
                    "status":"",
                    "customFields":"!="
                        }
              },
              "criteria": {
                "task": ["Accepted In House"],
                "status": ["Route for Review"],
                "customFields": {
                  "Master Plan Type": "Other"
                },
                "isCreatedByACA": "",
                "balanceAllowed": "",
                "recordStatus": [
                ]
              },
              "action": {
                "activateTask": ["Structural Plan Review","Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review",
       "Fire Life Safety Review" , "Bldg Life Safety Review", "Structural Engineering Review"],
                "daysOut": "21",
                "deactivateTask": [],
                "updateTask": [              ],
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
    },
    "Building/Permit/Plans/NA": {
      "PaymentReceiveAfter": [
        {
          "preScript": "",
          "postScript": "postScript35-Plans",
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
                "task": "Permit Issuance",
                "status": "Issued"
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
            "newStatus": "Issued",
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
              "Certificate of Occupancy"
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
              "Certificate of Occupancy"
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
            "description": "To run automated script based on JSON rules - Script 418 a",
            "operators": {        }
          },
          "criteria": {
            "task": ["Accepted In House"],
            "status": ["Routed for Review"],
            "customFields": {
              "Project Category": "Custom Home"
            },
            "isCreatedByACA": "",
            "balanceAllowed": "",
            "recordStatus": [
            ]
          },
          "action": {
            "activateTask": ["Structural Plan Review" ,"Electrical Plan Review" ,"Mechanical Plan Review" ,"Plumbing Plan Review" ,"Structural Engineering Review" ,
			                 "Fire Life Safety Review" ,"Real Property Review" ,"Water Review" ,"Zoning Review" ,"Engineering Review" ,"Traffic Review" ,
							 "Waste Water Review" ,"Forestry Review" ,"Bldg Life Safety Review" ,"Planning Review"
            ],
            "daysOut": "21",
            "deactivateTask": [],
            "updateTask": [              ],
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
            "description": "To run automated script based on JSON rules - Script 418 a",
            "operators": {        }
          },
          "criteria": {
            "task": ["Accepted In House"],
            "status": ["Routed for Review"],
            "customFields": {
              "Project Category": "Single Family From Master"
            },
            "isCreatedByACA": "",
            "balanceAllowed": "",
            "recordStatus": [
            ]
          },
          "action": {
            "activateTask": ["Structural Plan Review" ,"Electrical Plan Review" ,"Mechanical Plan Review" ,"Plumbing Plan Review" ,"Structural Engineering Review" ,
			                 "Fire Life Safety Review" ,"Real Property Review" ,"Water Review" ,"Zoning Review" ,"Engineering Review" ,"Traffic Review" ,
							 "Waste Water Review" ,"Forestry Review" ,"Bldg Life Safety Review" ,"Planning Review"
            ],
            "daysOut": "21",
            "deactivateTask": [],
            "updateTask": [              ],
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
            "description": "To run automated script based on JSON rules - Script 418 a",
            "operators": {        }
          },
          "criteria": {
            "task": ["Accepted In House"],
            "status": ["Routed for Review"],
            "customFields": {
              "Project Category": "Multi-Family Building"
            },
            "isCreatedByACA": "",
            "balanceAllowed": "",
            "recordStatus": [
            ]
          },
          "action": {
            "activateTask": ["Structural Plan Review" ,"Electrical Plan Review" ,"Mechanical Plan Review" ,"Plumbing Plan Review" ,"Structural Engineering Review" ,
			                 "Fire Life Safety Review" ,"Real Property Review" ,"Water Review" ,"Zoning Review" ,"Engineering Review" ,"Traffic Review" ,
							 "Waste Water Review" ,"Forestry Review" ,"Bldg Life Safety Review" ,"Planning Review"
            ],
            "daysOut": "21",
            "deactivateTask": [],
            "updateTask": [              ],
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
            "description": "To run automated script based on JSON rules - Script 418 b",
            "operators": { "customFields":"!=" }
          },
          "criteria": {
            "task": ["Accepted In House"],
            "status": ["Routed for Review"],
            "customFields": {
              "Project Category": ["Single Family From Master","Custom Home", "Multi-Family Building"]
            },
            "isCreatedByACA": "",
            "balanceAllowed": "",
            "recordStatus": [
            ]
          },
          "action": {
            "activateTask": ["Structural Plan Review" ,"Electrical Plan Review" ,"Mechanical Plan Review" ,"Plumbing Plan Review" ,"Structural Engineering Review" ,
			                 "Fire Life Safety Review" ,"Real Property Review" ,"Water Review" ,"Zoning Review" ,"Engineering Review" ,"Traffic Review" ,
							 "Waste Water Review" ,"Forestry Review" ,"Bldg Life Safety Review" ,"Planning Review"],
            "daysOut": "26",
            "deactivateTask": [],
            "updateTask": [              ],
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
              "Certificate of Occupancy"
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
      ],
      "PaymentReceiveAfter": [
        {
          "preScript": "",
          "postScript": "postScript35-NewBuilding",
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
                "task": "Permit Issuance",
                "status": "Issued"
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
            "newStatus": "Issued",
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