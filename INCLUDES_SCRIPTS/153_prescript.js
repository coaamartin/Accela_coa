
script153_prescript();

function script153_prescript() {
    logDebug('script153_prescript() starting');
    if (!isTaskActive("Tree Planting Intake")) {
        cancelCfgExecution = true;
     }
}