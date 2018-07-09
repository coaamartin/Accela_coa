{
  "Building/Enforcement/Notice of Violation/NA": {
    "WorkflowTaskUpdateAfter": [
      {
        "preScript": "",
        "postScript": "postBuildingInspectionScheduling",
        "metadata": {
          "description": "To run automated script based on JSON rules - Script 329",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Complaint Intake"
          ],
          "status": [
            "Assigned"
          ]
        },
        "action": {
          "inspectionType": "Investigation",
          "rangeType": "Days",
          "range": 0,
          "assignment": "Record",
          "inspector": "",
          "department": "",
          "comments":"by auto script"
        }
      },
      {
        "preScript": "",
        "postScript": "postBuildingInspectionScheduling",
        "metadata": {
          "description": "To run automated script based on JSON rules",
          "operators": {
            
          }
        },
        "criteria": {
          "task": [
            "Pre Hearing Inspection"
          ],
          "status": [
            "Extension"
          ]
        },
        "action": {
          "inspectionType": "Investigation",
          "rangeType": "Days",
          "range": 0,
          "assignment": "Record",
          "inspector": "",
          "department": ""
        }
      }
    ]
  }
}