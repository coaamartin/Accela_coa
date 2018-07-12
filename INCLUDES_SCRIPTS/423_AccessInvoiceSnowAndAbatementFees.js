script423_AccessInvoiceSnowAndAbatementFees();

function script423_AccessInvoiceSnowAndAbatementFees() {
    var abatementType,
        feeAmt = 0;

    if(ifTracer(aa.env.getValue("EventName").indexOf("InspectionResultSubmitAfter") > -1, "EventName == InspectionResultSubmitAfter")) {

        if(ifTracer(appTypeString == "Enforcement/Incident/Snow/NA", "appTypeString == Enforcement/Incident/Snow/NA")) {
            if(ifTracer(inspResult == "Snow Fee Posted" || inspResult == "Snow Fee Served", "inspResult == Snow Fee Served or Posted")) {
                var snowFeeType = AInfo["Snow Fee Type"];
                if(snowFeeType =="Residential Snow Fee") {
                    addFee("ENF_SNW_01", "ENF_SNOW", "FINAL", 1, "Y");
                } else if(snowFeeType =="Commercial Snow Fee") {
                    addFee("ENF_SNW_02", "ENF_SNOW", "FINAL", 1, "Y");
                }
            }
        } else if(ifTracer(appTypeString == "Enforcement/Incident/Abatement/NA", "appTypeString == Enforcement/Incident/Abatement/NA")) {
            abatementType = AInfo["Abatement Type"];
            if(ifTracer(abatementType == "Graffiti", "abatementType == Graffiti")) {
                
                if(ifTracer(inspResult == "Taken and Stored" && inspType == "Post Abatement Inspection - Graffiti Only", "inspType == Post Abatement Inspection - Graffiti Only && inspResult == Taken and Stored")) {
                    var techHrs1 = !AInfo['GON 1 Tech Hours'] ? 0 : parseFloat(AInfo['GON 1 Tech Hours']);
                    var techHrs2 = !AInfo['GON 2 Tech Hours'] ? 0 : parseFloat(AInfo['GON 2 Tech Hours']);
                    var paint = !AInfo['Paint'] ? 0 : parseFloat(AInfo['Paint']);
                    var paintRollers = !AInfo['Paint Rollers'] ? 0 : parseFloat(AInfo['Paint Rollers']);
                    var paintRemovalMaterials = !AInfo['Paint Removal Materials'] ? 0 : parseFloat(AInfo['Paint Removal Materials']);
                    var miscMaterials = !AInfo['Miscellaneous Materials'] ? 0 : parseFloat(AInfo['Miscellaneous Materials']);
                
                    feeAmt = 
                            (techHrs1 * 51) +
                            (techHrs2 * 51) +
                            paint +
                            paintRollers +
                            paintRemovalMaterials +
                            miscMaterials;
        
                    editAppSpecific("Contractor Fee - Graffiti", feeAmt.toFixed(2));
                }
            }

        } 
    } else if(ifTracer(aa.env.getValue("EventName") == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
        abatementType = AInfo["Abatement Type"];
        if(ifTracer(abatementType == "Snow", "abatementType == Snow")) {
            feeAmt = !AInfo['Contractor Fee - Snow'] ? 0 : parseFloat(AInfo['Contractor Fee - Snow']);
            if(feeAmt) { 
                updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
            }
        }
        if(ifTracer(abatementType == "Board-Up", "abatementType == Board-Up")) {
            updateFee("ENF_ABT_01", "ENF_ABATE", "FINAL", 1, "Y");
            feeAmt = !AInfo['Contractor Fee - Board-Up'] ? 0 : parseFloat(AInfo['Contractor Fee - Board-Up']);
            if(feeAmt) { 
                updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
            }
        }
        if(ifTracer(abatementType == "Graffiti", "abatementType == Graffiti")) {
            feeAmt = !AInfo['Contractor Fee - Graffiti'] ? 0 : parseFloat(AInfo['Contractor Fee - Graffiti']);
            if(feeAmt) { 
                updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
            }
        }
        if(ifTracer(abatementType == "City", "abatementType == City")) {
            feeAmt = 
                (!AInfo['Contractor Fee - Snow'] ? 0 : parseFloat(AInfo['Contractor Fee - Snow']))
                + (!AInfo['Contractor Fee - Board-Up'] ? 0 : parseFloat(AInfo['Contractor Fee - Board-Up']))
                + (!AInfo['Contractor Fee - Weeds'] ? 0 : parseFloat(AInfo['Contractor Fee - Weeds']))
                + (!AInfo['Contractor Fee - Trash'] ? 0 : parseFloat(AInfo['Contractor Fee - Trash']))
            if(feeAmt) { 
                updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
            }
        }
        if(ifTracer(abatementType == "Regular", "abatementType == Regular")) {
            
            var parcelConditions = getParcelConditions(null, null, "Abatement Fee", null)
            if(ifTracer(parcelConditions == null || parcelConditions.length == 0, "no Abatement Fee parcel condations")) {
                updateFee("ENF_ABT_02", "ENF_ABATE", "FINAL", 1, "Y");
            } else if(ifTracer(parcelConditions.length == 1, "One Abatement Fee parcel condations")) {
                updateFee("ENF_ABT_05", "ENF_ABATE", "FINAL", 1, "Y");
            } else {
                updateFee("ENF_ABT_06", "ENF_ABATE", "FINAL", 1, "Y");
            }


            feeAmt = 
                (!AInfo['Contractor Fee - Weeds'] ? 0 : parseFloat(AInfo['Contractor Fee - Weeds']))
                + (!AInfo['Contractor Fee - Trash'] ? 0 : parseFloat(AInfo['Contractor Fee - Trash']))
            if(feeAmt) { 
                updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
            }
        }
        logDebug('feeAmt: ' + feeAmt);

    } 
}