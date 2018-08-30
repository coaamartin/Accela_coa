function treeInventoryPopulate()
	{
	// get address
	
	var myAddr = aa.address.getAddressByCapId(capId);
	var addrArray = new Array();
	var addrArray = myAddr.getOutput();
	if(addrArray.length != 0)
		{
		//use 1st address
		var thisHouseNumberStart = addrArray[0].getHouseNumberStart()== null ? "" : addrArray[0].getHouseNumberStart() + " ";
		var thisStreetDirection	= addrArray[0].getStreetDirection()== null ? "" : addrArray[0].getStreetDirection() + " ";
		var thisStreetName = addrArray[0].getStreetName()== null ? "" : addrArray[0].getStreetName() + " ";
		var thisStreetSuffix = addrArray[0].getStreetSuffix()== null ? "" : addrArray[0].getStreetSuffix()
		var capAddress = thisHouseNumberStart + thisStreetDirection + thisStreetName + thisStreetSuffix
		// get tree data
		var arrGIS = new Array;
		arrGIS = getGISBufferInfo("AURORACO","Trees","100","TREE_ID_NO","ADDRESS")
		logDebug("arrGIS Length " + arrGIS.length)
		for(x in arrGIS){
			var thisGIS = arrGIS[x];
			var treeIdNo = thisGIS["TREE_ID_NO"];
			var manUnit = thisGIS["MAN_UNIT"];
			var diameter = thisGIS["DIAMETER"];
			var species = thisGIS["SPECIES"];
			var TreeAdd = thisGIS["ADDRESS"];
			if(TreeAdd == capAddress)
				{
				logDebug("Tree " + treeIdNo + " has an address match TreeAdd " + TreeAdd + " = capAddress " + capAddress)
				//if (!doesASITRowExist("TREE INFORMATION", "Tree ID", treeIdNo)) {
					newRow = new Array();
					newRow["Tree ID"] = new asiTableValObj("Tree ID", treeIdNo, "N");	
					if (manUnit && manUnit != "")
						newRow["Management Unit"] = new asiTableValObj("Management Unit", manUnit, "N");
					else 
						newRow["Management Unit"] = new asiTableValObj("Management Unit", "", "N");
					if (diameter && diameter != "")
						newRow["Existing Diameter"] = new asiTableValObj("Existing Diameter", diameter, "N");
					else 
						newRow["Existing Diameter"] = new asiTableValObj("Existing Diameter", "", "N");
					if (species && species != "")
						newRow["Species"] = new asiTableValObj("Species", species, "N");
					else 
						newRow["Species"] = new asiTableValObj("Species", "", "N");
					addToASITable("TREE INFORMATION", newRow);
					//}
				}
			else
				{
				logDebug("Tree " + treeIdNo + " has NO address match TreeAdd " + TreeAdd + " = capAddress " + capAddress)
				}
			}
		}
	}