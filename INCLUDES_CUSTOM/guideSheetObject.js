
function guideSheetObject(gguidesheetModel,gguidesheetItemModel)
	{
	this.gsType = gguidesheetModel.getGuideType();
	this.gsSequence = gguidesheetModel.getGuidesheetSeqNbr();
	this.gsDescription = gguidesheetModel.getGuideDesc();
	this.gsIdentifier = gguidesheetModel.getIdentifier();
	this.item = gguidesheetItemModel;
	this.text = gguidesheetItemModel.getGuideItemText()
	this.status = gguidesheetItemModel.getGuideItemStatus();
	this.comment = gguidesheetItemModel.getGuideItemComment();
	this.score = gguidesheetItemModel.getGuideItemScore();
	this.statusGroup = gguidesheetItemModel.getGuideItemStatusGroupName();
	this.resultType = aa.guidesheet.getStatusResultType(aa.getServiceProviderCode(), this.statusGroup, this.status).getOutput();
	this.info = new Array();
	this.infoTables = new Array();
	this.validTables = false;				//true if has ASIT info
	this.validInfo = false;				//true if has ASI info

	
	this.loadInfo = function() {
		var itemASISubGroupList = this.item.getItemASISubgroupList();
		//If there is no ASI subgroup, it will throw warning message.
		if(itemASISubGroupList != null)
		{
			this.validInfo = true;
			var asiSubGroupIt = itemASISubGroupList.iterator();
			while(asiSubGroupIt.hasNext())
			{
				var asiSubGroup = asiSubGroupIt.next();
				var asiItemList = asiSubGroup.getAsiList();
				if(asiItemList != null)
				{
					var asiItemListIt = asiItemList.iterator();
					while(asiItemListIt.hasNext())
					{
						var asiItemModel = asiItemListIt.next();
						this.info[asiItemModel.getAsiName()] = asiItemModel.getAttributeValue();
					}
				}
			}
		}
		

	}
	
	this.loadInfoTables = function() {

		var guideItemASITs = this.item.getItemASITableSubgroupList();
		if (guideItemASITs!=null)
		for(var j = 0; j < guideItemASITs.size(); j++)
		{
			var guideItemASIT = guideItemASITs.get(j);
			var tableArr = new Array();
			var columnList = guideItemASIT.getColumnList();
			for (var k = 0; k < columnList.size() ; k++ )
			{
				var column = columnList.get(k);
				var values = column.getValueMap().values();
				var iteValues = values.iterator();
				while(iteValues.hasNext())
				{
					var i = iteValues.next();
					var zeroBasedRowIndex = i.getRowIndex()-1;
					if (tableArr[zeroBasedRowIndex] == null) tableArr[zeroBasedRowIndex] = new Array();
					tableArr[zeroBasedRowIndex][column.getColumnName()] = i.getAttributeValue()
				}
			}
			
			this.infoTables["" + guideItemASIT.getTableName()] = tableArr;
			this.validTables = true;
		}
	}
}