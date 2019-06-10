if (publicUser) {
    if (balanceDue <= 0 && (
                                appMatch("Water/Water/Irrigation Plan Review/NA") ||
                                appMatch("Water/Water/Tap/Application") ||
                                appMatch("Water/Water/SWMP/Application") ||
                                appMatch("Water/Water/SWMP/Renewal") ||
                                appMatch("Water/Water/SWMP/Transfer") ||
                                appMatch("Water/Water/Wet Tap/Application")
                            )

    ) 
    {
        closeTask("Application Submittal","Accepted","Updated by script","Updated by script");
    }
}