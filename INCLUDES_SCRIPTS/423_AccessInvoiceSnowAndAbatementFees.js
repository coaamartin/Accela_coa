script423_AccessInvoiceSnowAndAbatementFees();

function script423_AccessInvoiceSnowAndAbatementFees() {
    var abatementType,
        feeAmt;

    if(ifTracer(aa.env.getValue("EventName") == "InspectionResultSubmitAfter")) {

        if(ifTracer(appTypeString == "Enforcement/Incident/Snow/NA", "appTypeString == Enforcement/Incident/Snow/NA")) {
            if(ifTracer(inspResult == "Snow Fee Posted" || inspResult == "Snow Fee Served", "inspResult == Snow Fee Served or Posted")) {
                var snowFeeType = AInfo["Snow Fee Type"];
                if(snowFeeType =="Residential Snow Fee") {
                    updateFee("ENF_SNW_01", "ENF_SNOW", "FINAL", 1, "Y");
                } else if(snowFeeType =="Commercial Snow Fee") {
                    updateFee("ENF_SNW_02", "ENF_SNOW", "FINAL", 1, "Y");
                }
            }
        } else if(ifTracer(appTypeString == "Enforcement/Incident/Abatement/NA", "appTypeString == Enforcement/Incident/Abatement/NA")) {
            abatementType = AInfo["Abatement Type"];
            if(ifTracer(abatementType == "Graffiti", "abatementType == Graffiti")) {
                var techHrs1 = isNaN(AInfo['GON 1 Tech Hours']) ? 0 : Info['GON 1 Tech Hours'];
                var techHrs2 = isNaN(AInfo['GON 2 Tech Hours']) ? 0 : Info['GON 2 Tech Hours'];
                var paint = isNaN(AInfo['Paint']) ? 0 : Info['Paint'];
                var paintRollers = isNaN(AInfo['Paint Rollers']) ? 0 : Info['Paint Rollers'];
                var paintRemovalMaterials = isNaN(AInfo['Paint Removal Materials']) ? 0 : Info['Paint Removal Materials'];
                var miscMaterials = isNaN(AInfo['Miscellaneous Materials']) ? 0 : Info['Miscellaneous Materials'];
            
                feeAmt = 
                        (techHrs1 * 51) +
                        (techHrs2 * 51) +
                        paint +
                        paintRollers +
                        paintRemovalMaterials +
                        miscMaterials;
    
                editAppSpecific("Contractor Fee - Graffiti", feeAmt);
            }

        } 
    } else if(ifTracer(aa.env.getValue("EventName") == "WorkflowtaskUpdateAfter")) {
        abatementType = AInfo["Abatement Type"];
        if(ifTracer(abatementType == "Snow", "abatementType == Snow")) {
            feeAmt = isNaN(AInfo['Contractor Fee - Snow']) ? 0 : Info['Contractor Fee - Snow'];
            updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
        }
        if(ifTracer(abatementType == "Board-Up", "abatementType == Board-Up")) {
            updateFee("ENF_ABT_01", "ENF_ABATE", "FINAL", 1, "Y");
            feeAmt = isNaN(AInfo['Contractor Fee - Board-Up']) ? 0 : Info['Contractor Fee - Board-Up'];
            updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
        }
        if(ifTracer(abatementType == "Graffiti", "abatementType == Graffiti")) {
            feeAmt = isNaN(AInfo['Contractor Fee - Graffiti']) ? 0 : Info['Contractor Fee - Graffiti'];
            updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
        }
        if(ifTracer(abatementType == "City", "abatementType == City")) {
            feeAmt = 
                isNaN(AInfo['Contractor Fee - Snow']) ? 0 : Info['Contractor Fee - Snow']
                + isNaN(AInfo['Contractor Fee - Board-Up']) ? 0 : Info['Contractor Fee - Board-Up']
                + isNaN(AInfo['Contractor Fee - Weeds']) ? 0 : Info['Contractor Fee - Weeds']
                + isNaN(AInfo['Contractor Fee - Trash']) ? 0 : Info['Contractor Fee - Trash']
            updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
        }
        if(ifTracer(abatementType == "Regular", "abatementType == Regular")) {
            //todo
         //   feeAmt = isNaN(AInfo['Contractor Fee - Graffiti']) ? 0 : Info['Contractor Fee - Graffiti'];
         //   updateFee("ENF_ABT_04", "ENF_ABATE", "FINAL", feeAmt, "Y");
        }
    } 
}