
function updateTaskAssignedDate(wfstr,wfAssignDate) // optional process name
                {
                // Update the task assignment date
                //
                var useProcess = false;
                var processName = "";
                if (arguments.length == 3)
                                {
                                processName = arguments[2]; // subprocess
                                useProcess = true;
                                }
                var workflowResult = aa.workflow.getTasks(capId);
                if (workflowResult.getSuccess())
                                var wfObj = workflowResult.getOutput();
                else
                                { logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }

                for (i in wfObj)
                                {
                                var fTask = wfObj[i];
                                if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
                                                {
                                                var assignDate = aa.util.now();
                                                var tempDate = new Date(wfAssignDate);
                                                assignDate.setTime(tempDate.getTime())
                                                if (assignDate)
                                                                {
                                                                var taskItem = fTask.getTaskItem();
                                                                taskItem.setAssignmentDate(assignDate);

                                                                var adjustResult = aa.workflow.adjustTaskWithNoAudit(taskItem);
                                                                if (adjustResult.getSuccess())
                                                                                {logDebug("Updated Workflow Task : " + wfstr + " Assigned Date to " + wfAssignDate);}
                                                                else
                                                                                {logDebug("Error updating wfTask : " + adjustResult.getErrorMessage());}
                                                                }
                                                else
                                                                logDebug("Couldn't update assigned date.  Invalid date : " + wfAssignDate);
                                                }
                                }
                }
