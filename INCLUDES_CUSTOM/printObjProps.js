function printObjProps (obj) {
    var idx;

    if (obj.getClass != null) {
        aa.print("************* " + obj.getClass() + " *************");
    }
    for (idx in obj) {
        if (typeof (obj[idx]) == "function") {
            try {
                aa.print(idx + ":  " + obj[idx]());
            } catch (ex) { }
        } else {
            aa.print(idx + ":  " + obj[idx]);
        }
    }
    aa.print("***********************************************");
}   