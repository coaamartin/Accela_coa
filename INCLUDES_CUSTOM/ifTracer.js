/*
 * Helper
 * 
 * Desc:			
 * Used to display results of boolean condition
 * often wrapped in if statement as follows:
 *  if(ifTracer(''foo == 'bar', 'foo equals bar')) {}
 * 
*/

function ifTracer (cond, msg) {
    cond = cond ? true : false;
    logDebug((cond).toString().toUpperCase() + ': ' + msg);
    return cond;
}