{
  "Building/Enforcement/Notice of Violation/NA": {
    "InspectionResultSubmitAfter": [
      {
        "preScript": "",
        "postScript": "deactivateAllActiveTsksWhenRecClosed",
        "metadata": {
          "description": "To run automated script based on JSON rules - Script 328",
          "operators": {}
        },
        "criteria": {
          "inspectionTypePerformed": ["Pre Court Investigation"],
          "inspectionResult": ["Compliance"]
        },
        "action": {
          "newAppStatus": "Closed",
          "caseCopyComments": false,
          "rangeType": "",
          "range": 0,
          "taskName": "Pre Hearing Inspection",
          "taskStatus": "Compliance"
        }
      },
      {
        "preScript": "",
        "postScript": "",
        "metadata": {
          "description": "To run automated script based on JSON rules - Script 328",
          "operators": {}
        },
        "criteria": {
          "inspectionTypePerformed": [
            "Pre Court Investigation"
          ],
          "inspectionResult": ["Non compliance"
          ]
        },
        "action": {
          "costRangeType": "",
          "costRange": 0,
          "costFeeType": "",
          "costFeeSchedule": "",
          "costFeeName": "",
          "costFeeAmount": 0,
          "newAppStatus": "",
          "caseCreationType": "",
          "caseFailureStatus": [],
          "caseType": "",
          "caseCopyComments": false,
          "inspectionType": "",
          "inspectionCopyComment": true,
          "rangeType": "",
          "range": 0,
          "sameInspector": true,
          "createCondition": "",
          "createConditionType": "",
          "createConditionSeverity": "",
          "feeSchedule": "",
          "feeName": "",
          "feeAmount": 0,
          "taskName": "Pre Hearing Inspection",
          "taskStatus": "Non Compliance",
          "removeCondition": "",
          "removeConditionType": ""
        }
      }
     ]
  }
}