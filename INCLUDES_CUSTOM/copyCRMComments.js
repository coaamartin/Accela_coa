function copyCRMComments(){


//Start the copying of the CRM URL to the child record comments; 
 var recID = getAppSpecific("Core Request ID");
  var crmURL = getAppSpecific("CRM URL");
	var childRec = getChildren("*/*/*/*", capId);
	var urlFlag = false;
	var orgId = capId;  
	for(x in childRec){
		

					cRec = childRec[x];
					
					capId = cRec; 


					ccsm = aa.cap.createCapCommentScriptModel();
	ccsm.setCapIDModel(capId);
	ccm = ccsm.getCapCommentModel();
	getResult = aa.cap.getCapComment(ccm);
	if (getResult.getSuccess()) {
		commentArray = getResult.getOutput();
		if (commentArray != null) {
			for (cIndex in commentArray) {
				
				thisComment = commentArray[cIndex];
				thisText = thisComment.getText();
				logDebug("ThisText" + thisText);
				var stringMatch; 
				stringMatch = thisText.search("publicstuff.com")
				logDebug("StringMatch" + stringMatch);
				var noMatch = -1;
				if(stringMatch != noMatch){
					
					logDebug("Match Found");
                    urlFlag = true;
					break;
					
				}
				
				
				
				}
			}
		}
		        logDebug("URL FLAG IS" + " " + urlFlag);
				if(!urlFlag){
				createCapComment(crmURL,cRec);
				}
		
		}
		capId = orgId;

//End copying 
//Start Copying Subsequent CRM Comments; 

	ccsm = aa.cap.createCapCommentScriptModel();
	ccsm.setCapIDModel(capId);
	ccm = ccsm.getCapCommentModel();
	getResult = aa.cap.getCapComment(ccm);
	if (getResult.getSuccess()) {
		commentArray = getResult.getOutput();
		if (commentArray != null) {
			for (cIndex in commentArray) {
				
				thisComment = commentArray[cIndex];
				thisText = thisComment.getText();
				//logDebug("Shadow Record comment" + thisComment);
				logDebug("Shadow Record comment" + thisText);
												
				for(x in childRec){
					
					cRec = childRec[x];
					createCapComment(thisText,cRec);
					
					
				}

				
				break;	
				}
			}
		}
}	 