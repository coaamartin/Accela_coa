{
    "Water/Water/SWMP/Permit": {
      "InspectionResultSubmitAfter": [
        {
          "preScript": "",
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
              "Routine Pass"
            ]
          },
          "action": {
            "inspectionType": "Routine Inspections",
            "rangeType": "Days",
            "range": 30,
            "sameInspector": true,
            "inspectionCopyComment": false
          }
        },
        {
          "preScript": "",
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
              "Fail"
            ]
          },
          "action": {
            "inspectionType": "Routine Inspections",
            "rangeType": "Days",
            "range": 3,
            "sameInspector": true,
            "inspectionCopyComment": false
          }
        },
        {
          "preScript": "",
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
              "Immediate Clean Up Order"
            ]
          },
          "action": {
            "inspectionType": "Routine Inspections",
            "rangeType": "Days",
            "range": 1,
            "sameInspector": true,
            "inspectionCopyComment": false
          }
        },
        {
          "preScript": "395_prescript_pondRowsMustNotExist",
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
            "taskName": "Active Permit",
            "taskStatus": "Ready for Closure No Pond",
            "inspectionType": "Final Inspection",
            "rangeType": "Days",
            "range": 30,
            "sameInspector": false,
            "inspectionCopyComment": false          
          }
        },
        {
          "preScript": "395_prescript_pondRowsMustNotExist",
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
            "taskName": "Closure",
            "taskStatus": "Pending Final Inspection"
          }
        },
        {
          "preScript": "",
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
              "Permittee Photo Approved"
            ]
          },
          "action": {
            "inspectionType": "Routine Inspections",
            "rangeType": "Days",
            "range": 30,
            "sameInspector": true,
            "inspectionCopyComment": false
          }
        }
      ]
    }
  }