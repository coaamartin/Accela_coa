//this global function can be used to quickly get a string of the contents of an object
//such as a fee array or contact array.

function prettyprintObject(theobject)
{
	for (var item in theobject )
	{	
		logDebug(">>>>>>>" + item + "<<<<<<<");
		var debugline = "";
		for (var prop in theobject[item])
		{
			debugline += prop + ":" + theobject[item][prop] + ", ";
		}
		return debugline;
	}
}