
// Check array whether contains object
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
       if (arr[i] === obj) {
           return true;
       }
    }
    return false;
}   