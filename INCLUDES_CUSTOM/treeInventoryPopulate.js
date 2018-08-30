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
		newRow = new Array();
		arrGIS = getGISBufferInfo("AURORACO","Trees","100","TREE_ID_NO","MAN_UNIT","DIAMETER","SPECIES","ADDRESS")
		logDebug("arrGIS Length " + arrGIS.length)
		for(x in arrGIS){
			//newRow = new Array();
			var thisGIS = arrGIS[x];
			var treeIdNo = thisGIS["TREE_ID_NO"];
			var manUnit = thisGIS["MAN_UNIT"];
			var diameter = thisGIS["DIAMETER"];
			var species = thisGIS["SPECIES"];
			var TreeAdd = thisGIS["ADDRESS"];
			if(TreeAdd == capAddress)
				{
				logDebug("Tree " + treeIdNo + " has an address match TreeAdd " + TreeAdd + " = capAddress " + capAddress)
				logDebug("treeIdNo " + treeIdNo)
				logDebug("manUnit " + manUnit)
				logDebug("diameter " + diameter)
				logDebug("species " + species)
				//newRow["Tree ID"] = new asiTableValObj("Tree ID", treeIdNo, "N");	
				newRow["Tree ID"] = treeIdNo
				newRow["Management Unit"] = manUnit
				newRow["Existing Diameter"] = diameter
				newRow["Species"] = species
				addToASITable("TREE INFORMATION", newRow);
				}
			}
		}
	}