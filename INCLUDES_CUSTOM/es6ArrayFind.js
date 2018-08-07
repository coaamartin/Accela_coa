/*
 * THIS SIMULATES ES6 ARRAY.PROTOTYPE.FIND() --- BUT NOT A PROTOTYPE
 *      ALLOWS YOU TO DEFINE CUSTOM SEARCH CRITERIA BY PASSING A FUNCTION 
 *      IF YOUR FUNCTION CRITERIA = TRUE, IT RETURNS THE OBJECT
 * 
 * EXAMPLE
 *  var item = es6ArrayFind(array, function(itm) {
        return itm.guideItemText == 'Inspect' && itm.guideItemStatus == 'Yes';
    });
*/
function es6ArrayFind(array, callback) {
    if (array === null) {
      throw new TypeError('array cannot be null or undefined');
    } else if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    var list = Object(array);
    // Makes sures is always has an positive integer as length.
    var length = list.length >>> 0;
    var thisArg = arguments[2];
    for (var i = 0; i < length; i++) {
      var element = list[i];
      if ( callback.call(thisArg, element, i, list) ) {
        return element;
      }
    }
  };
  

  