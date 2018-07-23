//this global function can be used to quickly get a string of the contents of an object
//such as a fee array or contact array.

function printObject(theobject)
{
	var debugline = "";
	for (var item in theobject )
	{	
		debugline += ">>>>>>>>> ITEM " + item + " <<<<<<<<<";
		for (var prop in theobject[item])
		{
			debugline += prop + ":" + theobject[item][prop] + ", ";
		}
		debugline += "<br><br>";
	}
	return debugline;
}