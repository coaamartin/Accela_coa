function getInspId(inspType) {
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        var inspList = inspResultObj.getOutput();

        for (xx in inspList)
            var counter = inspList.length - 1;
        if (counter = xx) {
            if (String(inspType).equals(inspList[xx].getInspectionType()))
                return inspList[xx].getIdNumber();
        }
    }
    return false;
}