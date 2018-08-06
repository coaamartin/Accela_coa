logDebug("Script 55 Starting");
if (ifTracer(matchARecordType([
      "Forestry/Permit/NA/NA",
      "Forestry/Request/Citizen/NA"
  ], appTypeString), 'Record type matches.')) {
        include("55_AfterForestryFieldCrewInspection");
}
"