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
          "description": "Script 172a.",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Request Complete"
          ],
          "status": [
            "Complete"
          ],
          "workFlow": {
            "Traffic Investigation": [
              "No Change Warranted"
            ]
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
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 172b.",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Request Complete"
          ],
          "status": [
            "Complete"
          ],
          "workFlow": {
            "Traffic Investigation": [
              "Refer to Code Enforcement"
            ]
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
          "newStatus": "Refer to Code Enforcement",
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
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 172c.",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Request Complete"
          ],
          "status": [
            "Complete"
          ],
          "workFlow": {
            "Traffic Investigation": [
              "Refer to Forestry"
            ]
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
          "newStatus": "Refer to Forestry",
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
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 172d.",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Request Complete"
          ],
          "status": [
            "Complete"
          ],
          "workFlow": {
            "Traffic Investigation": [
              "Draft Work Order"
            ]
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
          "newStatus": "Work Order Complete",
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
          "description": "Script 333",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Completeness Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "License Agreement"
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Master License Agreement"
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Addendum"
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
              "feeCode": "PW_AGR_04",
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Assignment of a License"
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
              "feeCode": "PW_AGR_04",
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Pre-License Agreement"
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
              "feeCode": "PW_AGR_02",
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Revocable License (Commercial)"
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
              "feeCode": "PW_AGR_03",
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Revocable License (Residential)"
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
              "feeCode": "PW_AGR_03",
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
          "customFields": {
            "Review Fee?": "Yes",
            "License Type": "Supplemental Site License"
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
              "feeCode": "PW_AGR_04",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "FINAL"
            }
          ]
        }
      }
    ]
  },
  "PublicWorks/Drainage/NA/NA": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Type": "Master Drainage Report"
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
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_CIVIL_03",
              "feeCode": "PW_CIVIL_05",
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
          "description": "123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Type": "Preliminary Drainage Letter"
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
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_CIVIL_03",
              "feeCode": "PW_CIVIL_04",
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
          "description": "123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Type": "Preliminary Drainage Report"
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
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_CIVIL_03",
              "feeCode": "PW_CIVIL_03",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "FINAL"
            }
          ]
        }
      }
    ]
  },
  "PublicWorks/Civil Plan/Review/NA": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Fee?": "Yes",
            "Submittal Number": "1"
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
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_CIVIL_01",
              "feeCode": "PW_CIVIL_01",
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
          "description": "123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Fee?": "Yes",
            "Submittal Number": "3"
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
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_CIVIL_01",
              "feeCode": "PW_CIVIL_07",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "FINAL"
            }
          ]
        }
      }
    ]
  },
  "PublicWorks/Civil Plan/Revision/NA": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "123",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Quality Check"
          ],
          "status": [
            "Ready to Pay"
          ],
          "customFields": {
            "Review Fee?": "Yes",
            "Submittal Number": "1"
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
          "invoiceFees": "Y",
          "createChild": "",
          "createParent": "",
          "addCondition": "",
          "removeCondition": "",
          "addComment": "",
          "newStatus": "",
          "assessFees": [
            {
              "feeSchedule": "PW_CIVIL_02",
              "feeCode": "PW_CIVIL_02",
              "feeQuantity": 1,
              "feeInvoice": "Y",
              "feePeriod": "FINAL"
            }
          ]
        }
      }
    ]
  },
  "PublicWorks/Public Improvement/Permit/NA": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "Script 383",
          "operators": {}
        },
        "criteria": {
          "task": [
            "Fee Processing"
          ],
          "status": [
            "Ready to Pay"
          ]
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
          "newStatus": ""
        }
      }
    ]
  }
}