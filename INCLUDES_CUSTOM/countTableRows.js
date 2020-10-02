function countTableRows(tableName) {
    var tbl = new Array(); 
    if (typeof(tableName) == "object") 
	for(x in tableName) 
	{	
				tbl.push("1");
	}
	var tablesize = tbl.length; 
	return tablesize; 
}