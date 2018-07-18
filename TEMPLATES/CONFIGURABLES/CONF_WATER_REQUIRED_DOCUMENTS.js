{
  "Water/Water/Irrigation Plan Review/NA": {
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
            "Application Submittal"
          ],
          "status": [
            "Plans Required"
          ]
        },
        "action": {
          "requiredDocuments": [
            "Irrigation Plan"
          ],
          "requirementType": "STANDARD",
          "validationMessage": "You must Upload the Irrigation Plan to complete your submission"
        }
      }
    ]
  },
  "Water/Utility/Permit/NA": {
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
            "Warrant Work Punch List"
          ],
          "requirementType": "STANDARD",
          "validationMessage": "Warrant Work Punch List is required for Warranty Work Required status"
        }
      }
    ]
  }
}