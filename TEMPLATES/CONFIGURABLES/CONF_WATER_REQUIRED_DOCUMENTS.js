{  "Water/Utility/Permit/NA": {
    "WorkflowTaskUpdateBefore": [
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
            "Asset Numbering Plan"
          ],
          "status": [
            "Accepted"
          ]
        },
        "action": {
          "requiredDocuments": [
            "Asset Numbering Plan"
          ],
          "requirementType": "STANDARD",
          "validationMessage": "Asset Numbering Plan is required to accept this task"
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
            "Final Acceptance Inspection"
          ],
          "status": [
            "Warranty Work Required"
          ]
        },
        "action": {
          "requiredDocuments": [
            "Warranty Work Punch List"
          ],
          "requirementType": "STANDARD",
          "validationMessage": "Warranty Work Punch List is required for Warranty Work Required status"
        }
      }
    ]
  }
}